const CompanyModel = require("../model/companyDetailsModel");
const User = require("../model/userModel");

const registerNewCompany = async (req, res) => {
  try {
    const { formData, contactData, documentData, userId } = req.body;
    

    const changeStatus = await User.findById(userId);
    if (!changeStatus) {
      return res.status(400).json({ message: "User is not found" });
    }

    const newCompanyDetails = new CompanyModel({
      companyName: formData.companyName,
      OwnerName: formData.OwnerName,
      registrationNumber: formData.registrationNumber,
      yearOfRegister: formData.yearOfEstablishment,
      businessType: formData.businessType,
      totalEmployees: formData.totalEmployees,
      companyEmail: contactData.companyEmail,
      contactNumber: contactData.contactNumber,
      address1: contactData.address1,
      address2: contactData.address2,
      country: contactData.country,
      state: contactData.state,
      city: contactData.city,
      pincode: contactData.pincode,
      documents: documentData.map((item) => item.base64),
      userId: userId,
    });

    await newCompanyDetails.save();

    changeStatus.role = "admin";
    await changeStatus.save();

    return res.status(201).json({ message: "Registered successfully" ,role: changeStatus.role});
  } catch (error) {
    console.error("Error saving company details:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerNewCompany,
};
