const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const socketIo = require("socket.io");

const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const superAdminRoute = require("./routes/superAdminRoute");
const companyRoute = require("./routes/companyRoute");
const categoryRoute = require("./routes/categoryRoutes");
const productRoute = require("./routes/productRoute");
const oppurtunityRoute = require("./routes/opportunityRoute");
const enquiryRoute = require("./routes/enquiryRoute");
const typeRoute = require("./routes/typeRoutes");
const productAdmin = require("./routes/productAdminRoutes");

dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static("uploads"));

// Mongoose connect with error handling
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }
};
connectDb();

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", companyRoute);
app.use("/api/superAdmin", superAdminRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/opportunity", oppurtunityRoute);
app.use("/api/enquiry", enquiryRoute);
app.use("/api/type", typeRoute);
app.use("/api/productAdmin", productAdmin);

app.listen(8000, () => {
  console.log("Express server is running on port 8000");
});
