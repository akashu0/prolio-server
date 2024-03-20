const express = require("express");
const jwt = require("jsonwebtoken");

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify and decode the token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    console.log("verified");

    req.user = decoded;
    next();
  });
}

module.exports = {
  verifyToken,
};
