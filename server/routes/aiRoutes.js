const express = require("express")
const router = express.Router();
const aiController=require("../controllers/aiController")

const { protect } = require('../middlewares/authMiddleware');

router.post('/generate-email', protect, aiController.generateEmail);
router.get('/history', protect, aiController.getHistory);
router.get('/history/:id', protect, aiController.getHistoryById);
module.exports=router