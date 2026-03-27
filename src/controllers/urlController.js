const {
    createShortUrl,
    getOriginalUrl
} = require("../services/urlService");
const { trackClick } = require("../services/analyticsService");

// POST /shorten
const shortenUrl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const newUrl = await createShortUrl(url);

        res.json({
            shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /:code
const redirectUrl = async (req, res) => {
    try {
        const shortCode = req.params.code;

        const originalUrl = await getOriginalUrl(shortCode);

        if (!originalUrl) {
            return res.status(404).send("URL not found");
        }

        // 🔥 ASYNC ANALYTICS (NON-BLOCKING)
        trackClick({
            shortCode,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        // 🔥 Redirect immediately
        res.redirect(originalUrl);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = {
    shortenUrl,
    redirectUrl
};