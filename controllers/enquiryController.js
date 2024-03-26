const Enquiry = require("../model/enquiryModel");
const Product = require("../model/productModel");
const Company = require("../model/companyDetailsModel");

const CreateEnquiry = async (req, res) => {
  try {

    const { userId, role } = req.user;

    const { productId, text, companyId } = req.body;
    console.log(companyId);

    const feedData = new Enquiry({
      productId: productId,
      userId: userId,
      companyId: companyId,
      message: [{ text: text,  }],
    });
    await feedData.save();
    res.status(201).json({ message: "Enquiry Send " });
  } catch (error) {
    console.error("Error creating enquiry:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEnquiry = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.user;

    const enquiry = await Enquiry.findOne({ productId, userId })

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json(enquiry);
  } catch (error) {
    console.error("Error fetching enquiries:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const { productId, text, companyId } = req.body;
    const { userId, role } = req.user;
    const enquiry = await Enquiry.findOne({ productId, userId, companyId });
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    enquiry.message.push({ text: text,});

    await enquiry.save(); // Don't forget to save the updated enquiry

    res.status(201).json({ message: "Update the enquires" });
  } catch (error) {
    console.error("Error updating enquiries:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL ENQUIRY FOR USER

const getByUserEnquiry = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const enquiryData = await Enquiry.find({ userId: userId })
      .populate("userId")
      .populate("productId");

    if (!enquiryData) {
      return res.status(201).json({ message: "Enquiry is Empty" });
    }

    res.status(201).json(enquiryData);
  } catch (error) {
    console.error("Error getByUserEnquiry :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const id = req.params.id;

    const fetchData = await Enquiry.findById(id)
      .populate("productId")
      .populate("userId");
    if (!fetchData) {
      return res.status(201).json({ message: "Enquiry is Empty" });
    }

    res.status(201).json(fetchData);
  } catch (error) {
    console.error("Error getEnquiryById :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getReceivedEnquiry = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const getCompanyId = await Company.findOne({ userId: userId });

    if (!getCompanyId) {
      return res.status(201).json({ message: "Company is not Registred" });
    }

    const getProductsEnquiry = await Enquiry.find({
      companyId: getCompanyId._id,
    })
      .populate("userId")
      .populate("productId");

    res.status(201).json(getProductsEnquiry);
  } catch (error) {
    console.error("Error getReceivedEnquiry :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sentEnquiry = async (req, res) => {
  try {
    const { productId, text, companyId } = req.body;
    const { userId, role } = req.user;
    const enquiry = await Enquiry.findOne({ productId, companyId });
    console.log(enquiry, "............enquiry");
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    enquiry.message.push({ text: text, from: role });
    enquiry.status = "received";

    await enquiry.save(); // Don't forget to save the updated enquiry

    res.status(201).json({ message: "Update the enquires" });
  } catch (error) {
    console.error("Error updating enquiries:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CreateEnquiry,
  getEnquiry,
  updateEnquiry,
  getByUserEnquiry,
  getEnquiryById,
  getReceivedEnquiry,
  sentEnquiry,
};
