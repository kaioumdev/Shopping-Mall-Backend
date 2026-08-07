/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with filters and pagination
 *     description: |
 *       Returns a paginated list of products. Supports filtering by category, color, and price range.
 *
 *       **No authentication required.**
 *
 *       **Pagination:** Use `page` and `limit` query params. Default: page=1, limit=10.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, accessories, dress, jewellery, cosmetics]
 *         description: Filter by product category
 *         example: jewellery
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *           enum: [all, black, red, gold, blue, silver, beige, green]
 *         description: Filter by product color
 *         example: gold
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter (inclusive)
 *         example: 50
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter (inclusive)
 *         example: 200
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *         example: 8
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     totalProducts:
 *                       type: integer
 *                       example: 48
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a single product with its reviews
 *     description: |
 *       Returns full product details and all associated reviews for that product.
 *
 *       **No authentication required.**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *         example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: Product and reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Single Product and reviews }
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product by ID (Admin only)
 *     description: |
 *       Permanently deletes a product and all its associated reviews from the database.
 *
 *       **Requires:** Auth cookie + `role: admin`
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product to delete
 *         example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/products/create-product:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (Admin only)
 *     description: |
 *       Creates a new product listing. After creation, the average rating is automatically calculated from existing reviews.
 *
 *       **Requires:** Auth cookie + `role: admin`
 *
 *       **Image:** Upload image first via `POST /uploadImage`, then pass the returned Cloudinary URL.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             name: Silk Evening Dress
 *             category: dress
 *             description: Elegant silk evening dress perfect for formal occasions
 *             price: 89.99
 *             oldPrice: 120.00
 *             image: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *             color: blue
 *             author: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product created successfully }
 *                 data:    { $ref: '#/components/schemas/Product' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/products/update-product/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Update a product by ID (Admin only)
 *     description: |
 *       Updates any fields of an existing product. Only provided fields are updated.
 *
 *       **Requires:** Auth cookie + `role: admin`
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product to update
 *         example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             name: Silk Evening Dress - Updated
 *             price: 79.99
 *             color: red
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Product updated successfully }
 *                 data:    { $ref: '#/components/schemas/Product' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
