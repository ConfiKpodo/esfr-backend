const {authenticate}= require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const express = require('express');
const router = express.Router();
const storageController = require('../controller/storage.controller');
const storageUpload = require("../middleware/storageUpload");

router.post('/create', authenticate,storageUpload.array("images", 5), storageController.createStorage);
router.get('/getStorage', authenticate, storageController.getAllStorage);
router.put('/update/:id', authenticate,storageUpload.array('images', 5), storageController.updateStorage);
router.delete('/delete/:id', authenticate, storageController.deleteStorage);  
router.get('/getByUser/:identifier', authenticate, storageController.getStorageByUser); 
module.exports = router;