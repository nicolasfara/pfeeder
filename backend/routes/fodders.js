const express = require('express');
const router = express.Router();
const fodderController = require('../controller/fodder.controller')

router.post('/', fodderController.addFodder)
router.get('/', fodderController.getAllFodder)
router.get('/:id', fodderController.getFodder)


module.exports = router;
