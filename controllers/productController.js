const Product = require("../model/productModel");
const jwt = require("jsonwebtoken");
const Company = require("../model/companyDetailsModel");
const Item = require("../model/dynamicProductModel");
const Wishlist = require("../model/wishlistModel");

// const create_product = async (req, res) => {
//   try {
//     const { userId, role } = req.user;

//     const {
//       questions,
//       type,
//       category,
//       subcategories,
//       name,
//       brandName,
//       images,
//     } = req.body;

//     // Check if the user's company exists
//     const checkExistedCompany = await Company.findOne({ userId: userId });
//     if (!checkExistedCompany) {
//       return res.status(401).json({ message: "Company Not Registered" });
//     }

//     // if (!questions || !Array.isArray(req.files)) {
//     //   return res.status(400).json({ message: "Invalid form data or files" });
//     // }

//     // Create a new product associated with the user's company
//     const newProduct = await Item.create({
//       type,
//       category,
//       subcategories,
//       name,
//       brand: brandName,
//       images: images,
//       questions,
//       companyId: checkExistedCompany._id,
//       userId,
//     });

//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error saving product details:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const createProducts = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const checkExistedCompany = await Company.findOne({ userId: userId });
    if (checkExistedCompany) {
      const { type, category, subcategories, questions } = req.body.formData;

      const newProduct = await Product.create({
        type: type,
        category: category,
        subcategories: subcategories,
        questions: questions,
        companyId: checkExistedCompany._id,
        userId: userId,
      });
      await newProduct.save();
      res.status(201).json({ message: "Product Added Successfully" });
    } else {
      // If the user's company does not exist, return an error
      return res.status(401).json({ message: "Company Not Registered" });
    }
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID from URL
    const userId = req.user.userId; // User ID from user session

    // Fetch the product to update
    const product = await Product.findById(id);

    // Check if the product exists and belongs to the user
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this product" });
    }

    // Update the product with new data from req.body
    const { questions } = req.body.formData;

    if (!questions) {
      return res.status(400).json({ message: "No Data Available" });
    }

    product.questions = questions;

    // Save the updated product
    await product.save();

    // Return a success response
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS FROM DATABASE
const getAllProducts = async (req, res) => {
  try {
    const collectData = await Product.find({});

    const transformedData = collectData.map((product) => {
      // Find the "Product Details" step
      const productDetailsStep = product.questions.steps.find(
        (step) => step.name === "Product Details"
      );

      // Find specific questions
      const productNameQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Name"
      );
      const brandNameQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Brand Name"
      );
      const productImageQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Image"
      );

      // Extract the images
      let primaryImage = "",
        secondaryImage = "";
      if (productImageQuestion && productImageQuestion.images.length > 0) {
        primaryImage =
          productImageQuestion.images[0].base64 ||
          productImageQuestion.images[0].url;
        if (productImageQuestion.images.length > 1) {
          secondaryImage =
            productImageQuestion.images[1].base64 ||
            productImageQuestion.images[1].url;
        }
      }

      return {
        id: product._id,
        productName: productNameQuestion ? productNameQuestion.value : "",
        brandName: brandNameQuestion ? brandNameQuestion.value : "",
        productImage: primaryImage,
        secondaryProductImage: secondaryImage,
      };
    });

    // Send the transformed data as the response
    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProductByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const fetchData = await Product.find({ companyId: companyId });

    res.status(201).json({
      data: fetchData,
    });
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// VIEW  PRODUCT BY PRODUCTID
// const getProductById = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const fetchData = await Product.findById({ _id: productId })
//       .populate("companyId")
//       .exec();

//     res.status(200).json(fetchData);
//   } catch (error) {
//     console.error("Error saving product details:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch product data by its ID and populate the companyId field
    const fetchData = await Product.findById({ _id: productId })
      .populate("companyId")
      .exec();

    // Check if fetchData exists and has questions
    if (!fetchData || !fetchData.questions || !fetchData.questions.steps) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the "Product Details" step in the questions array
    const productDetailsStep = fetchData.questions.steps.find(
      (step) => step.name === "Product Details"
    );

    // Initialize variables to store image data
    let productImages = [];
    let finishedProductImages = [];

    // Check if productDetailsStep and its questions exist
    if (productDetailsStep && productDetailsStep.questions) {
      // Extract product images
      const productImageQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Image"
      );
      if (
        productImageQuestion &&
        productImageQuestion.images &&
        productImageQuestion.images.length > 0
      ) {
        // Map through the images array and collect base64 or url for each image
        productImages = productImageQuestion.images.map(
          (image) => image.base64 || image.url
        );
      }

      // Extract finished product images
      const finishedProductImageQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Provide finished product images"
      );
      if (
        finishedProductImageQuestion &&
        finishedProductImageQuestion.images &&
        finishedProductImageQuestion.images.length > 0
      ) {
        finishedProductImages = finishedProductImageQuestion.images.map(
          (image) => image.base64 || image.url
        );
      }
    }

    res.status(200).json({
      productImages,
      finishedProductImages,
      data: fetchData,
    });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// REMOVE PRODUCT

const updateproductStatus = async (req, res) => {
  try {
    const productId = req.params.id;

    const status = req.body.status;

    const fetchData = await Product.findById({ _id: productId });

    if (fetchData) {
      fetchData.status = status;
      await fetchData.save();
      return res.status(200).json(fetchData.status);
    }
    res.status(400).json({ message: "Can`t find product" });
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductByUserId = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch products based on the userId
    const fetchData = await Product.find({ userId: userId }).populate(
      "userId",
      "firstName lastName"
    );

    // Transform the fetched data to include only the required fields
    const transformedData = fetchData.map((product) => {
      // Find the "Product Details" step in the product's questions array
      const productDetailsStep = product.questions.steps.find(
        (step) => step.name === "Product Details"
      );

      // Find the relevant questions
      const productNameQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Name"
      );
      const productIdQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product ID" // Assuming there's a question for Product ID
      );
      const brandNameQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Brand Name"
      );
      const productImageQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Image"
      );

      const userName = `${product.userId.firstName} ${product.userId.lastName}`;
      const localCreatedAt = new Date(product.createdAt).toLocaleString();
      // Extract the images
      let primaryImage = "";
      if (productImageQuestion && productImageQuestion.images.length > 0) {
        primaryImage =
          productImageQuestion.images[0].base64 ||
          productImageQuestion.images[0].url;
      }

      // Return the transformed data
      return {
        id: product._id,
        productName: productNameQuestion ? productNameQuestion.value : "",
        productId: productIdQuestion ? productIdQuestion.value : "", // Include the Product ID
        brandName: brandNameQuestion ? brandNameQuestion.value : "",
        productImage: primaryImage,
        status: product.status,
        createdAt: localCreatedAt,
        userName: userName, // User's name from populated data
      };
    });

    // Send the transformed data as the response
    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const wishlistStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId } = req.user;

    const wishlist = await Wishlist.findOne({ userId: userId });
    if (!wishlist) {
      return res.status(200).json({ status: "No product in wishlist" });
    }

    const products = wishlist.products.map(product => product.toString());
    if (!products.includes(productId)) {
      return res.status(200).json({ status: "No product in wishlist" });
    }

    // Product exists in the wishlist
    return res.status(201).json({ status: "Product exists in wishlist" });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  // create_product,
  // create_product,
  getAllProducts,
  getAllProductByCompany,
  getProductById,
  updateproductStatus,
  updateProduct,
  getProductByUserId,
  createProducts,
  wishlistStatus
};
