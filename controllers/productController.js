const Product = require("../model/productModel");

const create_product = async (req, res) => {
  try {
    // const { companyId } = req.params;

    const { sections } = req.body;

    // console.log(productDetails);
    // console.log(productImage);
    const newProudct = await Product.create({ sections });

    // const newItem = await newProudct.save();
    res.status(201).json({
      message: "Product is created",
      data: newProudct._id,
      // newProudct,
    });
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// updating the steps deatils from addproduct page
const update_sections = async (req, res) => {
  try {
    const productId = req.params.Id;
    const sectionData = req.body;
    const status = req.body.status;
    const findItem = await Product.findById({ _id: productId });
    if (!findItem) {
      return res.status(400).json({
        message: "Unable to find product",
      });
    }
    if (status) {
      findItem.status = status;
    }
    findItem.sections = sectionData;
    await findItem.save();
    res.json(findItem);
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS FROM DATABASE
const getAllProducts = async (req, res) => {
  try {
    const collectData = await Product.find({});
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
    // console.log(productId);
    const fetchData = await Product.findById({ _id: productId });
    // console.log(fetchData);
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
};
