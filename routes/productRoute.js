const express = require("express");
const product_route = express();

const authMiddleware = require("../middlewares/jwtAuth");
const productController = require("../controllers/productController");

product_route.get("/getall-product", productController.getAllProducts);
product_route.post(
  "/create-product",
  authMiddleware.verifyToken,
  productController.createProducts
);

product_route.put(
  "/update-product/:id",
  authMiddleware.verifyToken,
  productController.updateProduct
);

product_route.get(
  "/getAllProductByCompany/:companyId",
  productController.getAllProductByCompany
);

product_route.get(
  "/getProductById/:id",
  // authMiddleware.verifyToken,
  productController.getProductById
);

product_route.get(
  "/getproductbyUser",
  authMiddleware.verifyToken,
  productController.getProductByUserId
);

product_route.put(
  "/changeStatus/:id",
  authMiddleware.verifyToken,
  productController.updateproductStatus
);



module.exports = product_route;
