const { ethers } = require("ethers");
const bcrypt = require("bcryptjs")
const UserModel = require("../models/User");
const { getTokenContract, getDefaultRunner } = require("../core/contracts");

exports.postSignup = async (req, res) => {
    //const walletData = await createWallet();
    try {

        const existedUser = await UserModel.findOne({ username: req.body.username });
        if (existedUser) {
            return res.status(409).send(JSON.stringify({
                message: "conflicting usernames"
            }))
        }
        const hash = bcrypt.hashSync(req.body.password);
        const user = await UserModel.create({
            username: req.body.username,
            password: hash,
            stepsCount: 0,
        })
        await user.save();
        res.status(201).json({
            user: {
                username: user.username,
                steps: user.stepsCount
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: e
        });
    }
}

exports.postLogin = async (req, res) => {
    try {

        const user = await UserModel.findOne({ username: req.body.username });
        let isMatched = false;
        if (user)
            isMatched = await bcrypt.compare(req.body.password, user.password);
        if (!isMatched || !user) {
            return res.status(404).json({
                message: "Invalid credentials"
            })
        }
        let tokenBalance = 0;
        // if (user.publicKey)
        //     tokenBalance = await (await getTokenContract()).balanceOf(user.publicKey)
        res.status(200).json({
            user: {
                username: user.username,
                stepsCount: user.stepsCount,
                publicKey: user.publicKey,
                balance: (Number)(ethers.formatUnits(tokenBalance))
            }
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: e
        });
    }
}
