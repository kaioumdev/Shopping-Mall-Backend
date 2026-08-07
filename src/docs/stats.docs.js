/**
 * @swagger
 * /api/stats/user-stats/{email}:
 *   get:
 *     tags: [Stats]
 *     summary: Get dashboard stats for a specific user
 *     description: |
 *       Returns aggregated activity stats for a user's personal dashboard:
 *       - **Total payments** — sum of all order amounts for this email
 *       - **Total reviews** — count of reviews submitted by this user
 *       - **Purchased products** — count of distinct products purchased
 *
 *       **No authentication required** (uses email as identifier).
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user
 *         example: john@example.com
 *     responses:
 *       200:
 *         description: User stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Fetched User stats successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPayments:
 *                       type: number
 *                       description: Total amount spent across all orders (USD)
 *                       example: 439.97
 *                     totalReviews:
 *                       type: integer
 *                       description: Total number of reviews posted by this user
 *                       example: 7
 *                     totalPurchadedProducts:
 *                       type: integer
 *                       description: Total number of distinct products purchased
 *                       example: 12
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/stats/admin-stats:
 *   get:
 *     tags: [Stats]
 *     summary: Get comprehensive admin dashboard statistics
 *     description: |
 *       Returns a full analytics summary for the admin dashboard:
 *       - **totalOrders** — all-time order count
 *       - **totalProducts** — total products in catalog
 *       - **totalReviews** — total customer reviews
 *       - **totalUsers** — total registered users
 *       - **totalEarnings** — sum of all order amounts (USD)
 *       - **monthlyEarnings** — array of earnings grouped by month/year for chart rendering
 *
 *       **No authentication required** (intended for admin use).
 *     responses:
 *       200:
 *         description: Admin stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                   example: 284
 *                 totalProducts:
 *                   type: integer
 *                   example: 96
 *                 totalReviews:
 *                   type: integer
 *                   example: 412
 *                 totalUsers:
 *                   type: integer
 *                   example: 1203
 *                 totalEarnings:
 *                   type: number
 *                   description: Cumulative revenue from all orders (USD)
 *                   example: 42680.50
 *                 monthlyEarnings:
 *                   type: array
 *                   description: Monthly earnings breakdown for charting
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                         description: Month number (1–12)
 *                         example: 7
 *                       year:
 *                         type: integer
 *                         example: 2025
 *                       earnings:
 *                         type: number
 *                         example: 5320.75
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
