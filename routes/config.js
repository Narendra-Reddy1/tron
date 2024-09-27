const express = require("express");
const { getwalletConfig, getPrizeDistribution } = require("../controllers/config");

const configRouter = express.Router();



configRouter.get("/config/prize-distribution", getPrizeDistribution)
configRouter.get("/config/wallet", getwalletConfig)


module.exports = { configRouter }