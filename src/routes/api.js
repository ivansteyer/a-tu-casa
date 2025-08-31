const express = require("express");
const path = require("path");
const router = express.Router();
const t = require("../controllers/tenantController");

// 👇 usa ruta absoluta resuelta, evitando problemas de resolución
const { onlyTenant } = require(path.resolve(__dirname, "..", "middlewares", "auth.js"));

// Endpoints AJAX para like / reject
router.post("/matches/:propertyId/like", onlyTenant, t.likeProperty);
router.post("/matches/:propertyId/reject", onlyTenant, t.rejectProperty);

module.exports = router;