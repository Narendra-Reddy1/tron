const express = require("express");
const { createTournament } = require("../controllers/admin");

const adminRouter = express.Router();

adminRouter.post("/create-tournament", createTournament)


module.exports = { adminRouter }