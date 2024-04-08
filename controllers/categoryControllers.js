const Category = require("../model/category");
const TypeCategory = require("../model/typeCategoryModel");

const create_Category = async (req, res) => {
  try {
    let { typeName, category, subcategories, questions } = req.body;
    typeName = typeName.toLowerCase();

    let existingType = await TypeCategory.findOne({ type: typeName });

    if (existingType) {
      if (existingType.category === category) {
        console.log(existingType.category);
        const newSubcategories = subcategories.filter(
          (subcategory) => !existingType.subcategories.includes(subcategory)
        );

        if (newSubcategories.length === 0) {
          return res
            .status(400)
            .json({ message: "Subcategories already exist" });
        } else {
          existingType.subcategories.push(...newSubcategories);
          existingType.questions = questions;
          existingType = await existingType.save();
          return res.status(200).json({
            message: "Subcategories added successfully",
          });
        }
      } else {
        return res.status(400).json({ message: "Category Already Exists" });
      }
    } else {
      const newTypeCategory = new TypeCategory({
        type: typeName,
        category,
        subcategories,
        questions,
      });
      await newTypeCategory.save();
      return res.status(200).json({
        message: "New type and category created successfully",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating category" });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const getAllData = await TypeCategory.find();

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

const blockOrUnblockCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const getData = await TypeCategory.findById(id);
    if (!getData) {
      return res
        .status(400)
        .json({ message: "Category not found in database" });
    }

    if (getData.status === "Active") {
      getData.status = "Inactive";
      await getData.save();
      return res.status(200).json({
        message: "The Category has been successfully set to Inactive",
      });
    } else {
      getData.status = "Active";
      await getData.save();
      return res
        .status(200)
        .json({ message: "The Category has been successfully set to Active" });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error occurred while updating category status" });
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subcategories, questions } = req.body;

    // Update the category in the database
    const updatedCategory = await TypeCategory.findByIdAndUpdate(id, {
      category,
      subcategories,
      questions,
    });

    // Check if the category was found and updated
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Respond with a success message
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error occurred while updating category " });
  }
};

const getCategoryById = async (req, res) => {
  try {
    // console.log("entr.......");
    const { id } = req.params;
    const getData = await TypeCategory.findById(id);

    if (!getData) {
      return res.status(400).json({ message: "Error Fetching Category Data" });
    }

    res.status(200).json(getData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error occurred while geting category " });
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
  blockOrUnblockCategory,
  updateCategoryById,
  getCategoryById,
};
