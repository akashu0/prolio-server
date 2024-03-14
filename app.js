const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const superAdminRoute = require("./routes/superAdminRoute");
const companyRoute = require("./routes/companyRoute");
const categoryRoute = require("./routes/categoryRoutes");
const productRoute = require("./routes/productRoute");
const oppurtunityRoute = require("./routes/opportunityRoute");

dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//mongoose connect
const connectDb = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database is connect");
};

connectDb();

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", companyRoute);
app.use("/api/superAdmin", superAdminRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/opportunity", oppurtunityRoute);

app.listen(3000, () => {
  console.log("Server is started");
});
