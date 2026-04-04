const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true },
  intent: String,
  budget: Number,
  location: String,
  property_type: String,
  bedrooms: Number,
  timeline: String,
  notes: String,
  lead_score: Number,
  assigned_agent: String
});

module.exports = mongoose.model('Lead', LeadSchema);