const { default: mongoose } = require("mongoose");

const coreConfig = new mongoose.Schema({

    index: {
        type: Number,
        required: true
    },
    wallet: {
        withdraw: {
            withdrawFee: {
                type: Number,
                required: true,
            },
            transactionLimits: {
                perTransaction: {
                    min: {
                        type: Number,
                        required: true
                    },
                    max: {
                        type: Number,
                        required: true
                    }
                },
                perDay: {
                    min: {
                        type: Number,
                        required: true
                    },
                    max: {
                        type: Number,
                        required: true
                    }
                },

            },
            _id: false
        },
        _id: false
    },
});


module.exports = mongoose.model("coreConfig", coreConfig);