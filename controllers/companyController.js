const CompanyModel = require("../model/companyDetailsModel");
const User = require("../model/userModel");

const registerNewCompany = async (req, res) => {
  try {
    const { formData, contactData } = req.body;
    // console.log(data.companyName);
    // console.log(contactData);
    const Data = JSON.parse(formData);
    const contactInfo = JSON.parse(contactData);
    const { userId } = req.user;

    const documents = req.files;
    const saveFiles = [];

    documents.forEach((file) => {
      saveFiles.push({ filename: file.filename });
    });

    // console.log(saveFiles);

    const changeStatus = await User.findById(userId);
    if (!changeStatus) {
      return res.status(400).json({ message: "User is not found" });
    }

    const newCompanyDetails = new CompanyModel({
      companyName: Data.companyName,
      OwnerName: Data.OwnerName,
      registrationNumber: Data.registrationNumber,
      yearOfRegister: Data.yearOfEstablishment,
      businessType: Data.businessType,
      totalEmployees: Data.totalEmployees,
      companyEmail: contactInfo.companyEmail,
      contactNumber: contactInfo.contactNumber,
      address1: contactInfo.address1,
      address2: contactInfo.address2,
      state: contactInfo.state,
      city: contactInfo.city,
      documents: saveFiles,
      userId: userId,
    });

    await newCompanyDetails.save();

    return res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Error saving company details:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCompanyList = async (req, res) => {
  try {
    const fetchData = await CompanyModel.find();

    res.status(200).json(fetchData);
  } catch (error) {
    console.error("Error saving company details:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifiedCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const updateStatus = await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      { status: "verified" },
      { new: true }
    );
    if (updateStatus) {
      const fetchData = await CompanyModel.findById(companyId);

      if (fetchData) {
        const userdetails = await User.findById(fetchData.userId);

        if (userdetails) {
          userdetails.role = "admin";
          await userdetails.save();
          return res
            .status(200)
            .json({ message: "Company Verified Successfully" });
        }
      }
    }
    return res.status(400).json({ message: "Error Updating the Status" });
  } catch (error) {
    console.error("Error verifying company:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const rejectedCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const { text } = req.body;

    const updateStatus = await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      { status: "rejected", rejectedReason: text },

      { new: true }
    );

    if (updateStatus) {
      const fetchData = await CompanyModel.findById(companyId);

      if (fetchData) {
        const userdetails = await User.findById(fetchData.userId);

        if (userdetails) {
          userdetails.role = "user";
          await userdetails.save();
          return res.status(200).json({ message: "Company Rejected " });
        }
      }
    }
    res.status(400).json({ message: "Error Updatinh In the Status" });
  } catch (error) {
    console.error("Error saving company details:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerNewCompany,
  getAllCompanyList,
  verifiedCompany,
  rejectedCompany,
};
