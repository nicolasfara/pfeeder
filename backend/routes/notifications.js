const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.controller')

router.post('/', notificationController.addNotification)
router.get('/:id', notificationController.getUserNotification)

module.exports = router;
