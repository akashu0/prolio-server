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

productAdmin_route.post(
  "/create-accessdepartment",
  authMiddleware.verifyToken,
  productAdminContoller.createDepartment
);

productAdmin_route.get(
  "/get-all-deparment",
  authMiddleware.verifyToken,
  productAdminContoller.getAllDepartment
);

productAdmin_route.post(
  "/send-otp",
  authMiddleware.verifyToken,
  productAdminContoller.sendEmail
);
productAdmin_route.post(
  "/verify-otp",
  authMiddleware.verifyToken,
  productAdminContoller.verifyOtp
);

productAdmin_route.post(
  "/create-user",
  authMiddleware.verifyToken,
  productAdminContoller.createUser
);
productAdmin_route.get(
  "/get-all-accessuser",
  authMiddleware.verifyToken,
  productAdminContoller.getAccessUserlist
);

productAdmin_route.get(
  "/get-accessuser-details/:id",
  authMiddleware.verifyToken,
  productAdminContoller.getAccessUserById
);

productAdmin_route.put(
  "/update-accessuser-details/:id",
  authMiddleware.verifyToken,
  productAdminContoller.updateAccessUserById
);
productAdmin_route.put(
  "/update-accessuser-details/:id",
  authMiddleware.verifyToken,
  productAdminContoller.updateAccessUserById
);
productAdmin_route.delete(
  "/delete-user/:id",
  authMiddleware.verifyToken,
  productAdminContoller.deleteAccessUser
);



module.exports = productAdmin_route;
