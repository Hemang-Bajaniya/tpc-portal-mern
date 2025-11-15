import TpoProfile from "../models/TpoProfile.js";
import User from "../models/User.js";
import { apiResponse } from "../util/apiResponse.js";
import express from "express";

const router = express.Router();

export const getTpoProfile = async (req, res) => {
    try {
        const tpcUserId = req.user.userId;

        const tpoProfile = await TpoProfile.findOne({ userId: tpcUserId }).populate("userId", "email");
        if (!tpoProfile) {
            return res
                .status(404)
                .json(
                    apiResponse({
                        success: false,
                        message: "TPO profile not found",
                        status: 404,
                    })
                );
        }
        return res.json(
            apiResponse({
                data: tpoProfile,
                message: "TPO profile fetched",
                status: 200,
            })
        );
    } catch (err) {
        res
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

export const updateTpoProfile = async (req, res) => {
    try {
        const tpoUserId = req.user.userId;
        const { name, mobile, email } = req.body;
        const tpoProfile = await TpoProfile.findOne({ userId: tpoUserId });
        if (!tpoProfile) {
            return res
                .status(404)
                .json(
                    apiResponse({
                        success: false,
                        message: "TPO profile not found",
                        status: 404,
                    })
                );
        }

        const user = await User.findById(tpoProfile.userId);
        if (!user) {
            return res
                .status(404)
                .json(
                    apiResponse({
                        success: false,
                        message: "Associated user not found",
                        status: 404,
                    })
                );
        }

        if (name !== undefined) tpoProfile.name = name;
        if (mobile !== undefined) tpoProfile.mobile = mobile;
        if (email !== undefined) user.email = email;

        await tpoProfile.save();
        await user.save();
        return res.json(
            apiResponse({
                data: tpoProfile,
                message: "TPO profile updated",
                status: 200,
            })
        );
    } catch (err) {
        res
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
