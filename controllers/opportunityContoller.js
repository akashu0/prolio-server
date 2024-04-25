const User = require("../model/userModel");
const Opportunity = require("../model/opportunityModel");
const Company = require("../model/companyDetailsModel");

const createOpportunity = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, companyId, formData } = req.body;

    const feedData = new Opportunity({
      productId: productId,
      userId: userId,
      companyId: companyId,
      formData: formData,
    });

    await feedData.save();
    res.status(200).json({ message: "form submitted" });
  } catch (error) {
    console.error("Error saving form details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getByUserOpportunity = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const opportunityData = await Opportunity.find({ userId: userId })
      .populate("productId")
      .populate("userId");

    res.status(200).json(opportunityData);
  } catch (error) {
    console.error("Error Opportunity :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const fetchData = await Opportunity.findById(id)
      .populate("productId")
      .populate("companyId");

    if (!fetchData) {
      return res
        .status(400)
        .json({ message: "The Opportunity Data is not Available " });
    }

    res.status(200).json(fetchData);
  } catch (error) {
    console.error("Error Opportunity :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getReceviedOpportunityByCompany = async (req, res) => {
  try {
    // console.log("clcik");
    const { userId, role } = req.user;
    const getCompanyId = await Company.findOne({ userId: userId });

    if (!getCompanyId) {
      return res.status(201).json({ message: "Company is not Registred" });
    }
    const getProductsOppertunities = await Opportunity.find({
      companyId: getCompanyId._id,
    })
      .populate("userId")
      .populate("productId");

    res.status(201).json(getProductsOppertunities);
  } catch (error) {
    console.error("Error getting Opportunity :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const item = await Opportunity.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.status(200).json({ message: `Oppertunity successfully  ${status}` });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error occurred while updating Oppertunity status" });
  }
};

module.exports = {
  createOpportunity,
  getByUserOpportunity,
  getOpportunityById,
  getReceviedOpportunityByCompany,
  updatedStatus
};
