const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller')

router.post('/', userController.addUser)
router.get('/', userController.getAllUser)
router.get('/:id', userController.getUser)

module.exports = router;
