const express = require("express");
const user_route = express();

const authContoller = require("../controllers/authControllers");

// user_route.post("/register", authContoller.register);
// user_route.post("/login", authContoller.login);

module.exports = user_route;
