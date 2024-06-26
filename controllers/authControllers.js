const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
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
const googleRegister = async (req, res) => {
  try {
    const { email, given_name, family_name, picture } = req.body;

    // checking user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User is Already Existed" });
    }

    //Hash the password
    const hassPassword = await bcrypt.hash("a23sbsb@1xxx", 10);

    const newUser = new User({
      firstName: given_name,
      lastName: family_name,
      email: email,
      password: hassPassword,
      userImg: picture,
      isGoogleLogin: true,
    });
    const user = await newUser.save();
    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userImg: user.userImg,
    };
    const payload = {
      userId: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });
    let responseData = { token, role: user.role, id: user._id, userDetails };
    res.status(200).json({ message: "Register successful", responseData });
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

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userImg: user.userImg,
    };

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });

    let responseData = { token, role: user.role, id: user._id, userDetails };

    if (user.role !== "user" && user.role !== "admin") {
      if (user.departments && user.departments.length > 0) {
        const departments = user.departments.map((dept) => ({
          companyId: user.companyId,
          departmentName: dept.departmentName,
        }));

        responseData = {
          ...responseData,
          departments,
        };
      }
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { email} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userImg: user.userImg,
    };

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });

    let responseData = { token, role: user.role, id: user._id, userDetails };

    if (user.role !== "user" && user.role !== "admin") {
      if (user.departments && user.departments.length > 0) {
        const departments = user.departments.map((dept) => ({
          companyId: user.companyId,
          departmentName: dept.departmentName,
        }));

        responseData = {
          ...responseData,
          departments,
        };
      }
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  googleRegister,
  googleLogin
};
