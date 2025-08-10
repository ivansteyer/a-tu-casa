const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const propertyController = require('../controllers/propertyController');
const ownerController = require('../controllers/ownerController');

const uploadOwner = multer({ dest: path.join(__dirname, '../../uploads/owners') });
const uploadProperty = multer({ dest: path.join(__dirname, '../../uploads/properties') });

router.get('/owner/dashboard', ownerController.dashboard);
router.get('/owner/profile', ownerController.getProfile);
router.post('/owner/profile', uploadOwner.single('fotoPerfil'), ownerController.postProfile);
router.get('/owner/preferences', ownerController.getPreferences);
router.post('/owner/preferences', ownerController.postPreferences);
router.get('/owner/properties', propertyController.ownerList);
router.get('/owner/properties/new', propertyController.getNew);
router.post('/owner/properties/new', uploadProperty.array('fotos'), propertyController.postNew);
router.get('/owner/properties/:id/edit', propertyController.getEdit);
router.put('/owner/properties/:id', uploadProperty.array('fotos'), propertyController.update);
router.delete('/owner/properties/:id', propertyController.remove);
router.get('/owner/properties/:id/candidates', propertyController.candidates);
router.post('/owner/properties/:id/like/:userId', propertyController.ownerLikeTenant);

module.exports = router;
