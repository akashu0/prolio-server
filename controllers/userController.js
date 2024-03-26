const User = require("../model/userModel");
const Wishlist = require("../model/wishlistModel");
const bcrypt = require("bcrypt");

const fetchUserDetails = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(401).json({ message: "User is not Found" });
    }
    const userDataWithoutPassword = { ...userData.toObject() };
    delete userDataWithoutPassword.password; // Remove the password field

    res.status(201).json(userDataWithoutPassword);
  } catch (error) {
    console.error("Error saving user details:", error.message);
    res.status(500).json({ error: "Error saving user details" });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { firstName, lastName, email, contactNumber, password, image } =
      req.body;
    const updatedFields = {}; // Initialize an object to store the fields to be updated

    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (email) updatedFields.email = email;
    if (contactNumber) updatedFields.contactNumber = contactNumber;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    if (image) updatedFields.userImg = image;


    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.log(error.message);
  }
};

const addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.user;

    // Check if the product is already in the user's wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist && wishlist.products.includes(productId)) {
      return res
        .status(201)
        .json({ message: "Product already exists in wishlist" });
    }

    // Add productId to user's wishlist
    await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { products: productId } },
      { upsert: true }
    );

    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error("Error adding product to wishlist:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const allWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = await Wishlist.find({ userId: userId }).populate(
      "products",
      "-__v"
    ); // Excluding _id and __v fields from products

    const products = data.map((wishlist) => wishlist.products); // Extracting products from each wishlist

    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving wishlist products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming userId is available in the request object
    const productId = req.params.productId;

    // Find the user's wishlist and remove the productId from the products array
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res
      .status(200)
      .json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing product from wishlist:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fetchUserDetails,
  addWishlist,
  allWishlistByUser,
  removeFromWishlist,
  updateUserDetails,
};
