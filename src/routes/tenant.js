const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const t = require("../controllers/tenantController");
const { ensureAuth, ensureRole } = require("../middlewares/auth");

// Config de uploads para step3
const upload = multer({ dest: path.join(__dirname, "../../uploads") });

// Middleware compuesto: autenticado + rol tenant
const onlyTenant = [ensureAuth, ensureRole("tenant")];

/**
 * Dashboard del inquilino
 */
router.get("/dashboard", onlyTenant, t.dashboard);

/**
 * Onboarding steps
 */
router.get("/onboarding/step1", onlyTenant, t.getStep1);
router.post("/onboarding/step1", onlyTenant, t.postStep1);

router.get("/onboarding/step2", onlyTenant, t.getStep2);
router.post("/onboarding/step2", onlyTenant, t.postStep2);

router.get("/onboarding/step3", onlyTenant, t.getStep3);
router.post(
  "/onboarding/step3",
  onlyTenant,
  upload.fields([
    { name: "idDoc", maxCount: 1 },
    { name: "lastPayslip", maxCount: 1 },
    { name: "workContract", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  t.postStep3
);

router.get("/onboarding/done", onlyTenant, t.done);


router.get("/finds", onlyTenant, t.getFinds);

module.exports = router;