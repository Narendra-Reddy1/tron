const express = require("express");
const { createWallet, getBalance, withdraw, getUserInfo, recordUserSteps } = require("../controllers/user");
const { getTokenContract, getLedgerContract } = require("../core/contracts");
const { TronWeb } = require("tronweb");
const bcrypt = require("bcryptjs");
const { formatToken } = require("../utils/utils");
const userRouter = express.Router();
const jwt = require("jsonwebtoken")



userRouter.post("/withdraw", withdraw)
userRouter.get("/user-info", getUserInfo)
userRouter.get("/get-balance", getBalance)
userRouter.post("/create-wallet", createWallet)
userRouter.post("/record-steps", recordUserSteps)

userRouter.get("/test/test", async (req, res) => {
    try {
        //console.log(jwt.verify("eyJhbGcipiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InIyZWR0d3dlMXkiLCJwdWJsaWNLZXkiOiIweCIsImlhdCI6MTcyNzM1MzE5NSwiZXhwIjoxNzI3MzUzMjE1fQ.ULxlvHJbKKuE3YaZoh6647e-FWVqdtIA0S4UtppXs4k", process.env.JWT_KEY))
        console.log("SUCESSSS")
        res.status(200).send()
        // const token = getTokenContract()
        // const tt = await token.balanceOf("TKceU1zYmANjLkz7Khz9GM1eYhcisV8zuY").call()

        // const decimal = await token.decimals().call()
        // console.log(decimal)

        // res.send((formatToken(tt.toString())))
    }
    catch (e) {
        res.send(e.toString())
        console.log(e)
    }
})




module.exports = { userRouter }
