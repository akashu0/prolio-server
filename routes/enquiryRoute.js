const express = require("express");
const enquiry_route = express();

const authMiddleware = require("../middlewares/jwtAuth");
const enquiryController = require("../controllers/enquiryController");

enquiry_route.post(
  "/create-enquiry",
  authMiddleware.verifyToken,
  enquiryController.CreateEnquiry
);
enquiry_route.get(
  "/getByIdEnquiry/:productId",
  authMiddleware.verifyToken,
  enquiryController.getEnquiry
);
enquiry_route.put(
  "/updateEnquiry",
  authMiddleware.verifyToken,
  enquiryController.updateEnquiry
);
enquiry_route.get(
  "/getByUserEnquiry",
  authMiddleware.verifyToken,
  enquiryController.getByUserEnquiry
);
enquiry_route.get(
  "/getEnquiryById/:id",
  authMiddleware.verifyToken,
  enquiryController.getEnquiryById
);
enquiry_route.get(
  "/getReceivedEnquiry",
  authMiddleware.verifyToken,
  enquiryController.getReceivedEnquiry
);
enquiry_route.put(
  "/repliedEnquiry",
  authMiddleware.verifyToken,
  enquiryController.sentEnquiry
);

module.exports = enquiry_route;
