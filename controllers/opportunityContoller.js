const User = require("../model/userModel");

const createOppor = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bodydata = req.body;

    const findUser = await User.findById({ _id: userId });

    if (findUser) {
      findUser.oppurtunities = bodydata;
      await findUser.save();
      return res
        .status(201)
        .json({ message: "Successfully applied oppurtunities" });
    }

    res.status(400).json({ message: "Error counter" });
  } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllOpper = async(req,res) => {
   try {
    const companyId = req.params.companyId

    const fetchData = await User.find({"oppurtunities.companyId": companyId  })

    
   } catch (error) {
    console.error("Error saving product details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
   }
   

}

module.exports = {
  createOppor,
};
