const express = require('express');
const files = require('./services/files');

const router = express.Router();


router.get('/api', files.findInFile);
router.post('/api/upload', files.uploadFile);


router.get('/upload', files.uploadView);
router.get('/search', files.searchView);


module.exports = router;