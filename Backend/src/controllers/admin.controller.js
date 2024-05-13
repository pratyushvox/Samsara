import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose, { isValidObjectId } from "mongoose"

import jwt from "jsonwebtoken"



const removeSeller = asyncHandler(async (req, res) => {

    const { userId } = req.params


    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invali user id || object id")
    }

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
        throw new ApiError(500, {}, "something went wrong whiel deleting user")
    }

    return res
        .status(204)
        .json(new ApiResponse(204, {}, "User removed successfully"))

})

const AllSeller = asyncHandler(async (req, res) => {

    const sellers = await User.aggregate([
        {
            $match: {
                email: { $regex: "seller.", $options: 'i' }
            }
        },

        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "owner",
                as: "products"
            }
        },

        {
            $project: {
                password: 0,
                refreshToken: 0
            }
        }
    ])


    if (!sellers) {
        throw new ApiError(500, "Something wenth wrong while fetching seller")
    }


    return res
        .status(200)
        .json(new ApiResponse(200, sellers, "Seller fetched sucessfully"))


})


export {
    removeSeller,
    AllSeller
}