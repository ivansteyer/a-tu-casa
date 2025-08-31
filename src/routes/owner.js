// routes/owner.js
// routes/owner.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const ownerController = require('../controllers/ownerController');
const propertyController = require('../controllers/propertyController');
const { ensureAuth, ensureRole } = require('../middlewares/auth');

// Config de uploads
const uploadOwner = multer({ dest: path.join(__dirname, '../../uploads/owners') });
const uploadProperty = multer({ dest: path.join(__dirname, '../../uploads/properties') });

// Middleware compuesto: autenticado + rol owner
const onlyOwner = [ensureAuth, ensureRole('owner')];

/**
 * Owner pages
 */
router.get('/owner/dashboard',           onlyOwner, ownerController.dashboard);

router.get('/owner/preferences',         onlyOwner, ownerController.getPreferences);
router.post('/owner/preferences',        onlyOwner, ownerController.postPreferences);

/**
 * Propiedades del owner
 */
router.get('/owner/properties',                  onlyOwner, propertyController.ownerList);
router.get('/owner/properties/new',              onlyOwner, propertyController.getNew);
router.post('/owner/properties/new',             onlyOwner, uploadProperty.array('photos'), propertyController.postNew);

router.get('/owner/properties/:id/edit',         onlyOwner, propertyController.getEdit);
router.put('/owner/properties/:id',              onlyOwner, uploadProperty.array('photos'), propertyController.update);
router.delete('/owner/properties/:id',           onlyOwner, propertyController.remove);

router.get('/owner/properties/:id/candidates',   onlyOwner, propertyController.candidates);
router.post('/owner/properties/:id/like/:userId',onlyOwner, propertyController.ownerLikeTenant);

module.exports = router;