const express = require("express");
const { userRouter } = require("../routes/user");
const { default: mongoose } = require("mongoose");
const { authRouter } = require("../routes/auth");
const { tournamentRouter } = require("../routes/tournament");
const { adminRouter } = require("../routes/admin");
const { configRouter } = require("../routes/config");
const cron = require("node-cron")
const User = require("../models/User");
const { validateToken } = require("../middlewares/checkAuthentication");
const cors = require('cors')
require("dotenv").config()

const app = express();
app.use(express.json());
app.use(cors())

app.use(authRouter);
app.use(configRouter);
app.use("/admin", adminRouter);
app.use("/tournament", validateToken, tournamentRouter);
app.use(validateToken, userRouter);

async function resetUserDailySteps() {
    const users = await User.find({})
    users.forEach(user => {
        user.stepsHistory.push({
            steps: user.stepsCount || 0,
            dateTime: user.currentDate || 0
        })
        user.stepsCount = 0;
        user.currentDate = Date.now() / 1000
    });
}

try {
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.y6m6z3o.mongodb.net/fitness-ledger`).then(result => {
        console.log("Connected to DB...");
        // getLedgerContract().methods.getTournamentInfo(0).call().then(res => {
        //     console.log(res)
        // })



        app.listen(process.env.PORT || 4000, async () => {
            // cron.schedule('0 0 * * *', () => {
            //     resetUserDailySteps()
            // });
            console.log("Connected to server...", process.env.PORT || 4000);
        });
    })
}
catch (e) {
    console.log(e)
}
module.exports = app;