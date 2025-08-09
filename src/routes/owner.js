const express=require('express'); const router=express.Router(); const c=require('../controllers/propertyController'); const o=require('../controllers/ownerController');
router.get('/owner/dashboard', o.dashboard); router.get('/owner/properties', c.ownerList); router.get('/owner/properties/new', c.getNew);
router.post('/owner/properties', c.postNew); router.get('/owner/properties/:id/candidates', c.candidates);
router.post('/owner/properties/:id/like/:userId', c.ownerLikeTenant); module.exports=router;
