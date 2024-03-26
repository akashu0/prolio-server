const User = require("../model/userModel");
const Opportunity = require("../model/opportunityModel");

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

const getOpportunityById = async(req,res) =>{

  try {

    const fectData = await Opportunity.findOne({})
    
  } catch (error) {
    console.error("Error Opportunity :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

module.exports = {
  createOpportunity,
  getByUserOpportunity,
};
