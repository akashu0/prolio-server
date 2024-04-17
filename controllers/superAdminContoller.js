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

    res.status(200).json({ message: `Item status updated to ${status}`});
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error occurred while updating Tips status" });
  }
};

module.exports = {
  createProductTips,
  getAllTips,
  changeStatus
};
