const express = require("express");
const oppor_route = express();

const opportunityController = require("../controllers/opportunityContoller");

oppor_route.post(
  "/addOppurtunities/:userId",
  opportunityController.createOppor
);

module.exports = oppor_route;
