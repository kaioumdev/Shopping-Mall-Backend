const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllMessages,
    updateMessageStatus
} = require('./contact.controller');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public — anyone can submit
router.post('/', submitContactForm);

// Admin only — view all messages
router.get('/', verifyToken, verifyAdmin, getAllMessages);

// Admin only — update message status
router.patch('/:id', verifyToken, verifyAdmin, updateMessageStatus);

module.exports = router;
