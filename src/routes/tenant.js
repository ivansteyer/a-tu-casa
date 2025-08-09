const express=require('express'); const router=express.Router(); const t=require('../controllers/tenantController');
const multer=require('multer'); const path=require('path'); const upload=multer({ dest:path.join(__dirname,'../../uploads') });
router.get('/dashboard', t.ensureAuth, t.dashboard);
router.get('/onboarding/step1', t.ensureAuth, t.getStep1); router.post('/onboarding/step1', t.ensureAuth, t.postStep1);
router.get('/onboarding/step2', t.ensureAuth, t.getStep2); router.post('/onboarding/step2', t.ensureAuth, t.postStep2);
router.get('/onboarding/step3', t.ensureAuth, t.getStep3); router.post('/onboarding/step3', t.ensureAuth, upload.fields([{name:'idDoc',maxCount:1},{name:'lastPayslip',maxCount:1},{name:'workContract',maxCount:1},{name:'cv',maxCount:1},{name:'selfie',maxCount:1}]), t.postStep3);
router.get('/onboarding/done', t.ensureAuth, t.done); module.exports=router;
