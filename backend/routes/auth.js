const express = require("express");
const { postSignup, postLogin } = require("../controllers/auth");

const authRouter = express.Router();



authRouter.post("/sign-up", postSignup)
authRouter.post("/login", postLogin);

module.exports = { authRouter }