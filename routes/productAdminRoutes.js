const express = require("express");
const productAdmin_route = express();

const authMiddleware = require("../middlewares/jwtAuth");

const productAdminContoller = require("../controllers/productAdminControllers");

productAdmin_route.post(
  "/create-productquestions",
  authMiddleware.verifyToken,
  productAdminContoller.createFaqs
);

productAdmin_route.put("/update-faqs/:id", productAdminContoller.updateFaqs);

productAdmin_route.get(
  "/get-faqsByCompany",
  authMiddleware.verifyToken,
  productAdminContoller.getFaqsByCompany
);
productAdmin_route.put("/updateStatus/:id", productAdminContoller.updateStatus);
productAdmin_route.get(
  "/get-publishedfaqs/:productId",
  productAdminContoller.publishedFaqs
);
productAdmin_route.get(
  "/get-productByCategory/:selectedProductType/:selectedCategoryName",
  authMiddleware.verifyToken,
  productAdminContoller.getProductByCategory
);

module.exports = productAdmin_route;
