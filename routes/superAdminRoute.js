const express = require("express");
const superAdmin_route = express();

const authMiddleware = require("../middlewares/jwtAuth");
const pincodeController = require("../controllers/pincodeController");
const superAdminContoller = require("../controllers/superAdminContoller");

// superAdmin_route.post("/login", authContoller.login);
superAdmin_route.post("/createPincode", pincodeController.createPincode);
superAdmin_route.get("/getAllPincode", pincodeController.getAllPincode);

superAdmin_route.post(
  "/add-product-tips",
  authMiddleware.verifyToken,
  superAdminContoller.createProductTips
);

// superAdmin_route.post("/createProduct", categoryContoller.createItem);

module.exports = superAdmin_route;
