import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    console.log(username, email);
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "all fields are mandetory" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    //create a new user with the fields
    const newUser = new User({
      username,
      email,
      password: hashPass,
    });

    //create token and cookie
    const token = generateTokenAndSetCookie(newUser._id, res);
    //save the user
    await newUser.save();
    res.status(200).json({
      Token: token,
      success: true,
      message: "user successfully created",
      user: newUser,
    });
  } catch (error) {
    console.log("Error is :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "all fields are mandetory" });
    }

    //check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    //create token and cookie
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error is in Login :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

export async function logout(req, res) {
  try {
    //clear the cookie
    res.clearCookie("netflix_token");
    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log("Error is in Logout :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}

export async function authCheck(req, res) {
  try {
    console.log("req.user:", req.user);
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.log("Error is in authCheck :", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
}
