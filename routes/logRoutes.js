const express = require("express");
const router = express.Router();
const LogHelper = require("../models/helpers/logHelper");

router.get("/logs", (req, res) => {
    res.send(LogHelper.toHtml());
});

module.exports = router;