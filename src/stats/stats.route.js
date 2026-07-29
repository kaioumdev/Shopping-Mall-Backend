const express = require('express');
const { errorResponse, successResponse } = require('../utilis/responseHandler');
const User = require('../users/user.model');
const Order = require('../orders/order.model');
const Reviews = require('../reviews/review.model');
const Products = require('../products/product.model');
const router = express.Router();

// user stats
router.get("/user-stats/:email", async(req, res) => {
    const {email} = req.params;
    if(!email) {
        return errorResponse(res, 400, "Email is required")
    }
     try {
        const user = await User.findOne({email: email});
        if(!user) {
            return errorResponse(res, 404, "User not found")
        }

        // total payments
        const totalPaymentsResult =  await Order.aggregate([
            {$match: {email: email} },
            {$group: {_id: null, totalAmount: {$sum:"$amount" }}}
        ])

        const totalPaymentsAmount =  totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0

        // total reviews
        const totalReviews =  await Reviews.countDocuments({userId: user._id})
        
        const  purchasedProductsIds = await Order.distinct("products.productId", {email: email});
       const totalPurchadedProducts = purchasedProductsIds.length;

       return successResponse(res, 200, "Fetched User stats successfully", {
        totalPayments: Number(totalPaymentsAmount.toFixed(2)),
        totalReviews,
        totalPurchadedProducts
       })


     } catch (error) {
        return errorResponse(res, 500, "Couldn't get user stats", error)
     }
})

