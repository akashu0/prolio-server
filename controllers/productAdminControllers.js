const faqs = require("../model/faqModel");
const Company = require("../model/companyDetailsModel");
const Product = require("../model/productModel");

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
      return res
        .status(201)
        .json({ message: "Empty published FAQs found for the specified product" });
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
    const { selectedProductType, selectedCategoryName } = req.params

    console.log(selectedProductType,"typeeeeeee");
    console.log(selectedCategoryName,"category");

    if (!selectedCategoryName || !selectedProductType) {
      return res.status(400).json({ message: "No category or type provided" });
    }

    const { userId } = req.user;

    const collectData = await Product.find({
      userId: userId,
      category: selectedCategoryName,
      type: selectedProductType,
      status: "approved"  
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

      let primaryImage = "", secondaryImage = "";
      if (productImageQuestion && productImageQuestion.images.length > 0) {
        primaryImage = productImageQuestion.images[0].base64 || productImageQuestion.images[0].url;
        if (productImageQuestion.images.length > 1) {
          secondaryImage = productImageQuestion.images[1].base64 || productImageQuestion.images[1].url;
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



module.exports = {
  createFaqs,
  updateFaqs,
  getFaqsByCompany,
  updateStatus,
  publishedFaqs,
  getProductByCategory
};
