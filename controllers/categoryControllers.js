const Category = require("../model/category");
const TypeCategory = require("../model/typeCategoryModel");

const create_Category = async (req, res) => {
  try {
    let { typeName, category, subcategories, questions } = req.body;
    typeName = typeName.toLowerCase();

    category = category.toLowerCase().trim(); // Trim category

    // Trim each subcategory
    subcategories = subcategories.map((subcategory) => subcategory.trim());

    let existingTypes = await TypeCategory.find({ type: typeName });

    if (existingTypes.length > 0) {
      const categoryExists = existingTypes.some((existingType) =>
        existingType.category.includes(category)
      );

      if (categoryExists) {
        return res.status(400).json({ message: "Category already exists" });
      } else {
        const newTypeCategory = new TypeCategory({
          type: typeName,
          category,
          subcategories,
          questions,
        });
        await newTypeCategory.save();
        return res.status(200).json({ message: "Category added successfully" });
      }
    } else {
      const newTypeCategory = new TypeCategory({
        type: typeName,
        category,
        subcategories,
        questions,
      });
      await newTypeCategory.save();
      return res
        .status(200)
        .json({ message: "New type category created successfully" });
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

const getAactiveCategory = async (req, res) => {
  try {
    const activeCategories = await TypeCategory.aggregate([
      { $match: { status: "Active" } },
      { $project: { category: 1, subcategories: 1, _id: 0 } },
    ]);

    res.status(200).json(activeCategories);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error category" });
  }
};

const getCategoryType = async (req, res) => {
  try {
    const uniqueTypes = await TypeCategory.aggregate([
      {
        $group: {
          _id: "$type", // Group by the 'type' field
        },
      },
    ]);

    res.status(201).json(uniqueTypes);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "error" });
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
    const categoryName = await TypeCategory.aggregate([
      {
        $match: {
          type: productType, // Match the product_type
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          category: "$category", // Project only the category names
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

    const aggregationPipeline = [
      {
        // Match documents based on type and category
        $match: {
          type: productTypes,
          category: categoryName,
        },
      },
      {
        // Project the subcategories and questions from the matched documents
        $project: {
          subCategoryNames: "$subcategories",
          questions: "$questions",
        },
      },
    ];

    const result = await TypeCategory.aggregate(aggregationPipeline);

    if (result.length === 0) {
      return res.status(404).json({
        message: "No data found for the given product type and category",
      });
    }

    // console.log(result[0]);
    res.status(200).json(result[0]);
  } catch (error) {
    // Handle errors and return a response
    console.error(error.message);
    res
      .status(400)
      .json({ error: "An error occurred while fetching the data" });
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
  getAactiveCategory,
};
