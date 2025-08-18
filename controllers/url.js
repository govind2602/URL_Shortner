const { nanoid } = require('nanoid');
const Url = require('../models/url');

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'Url is required' });

    const shortId = nanoid();
    const doc = await Url.create({
        shortId,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id
    });

    console.log("Inserted doc:", doc);
    return res.status(201).json({ shortId });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId });
    if (!result) return res.status(404).json({ error: "Short URL not found" });

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
};
