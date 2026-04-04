const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  property_id: { type: String, required: true, unique: true },
  title: String,
  location: String,
  property_type: String,
  bedrooms: Number,
  bathrooms: Number,
  area_sqft: Number,
  price_aed: Number,
  status: String,
  nearest_school: String,
  nearest_hospital: String,
  features: [String],
  agent_name: String,
  agent_contact: String
});

module.exports = mongoose.model('Property', PropertySchema);