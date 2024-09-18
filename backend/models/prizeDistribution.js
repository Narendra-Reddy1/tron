const { default: mongoose } = require("mongoose");



const PrizeDistribution = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    distribution: {
        first: {
            type: Number,
            required: true,
        },
        second: {
            type: Number,
            required: true,
        },
        third: {
            type: Number,
            required: true,
        },
        fourToTen: {
            type: Number,
            required: true,
        },
        elevenToTwentyFive: {
            type: Number,
            required: true,
        },
        twentySixToFifty: {
            type: Number,
            required: true,
        },
        fiftyOneToHundred: {
            type: Number,
            required: true,
        }
    }
})

module.exports = mongoose.model("prizeDistribution", PrizeDistribution)