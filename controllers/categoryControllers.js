const Category = require("../model/category");

const create_Category = async (req, res) => {
  try {
    let { product_type, category } = req.body;
    product_type = product_type.toLowerCase();
    const existingCategory = await Category.findOne({ product_type });

    if (existingCategory) {
      const categoryExists = category.some((newCategory) =>
        existingCategory.category.find(
          (cat) => cat.categoryName === newCategory.categoryName
        )
      );

      if (categoryExists) {
        return res.status(400).json({ error: " categories already exist" });
      } else {
        existingCategory.category.push(...category);
        const updatedCategory = await existingCategory.save();
        return res.status(200).json({
          message: "Category details added successfully",
          updatedCategory,
        });
      }
    } else {
      const newCategory = new Category({
        product_type,
        category,
      });
      await newCategory.save();
      return res
        .status(200)
        .json({ message: "Category created successfully", newCategory });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "Error creating category" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const getAllData = await Category.find();

    res.status(201).json(getAllData);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error category" });
  }
};

const getCategoryType = async (req, res) => {
  try {
    const getData = await Category.find().select("_id product_type ");

    // console.log(getData);
    res.status(201).json(getData);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error " });
  }
};

const getCategoryName = async (req, res) => {
  try {
    const productType = req.params.productTypes;
    // console.log(productType);

    // MongoDB aggregation pipeline to match the document based on the product_type
    const categoryName = await Category.aggregate([
      {
        $match: {
          product_type: productType, // Match the product_type
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          categoryNames: "$category.categoryName", // Project only the category names
        },
      },
    ]);

    // console.log(categoryName);
    res.status(201).json(categoryName);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error " });
  }
};

const getSubCategoryName = async (req, res) => {
  try {
    const { productTypes, categoryName } = req.params;

    // MongoDB aggregation pipeline to match the document based on the product_type and categoryName
    const categories = await Category.aggregate([
      {
        $match: {
          product_type: productTypes, // Match the product_type
        },
      },
      {
        $unwind: "$category", // Unwind the category array
      },
      {
        $match: {
          "category.categoryName": categoryName, // Match documents where categoryName matches
        },
      },
      {
        $group: {
          _id: null,
          subCategoryNames: { $addToSet: "$category.subcategoryName" }, // Add subcategoryName to an array
        },
      },
    ]);

    // Extract the subcategoryName array from the result
    const subCategoryNames = categories[0].subCategoryNames.flat();
    // console.log(categories);

    res.status(200).json({ subCategoryNames });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error " });
  }
};
const getFields = async (req, res) => {
  try {
    const { productTypes, categoryName } = req.params;

    const fields = await Category.aggregate([
      {
        $match: {
          product_type: productTypes, // Match the product type
        },
      },
      {
        $unwind: "$category", // Unwind the category array
      },
      {
        $match: {
          "category.categoryName": categoryName, // Match documents where categoryName matches
        },
      },
      {
        $replaceRoot: { newRoot: "$category" }, // Replace the root with the category object
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          fields: "$fields", // Project the fields array
        },
      },
    ]);

    res.status(200).json({ fields });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error " });
  }
};

module.exports = {
  create_Category,
  getAllCategory,
  getCategoryType,
  getCategoryName,
  getSubCategoryName,
  getFields,
};
