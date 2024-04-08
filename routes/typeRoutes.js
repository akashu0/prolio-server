const express = require("express");
const type_route = express();

const typeContoller = require("../controllers/typeControllers");
const authMiddleware = require("../middlewares/jwtAuth");



type_route.post(
  "/create-type",
//   authMiddleware.verifyToken,
  typeContoller.createType
);
type_route.get(
  "/types/:id",
//   authMiddleware.verifyToken,
  typeContoller.fetchSingleType
);
type_route.put(
  "/types/:id",
//   authMiddleware.verifyToken,
  typeContoller.fetchSingleTypeUpdate
);


type_route.get(
  "/types",
//   authMiddleware.verifyToken,
  typeContoller.fetchAllTypes
);



module.exports = type_route;
