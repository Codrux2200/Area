const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const reactionController =  require('../controllers/reactionController');

router.post('/reaction', admin, reactionController.newReaction)
router.get('/reaction', protect, reactionController.getAllReaction)
router.delete('/reaction', admin, reactionController.deleteAllReaction)
router.get('/reaction/:id', protect, reactionController.getReaction)
router.put('/reaction/:id', admin, reactionController.updateReaction)
router.delete('/reaction/:id', admin, reactionController.deleteReaction)

module.exports = router;