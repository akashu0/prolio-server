const Product = require("../model/productModel");

const create_product = async (req, res) => {
  try {
    // const { companyId } = req.params;

    const { sections1 } = req.body;

    // console.log(productDetails);
    // console.log(productImage);
    const newProudct = await Product.create({ sections1: sections1 });

    // const newItem = await newProudct.save();
    res.status(201).json(newProudct._id);
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// updating the steps deatils from addproduct page
const update_sections = async (req, res) => {
  try {
    const productId = req.params.Id;
    const { section2, status } = req.body;
    // Find the product by ID
    const findItem = await Product.findById(productId);
    if (!findItem) {
      return res.status(400).json({
        message: "Unable to find product",
      });
    }
    // Update section2 if provided
    if (section2) {
      findItem.sections2 = section2;
    }
    // Update status if provided
    if (status) {
      findItem.status = status;
    }
    // Save the updated product
    await findItem.save();
    res.json(findItem);
  } catch (error) {
    console.error("Error updating product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update_sections3 = async (req, res) => {
  try {
    const productId = req.params.Id;
    const { sections3, status } = req.body;
    const findItem = await Product.findById(productId);
    if (!findItem) {
      return res.status(400).json({
        message: "Unable to find product",
      });
    }
    if (sections3) {
      findItem.sections3 = sections3;
    }
    if (status) {
      findItem.status = status;
    }
    await findItem.save();
    res.json(findItem);
  } catch (error) {
    console.error("Error updating product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const update_sections4 = async (req, res) => {
  try {
    const productId = req.params.Id;
    const { sections4, status } = req.body;
    // Find the product by ID
    const findItem = await Product.findById(productId);
    if (!findItem) {
      return res.status(400).json({
        message: "Unable to find product",
      });
    }
    // Update section2 if provided
    if (sections4) {
      findItem.sections4 = sections4;
    }
    // Update status if provided
    if (status) {
      findItem.status = status;
    }
    // Save the updated product
    await findItem.save();
    res.json(findItem);
  } catch (error) {
    console.error("Error updating product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS FROM DATABASE
const getAllProducts = async (req, res) => {
  try {
   
    const collectData = await Product.find({});
    // if (collectData.length === 0) {
    //   return res.status(404).json({ message: "No active products found" });
    // }
    res.status(201).json(collectData);
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET PRODUCTS RESPCECTIVE COMPANY

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
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const fetchData = await Product.findById({ _id: productId });
    res.status(200).json(fetchData);
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// REMOVE PRODUCT

const updateproductStatus = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(productId);
    const status = req.body.status;

    const fetchData = await Product.findById({ _id: productId });

    if (fetchData) {
      fetchData.status = status;
      await fetchData.save();
      return res.status(201).json(fetchData);
    }
    res.status(400).json({ message: "Can`t find product" });
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  create_product,
  update_sections,
  getAllProducts,
  getAllProductByCompany,
  getProductById,
  updateproductStatus,
  update_sections3,
  update_sections4,
};
