const express=require('express'); const router=express.Router(); const t=require('../controllers/tenantController');
const multer=require('multer'); const path=require('path'); const upload=multer({ dest:path.join(__dirname,'../../uploads') });
router.use(t.ensureAuth);
router.get('/dashboard', t.dashboard);
router.get('/onboarding/step1', t.getStep1); router.post('/onboarding/step1', t.postStep1);
router.get('/onboarding/step2', t.getStep2); router.post('/onboarding/step2', t.postStep2);
router.get('/onboarding/step3', t.getStep3); router.post('/onboarding/step3', upload.fields([{name:'idDoc',maxCount:1},{name:'lastPayslip',maxCount:1},{name:'workContract',maxCount:1},{name:'cv',maxCount:1},{name:'selfie',maxCount:1}]), t.postStep3);
router.get('/onboarding/done', t.done); module.exports=router;
