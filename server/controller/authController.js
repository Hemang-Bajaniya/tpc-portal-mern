import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import StudentProfile from "../models/StudentProfile.js";
import TpoProfile from "../models/TpoProfile.js";
import TPFProfile from "../models/TPFProfile.js";
import TpcProfile from "../models/TpcProfile.js";
import { apiResponse } from "../util/apiResponse.js";
import AcademicDetails from "../models/AcademicDetails.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Email and password are required.",
            status: 400,
          })
        );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(
          apiResponse({
            success: false,
            message: "Invalid email.",
            status: 401,
          })
        );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json(
          apiResponse({
            success: false,
            message: "Invalid password.",
            status: 401,
          })
        );
    }
    if (!user.approved) {
      return res
        .status(403)
        .json(
          apiResponse({
            success: false,
            message: `Awaiting approval from ${
              user.role == "TPC" ? "TPO" : "TPC"
            }.`,
            data: { approved: false, role: user.role },
            status: 403,
          })
        );
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

     // Set token in HTTP-only cookie
    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json(
      apiResponse({
        message: "Login successful.",
        data: { token, role: user.role, approved: user.approved },
        status: 200,
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Server error",
          error: err.message,
          status: 500,
        })
      );
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role, deptId, ...profileFields } = req.body;
    if (!email || !password || !role || !deptId) {
      return res
        .status(400)
        .json(
          apiResponse({
            success: false,
            message: "Email, password, role, and department are required.",
            status: 400,
          })
        );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json(
          apiResponse({
            success: false,
            message: "User already exists.",
            status: 409,
          })
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let approved = false;
    if (role === "TPF") approved = true;

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      approved,
      dept_id: deptId,
    });

    if (role === "Student") {
      const sp = await StudentProfile.create({
        userId: user._id,
        dept_id: deptId,
        ...profileFields,
      });
      await AcademicDetails.create({ user_id: sp._id });
    } else if (role === "TPC") {
      await TpcProfile.create({
        userId: user._id,
        dept_id: deptId,
        ...profileFields,
      });
    } else if (role === "TPF") {
      await TPFProfile.create({
        userId: user._id,
        dept_id: deptId,
        ...profileFields,
      });
    }
    return res
      .status(201)
      .json(
        apiResponse({
          message:
            "Registration successful. Please wait for approval if required.",
          status: 201,
        })
      );
  } catch (err) {
    return res
      .status(500)
      .json(
        apiResponse({
          success: false,
          message: "Server error",
          error: err.message,
          status: 500,
        })
      );
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json(apiResponse({ message: 'Logout successful.', status: 200 }));
};