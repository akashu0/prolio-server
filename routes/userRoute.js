const express = require("express");
const user_route = express();

const userContoller = require("../controllers/userController");
const authMiddleware = require("../middlewares/jwtAuth");

// user_route.post("/register", authContoller.register);
// user_route.post("/login", authContoller.login);

user_route.get(
  "/get-wishlist",
  authMiddleware.verifyToken,
  userContoller.allWishlistByUser
);
user_route.post(
  "/add-wishlist",
  authMiddleware.verifyToken,
  userContoller.addWishlist
);
user_route.delete(
  "/delete-wishlist/:productId",
  authMiddleware.verifyToken,
  userContoller.removeFromWishlist
);

user_route.get(
  "/get-userDetails",
  authMiddleware.verifyToken,
  userContoller.fetchUserDetails
);

user_route.put("/update-userDetails", authMiddleware.verifyToken, userContoller.updateUserDetails)

module.exports = user_route;
