const express = require("express");
const { createWallet, getBalance, withdraw, getUserInfo, recordUserSteps } = require("../controllers/user");
const { getTokenContract, getLedgerContract } = require("../core/contracts");
const { TronWeb } = require("tronweb");
const bcrypt = require("bcryptjs");
const { formatToken } = require("../utils/utils");
const userRouter = express.Router();

userRouter.post("/:username/withdraw", withdraw)
userRouter.get("/:username/user-info", getUserInfo)
userRouter.get("/:username/get-balance", getBalance)
userRouter.post("/:username/create-wallet", createWallet)
userRouter.post("/:username/record-steps", recordUserSteps)

userRouter.get("/test/test", async (req, res) => {
    try {
        const token = getTokenContract()
        const tt = await token.balanceOf("TKceU1zYmANjLkz7Khz9GM1eYhcisV8zuY").call()

        const decimal = await token.decimals().call()
        console.log(decimal)

        res.send((formatToken(tt.toString())))
    }
    catch (e) {
        res.send(e.toString())
        console.log(e)
    }
})




module.exports = { userRouter }
