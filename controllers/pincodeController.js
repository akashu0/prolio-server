const PincodeModel = require("../model/pincode");

//   try {
//     const pincodeData = req.body;

//     const newPin = new PincodeModel(pincodeData);
//     const data = await newPin.save();
//     res.status(201).json(data);
//   } catch (error) {
//     console.error("Error saving pin code:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const createPincode = async (req, res) => {
  try {
    const { country, stateName } = req.body;
    let existingPin = await PincodeModel.findOne({ country }); // Check if the country already exists in the database
    if (existingPin) {
      stateName.forEach(async (state) => {
        // Loop through each state in the request body
        let existingState = existingPin.stateName.find(
          (s) => s.name === state.name
        );
        if (existingState) {
          state.cityName.forEach((city) => {
            // If the state exists, loop through each city
            let existingCity = existingState.cityName.find(
              (c) => c.name === city.name
            );
            if (existingCity) {
              city.pincodes.forEach((code) => {
                if (!existingCity.pincodes.includes(code)) {
                  existingCity.pincodes.push(code); // If the city exists, update its pin codes array
                }
              });
            } else {
              existingState.cityName.push(city); // If the city doesn't exist, create a new city
            }
          });
        } else {
          existingPin.stateName.push(state); // If the state doesn't exist, create a new state
        }
      });
      const updatedPin = await existingPin.save(); // Save the updated entry
      res.status(200).json({ message: "success", pincode: updatedPin });
    } else {
      const newPin = new PincodeModel(req.body); // If the country doesn't exist, create a new entry
      const savedPin = await newPin.save();
      res.status(201).json({ message: "success", pincode: savedPin });
    }
  } catch (error) {
    console.error("Error saving pin code:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPincode = async (req, res) => {
  try {
    const allPincode = await PincodeModel.find();
    res.status(200).json(allPincode);
  } catch (error) {
    console.error("Error saving pin code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPincode,
  getAllPincode,
};
