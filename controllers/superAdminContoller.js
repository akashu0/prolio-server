const Tips = require("../model/productTipsModel");
const Product = require("../model/productModel");
const Oppertunities = require("../model/opportunityModel");
const Banner = require("../model/banner");

const createProductTips = async (req, res) => {
  try {
    const { productId, tips } = req.body;

    const { userId } = req.user;

    const createData = new Tips({
      productId: productId,
      userId: userId,
      tips: tips,
    });
    await createData.save();
    // console.log(newd, "adisakke created");
    res.status(200).json({ message: "Product Buying Tips Created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating Product Buying Tips" });
  }
};

const getAllTips = async (req, res) => {
  try {
    const getData = await Tips.find().populate("productId").populate("userId");

    if (!getData) {
      return res.status(400).json({ message: "Product buying Tips Are Empty" });
    }

    res.status(200).json(getData);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error getting Product Buying Tips" });
  }
};

const publishedTips = async (req, res) => {
  try {
    // Fetch tips with the status of "published"
    const getData = await Tips.find({ status: "published" });

    if (!getData || getData.length === 0) {
      return res.status(200).json({ message: "No published tips found" });
    }

    // Respond with the fetched data
    res.status(200).json(getData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error getting published tips" });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["published", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const item = await Tips.findByIdAndUpdate(id, { status }, { new: true });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.status(200).json({ message: `Item status updated to ${status}` });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error occurred while updating Tips status" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Fetch all products and populate companyId to get companyName
    const fetchData = await Product.find({}).populate(
      "companyId", // Assuming 'companyId' is the reference field in Product model
      "companyName" // Only get companyName from the referenced Company model
    );

    // Transform the fetched data to include only the required fields
    const transformedData = fetchData.map((product) => {
      // Assuming there is a check for the structure of product details as needed
      const productDetailsStep = product.questions?.steps?.find(
        (step) => step.name === "Product Details"
      );

      const productNameQuestion = productDetailsStep?.questions?.find(
        (q) => q.description === "Product Name"
      );
      const productIdQuestion = productDetailsStep?.questions?.find(
        (q) => q.description === "Product ID"
      );
      const brandNameQuestion = productDetailsStep?.questions?.find(
        (q) => q.description === "Brand Name"
      );
      const productImageQuestion = productDetailsStep?.questions?.find(
        (q) => q.description === "Product Image"
      );

      const companyName = product.companyId
        ? product.companyId.companyName
        : "No company linked";
      const localCreatedAt = new Date(product.createdAt).toLocaleString();

      // Extract the primary image
      let primaryImage = "";
      if (productImageQuestion && productImageQuestion.images.length > 0) {
        primaryImage =
          productImageQuestion.images[0].base64 ||
          productImageQuestion.images[0].url;
      }

      return {
        id: product._id,
        productName: productNameQuestion ? productNameQuestion.value : "N/A",
        productId: productIdQuestion ? productIdQuestion.value : "N/A",
        brandName: brandNameQuestion ? brandNameQuestion.value : "N/A",
        productImage: primaryImage,
        status: product.status,
        createdAt: localCreatedAt,
        companyName: companyName, // Company name from populated data
      };
    });

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllOppertunities = async (req, res) => {
  try {
    const getData = await Oppertunities.find({}).populate("userId");

    res.status(200).json(getData);
  } catch (error) {
    console.error("Error fetching oppertunities details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadbanners = async (req, res) => {
  try {
    if (req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // Access descriptions and colors directly from req.body
    // Ensure they are treated as arrays even if only one banner is uploaded
    const descriptions = Array.isArray(req.body.descriptions)
      ? req.body.descriptions
      : [req.body.descriptions];
    const colors = Array.isArray(req.body.colors)
      ? req.body.colors
      : [req.body.colors];

    const images = req.files.map((file, index) => {
      const description = descriptions[index];
      const color = colors[index];

      if (!description || !description.trim()) {
        throw new Error("Description is required for each banner.");
      }
      if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
        throw new Error("Invalid or missing color code.");
      }

      return {
        filename: file.filename,
        filepath: file.path,
        mimetype: file.mimetype,
        size: file.size,
        description: description,
        descriptionColor: color,
      };
    });

    // Simulating database insertion
    await Banner.insertMany(images);
    res.json({
      message:
        "Images, descriptions, and colors successfully uploaded and saved!",
    });
  } catch (error) {
    console.error("Error uploading Banner:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "active" }).select(
      "filename description descriptionColor -_id"
    );

    if (banners.length === 0) {
      return res.status(404).json({ message: "No active banners found." });
    }

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching active banners:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const BlockOrUnblock = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found in database" });
    }

    banner.status = banner.status === "active" ? "inactive" : "active";
    await banner.save();

    const message =
      banner.status === "active"
        ? "The banner has been successfully set to active."
        : "The banner has been successfully set to inactive.";

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Error toggling banner status:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createProductTips,
  getAllTips,
  changeStatus,
  publishedTips,
  getAllProducts,
  getAllOppertunities,
  uploadbanners,
  getAllBanners,
  getActiveBanners,
  BlockOrUnblock,
};
