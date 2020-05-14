const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed.controller')

router.post('/', feedController.addFeed)
router.get('/', feedController.getAllFeed)
router.get('/:id', feedController.getFodderFeed)
router.get('/:id', feedController.getPeetFeed)

module.exports = router;
