const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  venue: {
    name: String,
    address: String
  },
  city: {
    type: String,
    required: true,
    default: 'Sydney'
  },
  category: {
    type: String,
    default: 'General'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Event'
  },
  sourceWebsite: {
    type: String,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'updated', 'inactive', 'imported'],
    default: 'new'
  },
  lastScraped: {
    type: Date,
    default: Date.now
  },
  imported: {
    status: {
      type: Boolean,
      default: false
    },
    importedAt: Date,
    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    importNotes: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
eventSchema.index({ dateTime: 1, city: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);