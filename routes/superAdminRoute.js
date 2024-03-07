const express = require("express");
const superAdmin_route = express();

const authContoller = require("../controllers/authControllers");
const pincodeController = require("../controllers/pincodeController");
const categoryContoller = require("../controllers/categoryControllers");

// superAdmin_route.post("/login", authContoller.login);
superAdmin_route.post("/createPincode", pincodeController.createPincode);
superAdmin_route.get("/getAllPincode", pincodeController.getAllPincode);

// superAdmin_route.post("/createProduct", categoryContoller.createItem);

module.exports = superAdmin_route;
