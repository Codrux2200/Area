const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { protect, admin } = require('../middleware/authMiddleware');

const serviceController = require('../controllers/serviceController');

router.get('/service', protect, serviceController.getAllservice)
router.post('/service', admin, upload.none(), serviceController.newservice)
router.delete('/service', admin, serviceController.delAllservice)
router.get('/service/:id', protect, serviceController.getservice)
router.delete('/service/:id', admin, serviceController.delOneservice)
router.put('/service/:id', admin, serviceController.updateservice)
router.put('/service/:id/action', admin, serviceController.addAction)
router.get('/service/:id/action', protect, serviceController.getActions)
router.delete('/service/:id/action', admin, serviceController.delActions)
router.delete('/service/:sid/action/:aid', admin, serviceController.delOneAction)
router.put('/service/:id/reaction', admin, serviceController.addReaction)
router.get('/service/:id/reaction', protect, serviceController.getReactions)
router.delete('/service/:id/reaction', admin, serviceController.delReactions)
router.delete('/service/:sid/reaction/:rid', admin, serviceController.delOneReaction)

module.exports = router;
