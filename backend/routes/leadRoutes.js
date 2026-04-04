const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.post('/leads', leadController.createLead);
router.get('/leads', leadController.getLeads);

module.exports = router;
