const express = require("express");
const { logData, upload } = require("../controllers/logController");
const router = express.Router();

router.post("/log-parser", upload.single("file"), logData);

module.exports = router;
