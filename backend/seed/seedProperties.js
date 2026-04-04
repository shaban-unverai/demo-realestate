const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config({ path: '../.env' });

const LOCATIONS = [
  'Dubai Marina', 'JVC', 'Downtown Dubai', 'Business Bay', 'Palm Jumeirah',
  'Dubai Hills', 'JLT', 'International City', 'Arabian Ranches', 'Mirdif'
];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse'];
const STATUS = ['Ready', 'Off-plan'];
const FEATURES = [
  'Sea view', 'ROI 8%', 'Near Metro', 'Furnished', 'Pool', 'Gym', 'ROI 10%',
  'Balcony', 'Parking', 'ROI 12%', 'Smart Home', 'Garden', 'ROI 7%'
];
const AGENTS = [
  { name: 'Ayesha Khan', contact: '+971500000001' },
  { name: 'Omar Al Farsi', contact: '+971500000002' },
  { name: 'Priya Mehra', contact: '+971500000003' },
  { name: 'James Smith', contact: '+971500000004' },
  { name: 'Fatima Noor', contact: '+971500000005' }
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomFeatures() {
  const count = Math.floor(Math.random() * 3) + 2;
  return Array.from({ length: count }, () => randomFrom(FEATURES));
}

async function seedProperties() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Property.deleteMany({});
  const properties = [];
  for (let i = 1; i <= 150; i++) {
    const location = randomFrom(LOCATIONS);
    const property_type = randomFrom(PROPERTY_TYPES);
    const status = randomFrom(STATUS);
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const bathrooms = bedrooms + (Math.random() > 0.5 ? 1 : 0);
    const area_sqft = 500 + bedrooms * 400 + Math.floor(Math.random() * 500);
    let price_aed = 300000 + bedrooms * 400000 + Math.floor(Math.random() * 500000);
    if (location === 'Downtown Dubai') price_aed += 1000000;
    if (property_type === 'Penthouse') price_aed += 2000000;
    const agent = randomFrom(AGENTS);
    properties.push({
      property_id: `PROP${i.toString().padStart(4, '0')}`,
      title: `${bedrooms}BR ${property_type} in ${location}`,
      location,
      property_type,
      bedrooms,
      bathrooms,
      area_sqft,
      price_aed,
      status,
      nearest_school: `${location} School`,
      nearest_hospital: `${location} Hospital`,
      features: randomFeatures(),
      agent_name: agent.name,
      agent_contact: agent.contact
    });
  }
  await Property.insertMany(properties);
  console.log('Seeded 150 properties');
  mongoose.disconnect();
}

seedProperties();
