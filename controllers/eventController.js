const Event = require('../models/Event');
const EmailCapture = require('../models/EmailCapture');

// Get all events (public)
exports.getAllEvents = async (req, res) => {
  try {
    const { city, search, category, startDate, endDate, status } = req.query;
    
    const query = {};
    
    // Filters
    if (city) query.city = city;
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Date range
    if (startDate || endDate) {
      query.dateTime = {};
      if (startDate) query.dateTime.$gte = new Date(startDate);
      if (endDate) query.dateTime.$lte = new Date(endDate);
    }
    
    // Only show active events on public page
    if (!status) {
      query.status = { $in: ['new', 'updated'] };
    }
    
    const events = await Event.find(query)
      .sort({ dateTime: 1 })
      .limit(100);
    
    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Capture email for event (public)
exports.captureEmail = async (req, res) => {
  try {
    const { email, consent, eventId } = req.body;
    
    if (!email || !eventId || consent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Email, consent, and eventId are required'
      });
    }
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await EmailCapture.create({
      email,
      consent,
      event: eventId,
      eventTitle: event.title
    });
    
    res.json({
      success: true,
      message: 'Email captured successfully',
      redirectUrl: event.originalUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error capturing email',
      error: error.message
    });
  }
};

// Import event to platform (admin only)
exports.importEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    event.status = 'imported';
    event.imported = {
      status: true,
      importedAt: new Date(),
      importedBy: req.user._id,
      importNotes: notes || ''
    };
    
    await event.save();
    
    res.json({
      success: true,
      message: 'Event imported successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error importing event',
      error: error.message
    });
  }
};

// Update event status (admin only)
exports.updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'updated', 'inactive', 'imported'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const event = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event status updated',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Get dashboard statistics (admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const newEvents = await Event.countDocuments({ status: 'new' });
    const updatedEvents = await Event.countDocuments({ status: 'updated' });
    const inactiveEvents = await Event.countDocuments({ status: 'inactive' });
    const importedEvents = await Event.countDocuments({ status: 'imported' });
    const totalEmails = await EmailCapture.countDocuments();
    
    res.json({
      success: true,
      stats: {
        totalEvents,
        newEvents,
        updatedEvents,
        inactiveEvents,
        importedEvents,
        totalEmails
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};