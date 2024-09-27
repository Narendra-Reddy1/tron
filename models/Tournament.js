
const { default: mongoose } = require("mongoose");
const { getLedgerContract, getDefaultRunner } = require("../core/contracts");
const PrizeDistribution = require("./prizeDistribution");

const Tournament = new mongoose.Schema({
    tournamentId: {
        type: Number,
        required: true
    },
    txHash: {
        type: String,
        required: false
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    prizePool: {
        type: Number,
        required: true
    },
    prizeDistributionId: {
        type: Number,
        required: true
    },
    participants: [{
        username: {
            type: String,
            required: true,
        },
        steps: {
            type: Number,
            required: true
        },
        publicKey: {
            type: String,
            required: true
        },
        _id: false
    }],
    isEnded: {
        type: Boolean,
        required: false,
    },
    areRewardsDispersed: {
        type: Boolean,
        required: false
    }
})
Tournament.methods.isUserParticipated = async function (username) {
    try {

        const participant = this.participants.find(x => x.username == username)
        if (!participant) return false;
        const ledgerContract = await getLedgerContract();
        const isParticipated = await ledgerContract.isUserParticipatedInTournament(this.tournamentId, participant.publicKey).call()
        return isParticipated;
    } catch (e) {
        console.log(e);
        return false
    }
}
Tournament.methods.isRunning = async function () {
    const ledgerContract = await getLedgerContract()
    const result = await ledgerContract.isTournamentRunning(this.tournamentId).call()
    console.log(result)
    return result;
}
module.exports = mongoose.model("Tournament", Tournament)