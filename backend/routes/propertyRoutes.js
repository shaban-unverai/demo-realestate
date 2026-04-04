const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.post('/match-properties', propertyController.matchProperties);

module.exports = router;
