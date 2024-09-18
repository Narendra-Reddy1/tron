const { ethers } = require("ethers")
const { tokenConfig, ledgerConfig, nftConfig } = require("./metadata")
const { TronWeb } = require("tronweb")
require("dotenv").config()


const getTokenContract = async () => {
    const tronWeb = getOwnerTronWeb()
    const tokenContract = await tronWeb.contract().at(tokenConfig.address);
    return tokenContract;
}
const getLedgerContract = async () => {
    const tronweb = getOwnerTronWeb()
    const ledgerContract = await tronweb.contract().at(ledgerConfig.address);
    return ledgerContract;
}
const getNftContract = async () => {
    const tronweb = getOwnerTronWeb()
    const nftContract = await tronweb.contract().at(nftConfig.address);
    return nftContract;
}



const getUserTokenContract = async (privateKey) => {
    const tronWeb = getTronWeb(privateKey)
    const tokenContract = await tronWeb.contract().at(tokenConfig.address);
    return tokenContract;
}
const getUserLedgerContract = async (privateKey) => {
    const tronweb = getTronWeb()
    const ledgerContract = await tronweb.contract().at(ledgerConfig.address);
    return ledgerContract;
}
const getUserNftContract = async (privateKey) => {
    const tronweb = getTronWeb()
    const nftContract = await tronweb.contract().at(nftConfig.address);
    return nftContract;
}
// const getOwner = () => {
//     return new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, getProvider())
// }

const getOwnerTronWeb = () => {
    return new TronWeb({
        userFeePercentage: 100,
        feeLimit: 1e9,
        fullHost: 'https://nile.trongrid.io',
        headers: { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY },
        network_id: '3',
        timeout: 60000,
        privateKey: process.env.PRIVATE_KEY
    })
}

const getTronWeb = (privateKey) => {
    return new TronWeb(

        {
            userFeePercentage: 100,
            feeLimit: 1e9,
            fullHost: 'https://nile.trongrid.io',
            headers: { 'TRON-PRO-API-KEY': process.env.TRON_GRID_API_KEY },
            network_id: '3',
            privateKey: privateKey
        })
}

module.exports = {
    getLedgerContract,
    getNftContract,
    getTokenContract, /* getOwner ,*/
    getOwnerTronWeb,
    getTronWeb,
    getUserTokenContract,
    getUserLedgerContract,
    getUserNftContract,
}

