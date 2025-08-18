const router = require('express').Router();
const handlers = require('../controllers/url');



const { handleGenerateNewShortUrl, handleGetAnalytics } = handlers;

router.post('/', handleGenerateNewShortUrl);
router.get('/analytics/:shortId', handleGetAnalytics);

module.exports = router;
