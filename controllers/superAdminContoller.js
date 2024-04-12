const Tips = require("../model/productTipsModel");

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
    res.status(200).json({ message: "Adisakke create" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating Product Buying Tips" });
  }
};

module.exports = {
  createProductTips,
};
