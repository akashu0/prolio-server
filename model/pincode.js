const mongoose = require("mongoose");
const PincodeSchema = new mongoose.Schema({
  country: {
    type: String,
    unique: true,
    required: true,
  },
  stateName: [
    {
      name: {
        type: String,
        required: true,
      },
      cityName: [
        {
          name: {
            type: String,
            required: true,
          },
          pincodes: [
            {
              type: String,
              required: true,
            },
          ],
        },
      ],
    },
  ],
});

const PincodeModel = mongoose.model("Pincode", PincodeSchema);

module.exports = PincodeModel;
