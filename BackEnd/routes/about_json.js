const express = require('express');
const router = express.Router();
const about_json = require('../controllers/about_jsonController');

router.get('/about.json', about_json.getAboutJson);

module.exports = router;