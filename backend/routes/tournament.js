const express = require("express");
const { getTournament, joinTournament, recordSteps } = require("../controllers/tournament");

const tournamentRouter = express.Router();



tournamentRouter.get("/get/:tournamentId", getTournament)
tournamentRouter.post("/join", joinTournament)
tournamentRouter.post("/record-steps", recordSteps);

module.exports = { tournamentRouter }