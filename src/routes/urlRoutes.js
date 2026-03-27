const express = require("express");
const router = express.Router();
const {
    shortenUrl,
    redirectUrl
} = require("../controllers/urlController");
const { getAnalytics } = require("../controllers/analyticsController");

router.get("/analytics/:code", getAnalytics);
router.post("/shorten", shortenUrl);
router.get("/:code", redirectUrl);

module.exports = router;