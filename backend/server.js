const express = require("express");
const { userRouter } = require("./routes/user");
const { default: mongoose } = require("mongoose");
const { authRouter } = require("./routes/auth");
const { tournamentRouter } = require("./routes/tournament");
const { adminRouter } = require("./routes/admin");
const { configRouter } = require("./routes/config");
require("dotenv").config()


const app = express();
app.use(express.json());

app.use(authRouter);
app.use("/tournament", tournamentRouter);
app.use(userRouter);
app.use(configRouter);
app.use("/admin", adminRouter);

try {
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.y6m6z3o.mongodb.net/fitness-ledger`).then(result => {
        console.log("Connected to DB...");
        app.listen(process.env.PORT || 3000, async () => {

            console.log("Connected to server...", process.env.PORT || 3000);
        });
    })
}
catch (e) {
    console.log(e)
}