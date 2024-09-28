require("dotenv").config()
const { ethers } = require("ethers");
const bcrypt = require("bcryptjs")
const UserModel = require("../models/User");
const { getTokenContract, getDefaultRunner } = require("../core/contracts");
const jwt = require("jsonwebtoken")

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

        const token = jwt.sign({
            username: req.body.username,
            publicKey: user.publicKey || "0x", //rn public key is null
        }, process.env.JWT_KEY, {
            expiresIn: "7d"
        })

        const fallbackToken = jwt.sign({
            username: user.username,
            publicKey: user.publicKey || "0x"
        }, process.env.JWT_KEY, {
            expiresIn: "14d"
        })

        res.status(201).json({
            user: {
                token: token,
                fallbacktoken: fallbackToken,
                username: user.username,
                steps: user.stepsCount
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: e.toString()
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
        const token = jwt.sign({
            username: user.username,
            publicKey: user.publicKey || "0x"
        }, process.env.JWT_KEY, {
            expiresIn: "7d"
        })
        const fallbackToken = jwt.sign({
            username: user.username,
            publicKey: user.publicKey || "0x"
        }, process.env.JWT_KEY, {
            expiresIn: "14d"
        })
        res.status(200).json({
            user: {
                token: token,
                fallbackToken: fallbackToken,
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
            message: e.toString()
        });
    }
}
