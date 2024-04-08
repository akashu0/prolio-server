const express = require("express");
const oppor_route = express();

const opportunityController = require("../controllers/opportunityContoller");
const authMiddleware = require("../middlewares/jwtAuth");

oppor_route.post(
  "/create-opportunity",
  authMiddleware.verifyToken,
  opportunityController.createOpportunity
);

oppor_route.get(
  "/get-user-opportunity",
  authMiddleware.verifyToken,
  opportunityController.getByUserOpportunity
);

oppor_route.get(
  "/get-opportunity/:id",
  // authMiddleware.verifyToken,
  opportunityController.getOpportunityById
);

module.exports = oppor_route;
