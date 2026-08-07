/**
 * @swagger
 * /api/reviews/post-review:
 *   post:
 *     tags: [Reviews]
 *     summary: Post or update a product review
 *     description: |
 *       Creates a new review for a product, or **updates** the existing one if the user has already reviewed that product (one review per user per product).
 *
 *       After saving, the product's **average rating is automatically recalculated**.
 *
 *       **Requires:** Auth cookie (user must be logged in).
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReviewRequest'
 *           example:
 *             comment: Absolutely love this product! Great quality and fast delivery.
 *             rating: 5
 *             userId: 64f1a2b3c4d5e6f7a8b9c0d1
 *             productId: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: Review posted/updated successfully. Returns all reviews for that product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Review posted successfully }
 *                 data:
 *                   type: array
 *                   description: All reviews for this product, sorted by updatedAt descending
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/reviews/total-reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get total review count across all products
 *     description: |
 *       Returns the total number of reviews in the database. Used in the admin stats dashboard.
 *
 *       **No authentication required.**
 *     responses:
 *       200:
 *         description: Total reviews count fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Total reviews fetched successfully }
 *                 data:
 *                   type: integer
 *                   description: Total number of reviews
 *                   example: 142
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/reviews/{userId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews by a specific user
 *     description: |
 *       Returns all reviews written by a user, sorted by creation date (newest first).
 *
 *       **No authentication required.**
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Reviews fetched successfully }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       400:
 *         description: Missing user ID
 *       404:
 *         description: No reviews found for this user
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
