const faqs = require("../model/faqModel");
const Company = require("../model/companyDetailsModel");
const Product = require("../model/productModel");
const Access = require("../model/accessModel");
const Otp = require("../model/otpModel");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const User = require("../model/userModel");

dotenv.config();

const createFaqs = async (req, res) => {
  try {
    const { productId, text, companyId } = req.body;

    const { userId } = req.user;

    const createData = new faqs({
      productId: productId,
      userId: userId,
      questions: text,
      companyId: companyId,
    });
    await createData.save();
    // console.log(newd, "adisakke created");
    res.status(200).json({ message: "Posted the Question Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating Question" });
  }
};

const updateFaqs = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { answer } = req.body;

    // Update the FAQ with the new answer and set status to "published"
    const updatedFaq = await faqs.findByIdAndUpdate(
      id,
      { answer, status: "published" },
      { new: true }
    );

    if (updatedFaq) {
      res.status(200).json({
        message: "FAQ updated and published successfully",
        faq: updatedFaq,
      });
    } else {
      res.status(404).json({ message: "FAQ not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating FAQ" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["published", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const faqItem = await faqs.findByIdAndUpdate(id, { status }, { new: true });

    if (!faqItem) {
      return res.status(404).json({ message: "FAQ item not found." });
    }

    res.status(200).json({
      message: `FAQ item status updated to ${status}`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating FAQ status" });
  }
};

const getFaqsByCompany = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (role === "admin") {
      const checkExistscompany = await Company.findOne({ userId: userId });
      if (!checkExistscompany) {
        return res.status(400).json({ message: "Company is not Registered" });
      }

      const findFaqs = await faqs.find({ companyId: checkExistscompany._id });
      if (!findFaqs) {
        return res.status(400).json({ message: "faqs is Empty" });
      }
      return res.status(200).json(findFaqs);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error getting FAQ" });
  }
};

const publishedFaqs = async (req, res) => {
  try {
    const { productId } = req.params;

    const getData = await faqs.find({
      productId: productId,
      status: "published",
    });

    if (!getData || getData.length === 0) {
      return res.status(201).json({
        message: "Empty published FAQs found for the specified product",
      });
    }

    res.status(200).json(getData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error getting published FAQs for the specified product",
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { selectedProductType, selectedCategoryName } = req.params;

    if (!selectedCategoryName || !selectedProductType) {
      return res.status(400).json({ message: "No category or type provided" });
    }

    const { userId } = req.user;

    const collectData = await Product.find({
      userId: userId,
      category: selectedCategoryName,
      type: selectedProductType,
      status: "approved",
    });

    const transformedData = collectData.map((product) => {
      const productDetailsStep = product.questions?.steps?.find(
        (step) => step.name === "Product Details"
      );

      if (!productDetailsStep) {
        return { message: "Product details step not found." };
      }

      const productNameQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Name"
      );
      const brandNameQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Brand Name"
      );
      const productImageQuestion = productDetailsStep.questions.find(
        (q) => q.description === "Product Image"
      );

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
        productName: productNameQuestion ? productNameQuestion.value : "N/A",
        brandName: brandNameQuestion ? brandNameQuestion.value : "N/A",
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

const createDepartment = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { Department, type, category, fetaure, products, createdBy } =
      req.body.formData;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }

    // Check if a department with the same name, type, and category exists
    const departmentExists = await Access.findOne({
      department: Department,
      type: type,
      category: category,
    });

    if (departmentExists) {
      return res.status(201).json({
        message: "Department with the same type and category already exists.",
      });
    }

    // If no existing department is found, create a new one
    const newDepartment = new Access({
      type: type,
      category: category,
      department: Department,
      createdBy: createdBy,
      products: products,
      fetaure: fetaure,
      userId: userId,
    });

    const savedDepartment = await newDepartment.save();
    res.status(200).json({ message: "Created department successfully." });
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getAllDepartment = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const getData = await Access.find({ userId }).populate("products");
    res.status(200).json(getData);
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID, // Ensure these are set in your .env file or environment
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Setup email data with unicode symbols
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "OTP Verification",
    text: `Please enter the OTP for login: ${otp}`,
    html: `<b>Please enter the OTP for login:</b> ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

const sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const otp = otpGenerator.generate(4, {
      digits: true,
      alphabets: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
      console.log(`Updated OTP for ${email}: ${otp}`);
    } else {
      const saveOtp = new Otp({ email, otp });
      await saveOtp.save();
      console.log(`New OTP for ${email}: ${otp}`);
    }

    const mailSent = await sendOtpEmail(email, otp);
    if (mailSent) {
      res.status(200).json({ message: "OTP sent to provided email" });
    } else {
      res.status(500).json({ message: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error("Error in send-otp route:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid OTP or email. Please try again." });
    }
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department } =
      req.body.userData;
    console.log(password, "passssssssssssss");
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !role ||
      !department
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const emailExist = await User.findOne({ email: email.toLowerCase() });
    if (emailExist) {
      return res.status(409).send("Email already exists");
    }

    const { userId } = req.user;

    const activeCompany = await Company.findOne({
      userId: userId,
      status: "verified",
    });

    if (!activeCompany) {
      return res
        .status(404)
        .json({ message: "No active company found for the user." });
    }

    const hassPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hassPassword,
      role,
      departments: department,
      companyId: activeCompany._id,
    });

    await newUser.save();
    await sendWelcomeEmail(email, firstName, password);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getAccessUserlist = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const companyDetails = await Company.findOne({
      userId: userId,
      status: "verified",
    });

    if (!companyDetails) {
      return res
        .status(400)
        .json({ message: "The company does not exist or is blocked." });
    }

    const users = await User.find({ companyId: companyDetails._id })
      .select("firstName lastName email departments role _id") // Specify the fields to retrieve
      .lean();

    const formattedUsers = users.map((user, index) => ({
      userName: `${user.firstName} ${user.lastName}`, // Combine firstName and lastName
      email: user.email,
      departments: `${user.departments.length} departments`, // Assuming 'departments' is an array
      role: user.role,
      _id: user._id,
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error("Error getting details:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const getAccessUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -is_admin -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting details:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const updateAccessUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, departments, password } =
      req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.role = role;
    user.departments = departments;

    // Check if password was included and needs to be changed
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save(); // Save the updated user
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error getting details:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendWelcomeEmail = async (email, firstName, password) => {
  const mailOptions = {
    from: `${process.env.EMAIL_ID} <no-reply@>`,
    to: email,
    subject: "Welcome to Prolio!",
    text: `Hello ${firstName},

  Welcome to the team! 

   To start working, please log in to Prolio using your email:
   Email ID: ${email}
   Password: ${password}

   We recommend changing your password after your first login for security reasons.

Best regards,
Your Company Team,
Prolio`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

const deleteAccessUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "iddddddd");

    // Perform the deletion operation
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if a user was actually deleted
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a success response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createFaqs,
  updateFaqs,
  getFaqsByCompany,
  updateStatus,
  publishedFaqs,
  getProductByCategory,
  createDepartment,
  getAllDepartment,
  sendEmail,
  verifyOtp,
  createUser,
  getAccessUserlist,
  getAccessUserById,
  updateAccessUserById,
  deleteAccessUser,
};
