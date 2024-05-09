const express = require("express");
const superAdmin_route = express();
const multer = require("multer");
const authMiddleware = require("../middlewares/jwtAuth");
const pincodeController = require("../controllers/pincodeController");
const superAdminContoller = require("../controllers/superAdminContoller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists and is writable
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Custom file naming
  },
});
const upload = multer({ storage: storage });

// superAdmin_route.post("/login", authContoller.login);
superAdmin_route.post("/createPincode", pincodeController.createPincode);
superAdmin_route.get("/getAllPincode", pincodeController.getAllPincode);

superAdmin_route.post(
  "/add-product-tips",
  authMiddleware.verifyToken,
  superAdminContoller.createProductTips
);
superAdmin_route.get("/get-alltips", superAdminContoller.getAllTips);
superAdmin_route.get("/get-publishedtips", superAdminContoller.publishedTips);
superAdmin_route.put("/updateStatus/:id", superAdminContoller.changeStatus);
superAdmin_route.get("/getall-product", superAdminContoller.getAllProducts);
superAdmin_route.get(
  "/get-All-opportunities",
  superAdminContoller.getAllOppertunities
);

superAdmin_route.post(
  "/add-banners",
  upload.array("banners"),
  superAdminContoller.uploadbanners
);

superAdmin_route.get("/get-all-banners", superAdminContoller.getAllBanners);
superAdmin_route.get("/get-banners", superAdminContoller.getActiveBanners);
superAdmin_route.put(
  "/blockorunblock-banners/:id",
  superAdminContoller.BlockOrUnblock
);

module.exports = superAdmin_route;
