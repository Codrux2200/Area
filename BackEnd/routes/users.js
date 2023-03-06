const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', userController.login)
router.get('/user', admin, userController.getusers)
router.post('/user', upload.none(), userController.newuser)
router.delete('/user', admin, userController.delAlluser)
router.get('/user/:id', protect, userController.getuser)
router.put('/user/:id', protect, userController.moduser)
router.delete('/user/:id', admin, userController.delOneuser)
router.get('/user/:id/service', protect, userController.getservices)
router.put('/user/:id/service', protect, userController.addservice)
router.delete('/user/:id/service', protect, userController.delAllservice)
router.put('/user/:uid/service/:sid/status', protect, userController.updatestate)
router.delete('/user/:uid/service/:sid', protect, userController.delOneservice)
router.get('/user/:id/area', protect, userController.getuserarea)

module.exports = router;
