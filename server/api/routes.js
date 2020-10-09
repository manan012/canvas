const router = require('express').Router();
const download = require('../controllers/download');


router.get('/send' ,download.download);
router.post('/file', download.sendFile);

module.exports = router;