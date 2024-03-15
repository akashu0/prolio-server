const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// user register
const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // checking user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User is Already Existed" });
    }

    //Hash the password
    const hassPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hassPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Register successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//user login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });

    res.status(200).json({ token, role: user.role, id: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
};
