const express = require("express");
const company_route = express();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"), function (err, success) {
      if (err) {
        throw err;
      }
    });
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (error, success) {
      if (error) {
        throw error;
      }
    });
  },
});

const upload = multer({
  storage: storage,
  //   limits: { fileSize: 2 * 1024 * 1024 }, // Maximum file size: 2MB
});

const authController = require("../middlewares/jwtAuth");

const companyController = require("../controllers/companyController");

company_route.post(
  "/createNewCompany",
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
