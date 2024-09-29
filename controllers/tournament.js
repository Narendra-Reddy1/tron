const { getLedgerContract, getOwner } = require("../core/contracts");
const prizeDistribution = require("../models/prizeDistribution");
const Tournament = require("../models/Tournament");
const UserModel = require("../models/User");
const cron = require("node-cron");
const { formatToken } = require("../utils/utils");


//creating tournament is admin task
// exports.createTournament = (req, res) => {


// }

exports.getTournament = async (req, res) => {

    try {

        const id = req.params.tournamentId
        const tournament = await Tournament.findOne({ tournamentId: id });
        if (!tournament) {
            return res.status(404).json({
                message: `Can't find Tournament with id: ${id}`
            })
        }
        tournament.participants.sort((a, b) => {
            return (b.steps - a.steps)
        });
        const distribution = await prizeDistribution.findOne({ id: tournament.prizeDistributionId });
        res.status(200).json({
            data: tournament,
            distribution: distribution.distribution
        })
    }
    catch (e) {
        res.status(500).json({
            message: e.toString()
        })
    }
}

exports.getLatestTournament = async (req, res) => {
    try {
        const ledgerContract = getLedgerContract();
        const id = await ledgerContract.methods.getLastTournamentId().call()
        const tournament = await Tournament.findOne({ tournamentId: Number(id) })

        if (tournament) {
            if (tournament.participants?.length > 1)
                tournament.participants?.sort((a, b) => {
                    return (b.steps - a.steps)
                });
            const distribution = await prizeDistribution.findOne({ id: tournament.prizeDistributionId });
            return res.status(200).json({
                data: tournament,
                distribution: distribution.distribution
            })
        }
        //this part should not trigger in normal cases.
        const info = await ledgerContract.methods.getTournamentInfo(id).call()
        if (info == [0, 0, 0]) {
            return res.status(404).json({
                message: `Tournament not found ${id}`
            })
        }
        const distribution = await prizeDistribution.findOne({ id: 0 });
        return res.status(200).json({
            message: "Unusual case triggered",
            data: {
                tournamentId: Number(id),
                startTime: Number(info[0]),
                endTime: Number(info[1]),
                prizePool: formatToken(Number(info[2])),
                participants: []
            },
            distribution: distribution.distribution
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong in fetching tournament data"
        })
    }
}



exports.joinTournament = async (req, res) => {
    try {

        const id = req.body.tournamentId;
        const username = req.body.username;
        const user = req.user//await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                message: `user not found with username: ${username}`
            })
        }
        const tournament = await Tournament.findOne({ tournamentId: id });
        const ledgerContract = await getLedgerContract();
        const isRunning = await tournament.isRunning();
        if (!tournament && !isRunning) {
            return res.status(404).json({
                message: `no tournament found with id: ${id}`
            })
        }
        if (!isRunning) {
            return res.status(404).json({
                message: "tournament is not LIVE!"
            })
        }
        const isParticipated = await ledgerContract.isUserParticipatedInTournament(id, user.publicKey).call();
        if (isParticipated) {
            return res.status(409).json({
                message: "Already participated!"
            })
        }
        const tx = await ledgerContract.forceJoinTournament(id, user.publicKey).send({
            feeLimit: 100_000_000,
            shouldPollResponse: true,
            keepTxID: true
        });

        // const receipt = await tx.wait();
        if (tx) {
            tournament.participants.push({
                publicKey: user.publicKey,
                steps: 0,
                username: username,
            })
            await tournament.save();
            user.tournaments.push({
                tournamentId: id,
                isParticipated: true
            })
            await user.save();
            return res.status(201).json({
                txHash: tx[0],
                tournamentId: id,
                stepsCount: 0,
            })
        }
        else {
            return res.status(500).json({
                message: `failed to join tournament with tournamentId: ${id}`,
                txStatus: receipt.status
            })
        }
    }
    catch (e) {
        console.log(e)
        console.log(e.message)
        res.status(500).json({
            error: e.toString()
        });
    }
}

exports.recordSteps = async (req, res) => {
    try {
        //use spread operator bc
        const stepCount = req.body.steps;
        const username = req.user.username;
        const id = req.body.tournamentId;

        if (stepCount < 0) {
            return res.status(400).json({
                message: `Invalid steps value sent ${stepCount}`
            })
        }
        const tournament = await Tournament.findOne({ tournamentId: id });
        if (!tournament) {
            return res.status(404).json({
                message: `no tournament found with id: ${id}`
            })
        }
        const isRunning = await tournament.isRunning();
        if (!isRunning) {
            return res.status(404).json({
                message: "tournament is not LIVE!"
            })
        }
        const participant = tournament.participants.find(x => x.username == username);
        if (!participant) {
            return res.status(404).json({
                message: `no pqrticipant with username: ${username}`
            })
        }
        const ledgerContract = getLedgerContract();
        const tx = await ledgerContract.recordSteps(id, participant.publicKey, stepCount).send({
            feeLimit: 100_000_000,
            shouldPollResponse: true,
            keepTxID: true
        });
        // const receipt = await tx.wait();
        if (tx) {
            const steps = Number(await ledgerContract.getUserStepCount(id, participant.publicKey).call());
            participant.steps += stepCount;
            await tournament.save();
            res.status(200).json({
                txHash: tx[0],
                tournamentId: id,
                updatedSteps: steps,
                addedStepsCount: stepCount
            })
        }
        else {
            res.send.status(500).json({
                message: `failed to record steps to tournamentId:: ${id}`
            })
        }
    }
    catch (e) {
        res.status(500).json({
            message: e.toString()
        })
    }
}
