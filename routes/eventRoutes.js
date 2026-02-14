const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/capture-email', eventController.captureEmail);

// New OTP routes (public)
router.post('/verify-otp', eventController.verifyOTP);
router.post('/resend-otp', eventController.resendOTP);

// Protected admin routes
router.post('/:id/import', protect, eventController.importEvent);
router.patch('/:id/status', protect, eventController.updateEventStatus);
router.get('/admin/stats', protect, eventController.getDashboardStats);

module.exports = router;