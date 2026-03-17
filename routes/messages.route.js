const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  deleteMessage
} = require('../controller/messages.controller');

router.post('/send', createMessage);
router.get('/', getMessages);
router.delete('/:id',deleteMessage);


module.exports = router; 
