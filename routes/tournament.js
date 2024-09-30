const express = require("express");
const { getTournament, joinTournament, recordSteps, getLatestTournament } = require("../controllers/tournament");

const tournamentRouter = express.Router();

tournamentRouter.get("/get-latest-tournament", getLatestTournament)
tournamentRouter.post("/join", joinTournament)
tournamentRouter.post("/record-steps", recordSteps);
tournamentRouter.get("/get/:tournamentId", getTournament)

module.exports = { tournamentRouter }