const { ethers } = require("ethers");
const { adminConfig } = require("../core/config");
const { getLedgerContract, getOwner, getTokenContract } = require("../core/contracts");
const PrizeDistribution = require("../models/prizeDistribution");
const Tournament = require("../models/Tournament");
const { ledgerConfig } = require("../core/metadata");
const { parseToken } = require("../utils/utils");

let isDispersingRewards = false;
let areRewardsDispersed = false;
let tournamentId;
//let cronJob = [];
let cronJob;
exports.createTournament = async (req, res) => {

    //HOW are you gonna disperse ther rewards????
    try {

        const { adminId, startTime, endTime, prizePool, prizeDistributionId } = req.body;
        if (!adminConfig.admins.includes(adminId)) {
            return sendError(403, `Unauthorized`, res);
        }
        //const tournament = await Tournament.findOne({ tournamentId: tournamentId });
        //const { startDate, endDate, prizePool } = await getLedgerContract().connect(getDefaultRunner()).getTournamentInfo(tournamentId);
        if (startTime >= endTime) {
            return res.status(400).json({
                message: `start time should be less than endTime time`
            })
        }
        const ttt = Date.now() / 1000
        if (endTime <= Date.now() / 1000) {
            return res.status(400).json({
                message: `endDate should be greater than current time.`,
                currentTime: Date.now(),
                endTime: endTime
            })
        }
        if (prizePool <= 0) {
            return res.status(400).json({
                message: `prizePool should greater than 0`
            })
        }
        const prizeDistribution = await PrizeDistribution.findOne({ id: prizeDistributionId })
        if (!prizeDistribution) {
            return res.status(404).json({
                message: `No prizeDistribution found with Id: ${prizeDistributionId}`,
            })
        }

        const ledgerContract = await getLedgerContract();
        const tokenTx = await (await getTokenContract()).approve(ledgerConfig.address, parseToken(prizePool)).send({
            feeLimit: 100_000_000,
            shouldPollResponse: true
        });
        console.log("TOKEN::: ", tokenTx);
        const tokenReceipt = await tokenTx.wait();
        if (tokenReceipt.status != 1) {
            res.status(500).json({
                message: "approval transaction is not finalized on blockchain"
            })
        }
        const tx = await ledgerContract.startTournament(startTime, endTime, parseToken(prizePool)).send({
            feeLimit: 100_000_000,
            shouldPollResponse: true
        });
        console.log(tx);
        const receipt = await tx.wait();
        if (receipt.status == 1) {
            const tournamentId = await ledgerContract.getLastTournamentId().call();

            const tournament = await Tournament.create({
                tournamentId: (Number)(tournamentId),
                txHash: tx.hash,
                startTime: startTime,
                endTime: endTime,
                prizePool: prizePool,
                prizeDistributionId: prizeDistributionId
            });
            await tournament.save();

            const task = cron.schedule("* * * * * * ", () => {
                //Disperse  funds. for the  completed  tournament
                dispereseFundsToWinners();
            }, {
                timezone: "Asia/Kolkata"
            })
            cronJob = task;
            // cronJob.push({
            //     task: task,
            //     isDispersingRewards: false,
            //     tournamentId: tournamentId
            // }
            // );
            return res.status(201).json({
                txHash: tx.hash,
                tournamentId: (Number)(tournamentId),
                prizeDistribution: prizeDistribution
            })
        }
        else {
            res.status(500).json({
                message: "transaction is not finalized on blockchain"
            })
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.toString()
        })
    }
}

async function dispereseFundsToWinners() {
    try {
        if (isDispersingRewards) return;
        const tournament = await Tournament.findOne({ tournamentId: tournamentId });
        const currentTime = Date.now() / 1000;
        if (tournament.endTime < currentTime) {
            tournament.isEnded = true;
            tournament = await tournament.save();
        }
        if (tournament.isEnded && tournament.areRewardsDispersed) {
            cronJob.stop();
            return;
        }
        else if (tournament.isEnded && !tournament.areRewardsDispersed) {

            const ledgerContract = await getLedgerContract();
            const participants = tournament.participants.sort((a, b) => {
                return (b.steps - a.steps)
            });

            for (let i = 0; i < participants.length; i++) {
                if (i >= 100) break;
                const publicKey = participants[i].publicKey;
                const share = getPrizePoolShare(i + 1);
                const tx = await ledgerContract.rewardWinner(tournament.tournamentId, publicKey, parseToken(share)).send({
                    feeLimit: 100_000_000,
                    shouldPollResponse: true
                });
                const resp = await tx.wait();
                if (resp.status != 1) {
                    console.log("Failed transaction ", participants[i].username, share);
                }
            }
            tournament.areRewardsDispersed = true;
            await tournament.save();

        }
    }
    catch (e) {
        res.status(500).json({
            message: e.toString()
        })
    }
}

function getPrizePoolShare(prizePoolAmount, rank) {

    if (rank >= 51 && rank <= 100) return GetShare(5 / (100 - 50));
    if (rank >= 26 && rank <= 50) return GetShare(8 / (50 - 25));
    if (rank >= 11 && rank <= 25) return GetShare(16 / (25 - 10));
    if (rank >= 4 && rank <= 10) return GetShare(20 / (10 - 3));
    if (rank == 3) return GetShare(20);
    if (rank == 2) return GetShare(15);
    if (rank == 1) return GetShare(25);

    return 0; //not eligible for Prizepool
    GetShare(percent)
    {
        return (prizePoolAmount * percent) / 100;
    }
}