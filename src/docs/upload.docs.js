/**
 * @swagger
 * /uploadImage:
 *   post:
 *     tags: [Upload]
 *     summary: Upload an image to Cloudinary
 *     description: |
 *       Accepts a base64-encoded image string and uploads it to Cloudinary. Returns the public image URL.
 *
 *       **No authentication required.**
 *
 *       **Usage in the admin product form:**
 *       1. Select an image file in the browser.
 *       2. Convert to base64 using `FileReader.readAsDataURL()`.
 *       3. POST the base64 string to this endpoint.
 *       4. Use the returned URL as the `image` field when creating/updating a product.
 *
 *       **Supported formats:** JPEG, PNG, WEBP, GIF
 *       **Max recommended size:** 5MB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64-encoded image string (including data URI prefix)
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *     responses:
 *       200:
 *         description: Image uploaded successfully. Returns the Cloudinary URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Cloudinary CDN URL of the uploaded image
 *               example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
 *       500:
 *         description: Failed to upload image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
