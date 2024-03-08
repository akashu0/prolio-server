const express = require("express");
const product_route = express();

const productController = require("../controllers/productController");

product_route.get("/getall-product", productController.getAllProducts);
product_route.post("/create-product", productController.create_product);
product_route.put("/update-sections/:Id", productController.update_sections);
product_route.put("/update-sections3/:Id", productController.update_sections3);
product_route.put("/update-sections4/:Id", productController.update_sections4);
product_route.get(
  "/getAllProductByCompany/:companyId",
  productController.getAllProductByCompany
);

product_route.get("/getProductById/:id", productController.getProductById);

product_route.put(
  "/changeStatus/:productId",
  productController.updateproductStatus
);

module.exports = product_route;
