const { TronWeb, BigNumber } = require("tronweb");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const { getTokenContract, getProvider, getDefaultRunner, getTronWeb, getUserTokenContract } = require("../core/contracts");
const { encryptData, formatToken, decryptoData } = require("../utils/utils");


exports.createWallet = async (req, res) => {
    try {
        const username = req.params.username;
        const passkey = req.body.passkey;

        //if only user name? then any one can trigger this API to create wallet. PREVENT ITT


        // if (passkey.length < 6) {
        //     return res.status(400).json({
        //         message: "Secuirity Pin is short"
        //     }))
        // }
        const user = await UserModel.findOne({ username: username });
        if (user.wallet != null | undefined) {
            return res.status(409).json({
                message: "wallet already exists"
            })
        }
        const wallet = TronWeb.createRandom()
        const encryptedWallet = await encryptData(JSON.stringify(wallet), passkey);

        user.publicKey = wallet.address
        user.wallet = encryptedWallet;
        user.pin = bcrypt.hashSync(req.body.passkey)
        await user.save();
        res.status(201).json({
            user: {
                publicKey: wallet.address,
                balance: 0
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

exports.getUserInfo = async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: `User not found with username: ${req.body.username}`
            })
        }
        let tokenBalance = 0;
        if (user.publicKey != null && user.publicKey != "") {
            const tokenContract = (await getTokenContract())
            tokenBalance = await tokenContract.balanceOf(user.publicKey).call()
        }
        res.status(200).json({
            user: {
                username: user.username,
                stepsCount: user.stepsCount,
                publicKey: user.publicKey,
                balance: formatToken(tokenBalance.toString()),
                tournaments: user.tournaments
            }
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.toString()
        })
    }
}

exports.recordUserSteps = async (req, res) => {
    try {
        const username = req.params.username;
        const steps = req.body.steps;

        if (steps < 0) {
            return res.status(400).json({
                message: `Invalid steps count sent ${steps}`
            });
        }
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(404).json({
                message: `No user found with username ${username}`
            });
        }
        user.stepsCount += steps;
        await user.save();
        res.status(200).json({
            username: username,
            updatedSteps: user.stepsCount
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.toString()
        })
    }
}

exports.getBalance = async (req, res) => {
    try {

        const username = req.params.username;
        const user = await UserModel.findOne({ username: username })
        if (user == (null | undefined)) return res.status(404).json({
            message: "user not found"
        })


        // const publicKey = user.publicKey;
        //const publicKey = "0xBE60EfCE791c19836F06b54B9E827b7d91b7DDD8";

        //await getTransactions(publicKey)

        const tokenBalance = await (await getTokenContract()).balanceOf(user.publicKey).call();
        res.json({
            publicKey: user.publicKey,
            balances: {
                tokens: formatToken(tokenBalance.toString())
            }
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.toString()
        })
    }
}
exports.withdraw = async (req, res) => {
    try {
        const username = req.params.username;
        const { passkey, amount, toAddress } = req.body;
        const user = await UserModel.findOne({ username: username });
        const parsedAmount = ethers.parseEther(amount.toString());
        if (!user) {
            return res.status(404).json({
                message: `user not found with username: ${username}`
            })
        }
        const isMatch = await bcrypt.compare(passkey, user.pin);
        if (!isMatch) {
            return res.status(400).json({
                message: `invalid passkey`
            })
        }
        const balance = await (await getTokenContract()).balanceOf(user.publicKey).call();
        const formattedBalance = (Number)(formatToken(balance.toString()));
        if (parsedAmount < 0n || parsedAmount > balance) {
            return res.status(400).json({
                message: "invalid balance",
                requestedAmount: amount,
                balance: formattedBalance
            })
        }

        const wallet = await decryptoData(user.wallet, passkey);
        const tokenContract = await getUserTokenContract(wallet.privateKey)
        const tx = await tokenContract.transfer(toAddress, parsedAmount).send({
            feeLimit: 100_000_000,
            shouldPollResponse: true
        });
        const receipt = await tx.wait();
        if (receipt.status == 1) {
            const newBalance = await tokenContract.balanceOf(wallet.address).call()
            const formattedBalance = formatToken(newBalance.toString());
            res.status(200).json({
                txHash: tx.hash,
                updatedBalance: formattedBalance
            })
        }
        else {
            res.status(500).json({
                message: `transaction is not finalized on blockchain`
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

// async function getTransactions(publicKey) {
//     const tokenContract = getTokenContract().connect(getDefaultRunner());

//     await tokenContract.connect(getOwner()).transfer(publicKey, ethers.parseEther("100"));

//     const filterFrom = tokenContract.filters.Transfer(publicKey, null);
//     const filterTo = tokenContract.filters.Transfer(null, publicKey);

//     const fromTransfers = await tokenContract.queryFilter(filterFrom, 0, "latest");
//     const toTransfers = await tokenContract.queryFilter(filterTo, 0, "latest");


//     console.log(`withdrawls `, fromTransfers)
//     console.log(`Deposits `, toTransfers)


// }