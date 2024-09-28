const coreConfig = require("../models/coreConfig");
const prizeDistribution = require("../models/prizeDistribution");


exports.getPrizeDistribution = async (req, res) => {
    const { id } = req.body;
    const distro = await prizeDistribution.findOne({ id: id });
    if (!distro) {
        return res.status(404).json({
            message: `nothing found at given id: ${id}`
        })
    }
    res.status(200).json(distro.distribution);
}
exports.getwalletConfig = async (req, res) => {
    try {

        const config = await coreConfig.findOne({ index: 0 });
        if (!config) {
            console.log("Something messed up with coreConfig Data");
            return res.status(500).json({
                message: "something messed up with coreConfig"
            })
        }
        res.status(200).json(
            {
                wallet: config.wallet
            });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something messed up with coreConfig"
        })
    }
}