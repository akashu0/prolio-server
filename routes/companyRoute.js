const express = require("express");
const company_route = express();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "companykyc/"); // Make sure this directory exists and is writable
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);  
    cb(null, uniqueSuffix + '-' + file.originalname); // Custom file naming
  },
});

const upload = multer({
  storage: storage,
});

const authController = require("../middlewares/jwtAuth");

const companyController = require("../controllers/companyController");

company_route.post(
  "/createNewCompany",
  authController.verifyToken,
  upload.array("documents"),
  companyController.registerNewCompany
);

company_route.get(
  "/get-all-company",
  // authController.verifyToken,
  companyController.getAllCompanyList
);

company_route.put(
  "/verified-company/:companyId",
  companyController.verifiedCompany
);

company_route.put(
  "/rejected-company/:companyId",
  companyController.rejectedCompany
);

module.exports = company_route;
