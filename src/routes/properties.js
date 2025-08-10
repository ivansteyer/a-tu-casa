const express = require("express");
const router = express.Router();
const c = require("../controllers/propertyController");
router.get("/properties", c.list);
router.get("/properties/:id", c.detail);
router.post("/properties/:id/like", c.like);
router.get("/my/matches", c.matchesForTenant);
module.exports = router;
