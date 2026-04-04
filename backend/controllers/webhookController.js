const { getSession, updateSession, clearSession } = require('../services/sessionService');
const { generateAIReply } = require('../services/aiService');
const { matchProperties } = require('./propertyController');
const Lead = require('../models/Lead');
const { calculateLeadScore, assignAgent } = require('../services/leadService');
const Property = require('../models/Property');
const { sendMessage, receiveMessage } = require('../services/whatsappService');

// WhatsApp conversation steps
const steps = [
  { key: 'intent', question: 'Hi! Are you looking to buy, rent, or invest in Dubai property?' },
  { key: 'budget', question: 'What is your budget in AED?' },
  { key: 'location', question: 'Preferred location in Dubai?' },
  { key: 'property_type', question: 'What type of property? (Apartment, Villa, Off-plan)' },
  { key: 'bedrooms', question: 'How many bedrooms do you need?' },
  { key: 'timeline', question: 'What is your timeline? (immediate / 3 months / exploring)' },
];

// POST /webhook
exports.handleWebhook = async (req, res) => {
  try {
    // Extract WhatsApp message from Twilio
    const { body, from } = receiveMessage(req);
    if (!from || !body) return res.status(400).json({ reply: 'Invalid request', matches: [], lead: {} });
    const session = getSession(from);
    let step = session.step;
    let data = session.data;
    // Save answer from previous step
    if (step > 0) {
      const prevKey = steps[step - 1].key;
      data[prevKey] = body.trim();
    }
    // If all steps collected, process lead
    if (step >= steps.length) {
      // Special follow-ups
      if (data.intent === 'invest' && !data.roi) {
        data.roi = body.trim();
        // Ask ROI
        updateSession(from, { step, data });
        await sendMessage(from, 'What ROI are you expecting?');
        return res.sendStatus(200);
      }
      if (data.intent === 'buy' && !data.family_size) {
        data.family_size = body.trim();
        // Ask family size
        updateSession(from, { step, data });
        await sendMessage(from, 'How many people in your family?');
        return res.sendStatus(200);
      }
      // All info collected, match properties
      const properties = await Property.find({});
      const matches = matchProperties(data, properties);
      // Save lead
      const { score, classification } = calculateLeadScore(data);
      const assigned_agent = assignAgent(data, classification);
      const lead = new Lead({ ...data, lead_score: score, assigned_agent });
      await lead.save();
      clearSession(from);
      let reply = '';
      if (classification === 'HOT') reply = 'Perfect 👌 I’ll connect you with a specialist right away';
      else if (classification === 'WARM') reply = 'I’ll share some great options with you shortly 👍';
      else reply = 'No worries, I can keep you updated 😊';
      // Send matches as WhatsApp messages
      if (matches.length > 0) {
        for (const prop of matches) {
          await sendMessage(from, `${prop.title}\n${prop.bedrooms}BR | ${prop.area_sqft} sqft | ${prop.price_aed} AED\n${prop.features.join(', ')}\nAgent: ${prop.agent_name}`);
        }
      }
      await sendMessage(from, reply);
      return res.sendStatus(200);
    }
    // Ask next question
    const nextQ = steps[step].question;
    updateSession(from, { step: step + 1, data });
    await sendMessage(from, nextQ);
    return res.sendStatus(200);
  } catch (err) {
    await sendMessage(receiveMessage(req).from, 'Error processing request. Please try again.');
    return res.status(500).json({ reply: 'Error processing request', matches: [], lead: {}, error: err.message });
  }
};
