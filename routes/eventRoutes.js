const express = require('express');
const {
  getAllEvents,
  getEvent,
  captureEmail,
  importEvent,
  updateEventStatus,
  getDashboardStats
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.post('/capture-email', captureEmail);

// Admin routes (protected)
router.post('/:id/import', protect, importEvent);
router.patch('/:id/status', protect, updateEventStatus);
router.get('/admin/stats', protect, getDashboardStats);

module.exports = router;