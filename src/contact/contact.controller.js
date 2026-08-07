const Contact = require('./contact.model');

// POST /api/contact — submit a contact form message
const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        // Email format check
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        return res.status(201).json({
            success: true,
            message: 'Your message has been received. We\'ll get back to you shortly!'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
};

// GET /api/contact — admin: get all messages
const getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
    }
};

// PATCH /api/contact/:id — admin: mark as read/replied
const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value.' });
        }

        const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }

        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error('Update status error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update message.' });
    }
};

module.exports = { submitContactForm, getAllMessages, updateMessageStatus };
