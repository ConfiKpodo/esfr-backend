const Message = require('../models/messages.model');

/**
 * @desc   Create a new message
 * @route  POST /api/messages/send
 * @access Public
 */
exports.createMessage = async (req, res) => {
  try {
    const { subject, email, message } = req.body;

    // Basic validation
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const newMessage = await Message.create({
      subject,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error('Create message error:', error);

    // Handle mongoose validation errors nicely
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Failed to create message',
    });
  }
};

/**
 * @desc   Get all messages
 * @route  GET /api/messages
 * @access Admin (or Public if you want)
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      message: 'Failed to fetch messages',
    });
  }
};

//delete message by id
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }   res.status(200).json({ message: 'Message deleted successfully' });  
    } catch (error) {   
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
    }
};