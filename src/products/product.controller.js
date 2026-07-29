const Reviews = require("../reviews/review.model");
const { errorResponse, successResponse } = require("../utilis/responseHandler")
const Products = require("./product.model")

const createNewProduct = async (req, res) => {
    try {
        const newProduct =  new Products({
            ...req.body
        })

        const savedProduct =  await newProduct.save();

        // calculate avarage rating
        const reviews = await Reviews.find({productId: savedProduct._id })
        if(reviews.length > 0) {
            const totalRating =  reviews.reduce((acc, review) => acc + review.rating, 0 )
            const avarageRating = totalRating / reviews.length;
            savedProduct.rating = avarageRating;
            await savedProduct.save();
        }

        return successResponse(res, 200, "Product created successfully", savedProduct)
        
    } catch (error) {
        return errorResponse(res, 500, "Failed to create new product", error)
    }
}
