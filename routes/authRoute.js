const express = require("express");
const auth_route = express();

const authContoller = require("../controllers/authControllers");

auth_route.post("/register", authContoller.register);
auth_route.post("/login", authContoller.login);
auth_route.post("/google-register", authContoller.googleRegister);
auth_route.post("/google-login", authContoller.googleLogin);

module.exports = auth_route;
