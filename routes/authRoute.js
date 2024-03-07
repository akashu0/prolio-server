const express = require("express");
const auth_route = express();

const authContoller = require("../controllers/authControllers");

auth_route.post("/register", authContoller.register);
auth_route.post("/login", authContoller.login);

module.exports = auth_route;
