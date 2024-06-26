const express = require("express");
const category_routes = express();

const categoryContoller = require("../controllers/categoryControllers");

category_routes.post("/createCategory", categoryContoller.create_Category);
category_routes.get("/getAllCategory", categoryContoller.getAllCategory);
category_routes.get(
  "/get-active-category",
  categoryContoller.getAactiveCategory
);
category_routes.get("/getAllCategory-types", categoryContoller.getCategoryType);
category_routes.put(
  "/blockorunblock-category/:id",
  categoryContoller.blockOrUnblockCategory
);
// category_routes.put("edit-categories/:id");
category_routes.get(
  "/get-categoriesbyid/:id",
  categoryContoller.getCategoryById
);
category_routes.put(
  "/update-category/:id",
  categoryContoller.updateCategoryById
);

category_routes.get(
  "/getCategory-Names/:productTypes",
  categoryContoller.getCategoryName
);
category_routes.get(
  "/getSubCategory-Names/:productTypes/:categoryName",
  categoryContoller.getSubCategoryName
);
category_routes.get(
  "/getfields/:productTypes/:categoryName",
  categoryContoller.getFields
);

module.exports = category_routes;
