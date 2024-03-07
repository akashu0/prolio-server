const CompanyModel = require("../model/companyDetailsModel");

const registerNewCompany = async (req, res) => {
  try {
    const { formData, contactData, documentData } = req.body;
    console.log();

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
      documents: documentData.map((item) => item.base64), // Assuming documentData contains base64 strings
    });
    await newCompanyDetails.save();
    res.status(201).json({ message: "Register Successfully" });
  } catch (error) {
    console.error("Error saving company details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerNewCompany,
};
