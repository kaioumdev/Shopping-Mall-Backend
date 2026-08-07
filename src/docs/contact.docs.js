/**
 * @swagger
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit a contact form message
 *     description: |
 *       Stores a contact form submission in the database. No authentication required — anyone can submit.
 *
 *       **Validation:**
 *       - All four fields are required
 *       - `email` must be a valid email format
 *       - `message` must be between 10–2000 characters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *           example:
 *             name: Jane Smith
 *             email: jane@example.com
 *             subject: Order Support
 *             message: I placed an order 3 days ago and haven't received a shipping update. Order ID is 64f1a2b3c4d5e6f7a8b9c0d3.
 *     responses:
 *       201:
 *         description: Message received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message:
 *                   type: string
 *                   example: Your message has been received. We'll get back to you shortly!
 *       400:
 *         description: Validation error — missing fields or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: All fields are required. }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   get:
 *     tags: [Contact]
 *     summary: Get all contact messages (Admin only)
 *     description: |
 *       Returns all contact form submissions sorted by newest first.
 *
 *       **Requires:** Auth cookie + `role: admin`
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/contact/{id}:
 *   patch:
 *     tags: [Contact]
 *     summary: Update contact message status (Admin only)
 *     description: |
 *       Marks a contact message as `read` or `replied` for admin tracking.
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
 *         description: MongoDB ObjectId of the contact message
 *         example: 64f1a2b3c4d5e6f7a8b9c0d5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateContactStatusRequest'
 *           example:
 *             status: replied
 *     responses:
 *       200:
 *         description: Message status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:    { $ref: '#/components/schemas/ContactMessage' }
 *       400:
 *         description: Invalid status value
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
