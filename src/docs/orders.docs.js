/**
 * @swagger
 * /api/orders/create-checkout-session:
 *   post:
 *     tags: [Orders]
 *     summary: Create a Stripe checkout session
 *     description: |
 *       Initiates a Stripe Checkout payment session. Returns a Stripe session ID which the frontend uses to redirect the user to Stripe's hosted payment page.
 *
 *       **No authentication required** (public endpoint).
 *
 *       **Flow:**
 *       1. Frontend calls this with cart products.
 *       2. Backend creates Stripe session, returns `{ id: "cs_xxx" }`.
 *       3. Frontend calls `stripe.redirectToCheckout({ sessionId })`.
 *       4. User completes payment on Stripe.
 *       5. Stripe redirects to `GET /success?session_id=...`.
 *       6. Frontend calls `POST /api/orders/confirm-payment` with the session_id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *           example:
 *             userId: 64f1a2b3c4d5e6f7a8b9c0d1
 *             products:
 *               - name: Diamond Earrings
 *                 image: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *                 price: 149.99
 *                 quantity: 1
 *               - name: Silk Dress
 *                 image: https://res.cloudinary.com/demo/image/upload/dress.jpg
 *                 price: 89.99
 *                 quantity: 2
 *     responses:
 *       200:
 *         description: Stripe session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Stripe Checkout Session ID
 *                   example: cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/orders/confirm-payment:
 *   post:
 *     tags: [Orders]
 *     summary: Confirm payment and create order record
 *     description: |
 *       Called after Stripe redirects the user back to the success page. Retrieves the Stripe session, creates (or updates) an order record in MongoDB.
 *
 *       **Order status is set to `pending` if payment succeeded, `failed` otherwise.**
 *
 *       **No authentication required.**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [session_id]
 *             properties:
 *               session_id:
 *                 type: string
 *                 description: Stripe Checkout Session ID from the redirect URL
 *                 example: cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5
 *     responses:
 *       200:
 *         description: Order confirmed and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order confirmed successfully }
 *                 data:    { $ref: '#/components/schemas/Order' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (Admin only)
 *     description: |
 *       Returns all orders sorted by creation date (newest first).
 *
 *       **Requires:** Auth cookie + `role: admin`
 *
 *       > Note: This endpoint does **not** have auth middleware applied in the current implementation.
 *       > It is intended for admin use.
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Orders fetched successfully }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       404:
 *         description: No orders found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/orders/{email}:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders by customer email
 *     description: |
 *       Returns all orders placed by a customer with the given email address, sorted newest first.
 *
 *       **No authentication required** (relies on email as identifier).
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Customer email address
 *         example: john@example.com
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Orders fetched successfully }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       400:
 *         description: Email is required
 *       404:
 *         description: No orders found for this email
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/orders/order/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get a single order by MongoDB ID
 *     description: |
 *       Returns the full details of a single order by its MongoDB `_id`.
 *
 *       **No authentication required.**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *         example: 64f1a2b3c4d5e6f7a8b9c0d3
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order fetched successfully }
 *                 data:    { $ref: '#/components/schemas/Order' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/orders/update-order-status/{id}:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (Admin only)
 *     description: |
 *       Updates the fulfillment status of an order.
 *
 *       **Status lifecycle:** `pending` → `processing` → `shipped` → `completed`
 *
 *       > Note: Auth middleware is not applied to this route in the current implementation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *         example: 64f1a2b3c4d5e6f7a8b9c0d3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *           example:
 *             status: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Order status updated successfully }
 *                 data:    { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Status is required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/orders/delete-order/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order by ID (Admin only)
 *     description: |
 *       Permanently deletes an order record from the database.
 *
 *       > Note: Auth middleware is not applied to this route in the current implementation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order to delete
 *         example: 64f1a2b3c4d5e6f7a8b9c0d3
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
