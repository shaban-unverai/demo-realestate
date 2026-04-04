const Lead = require('../models/Lead');
const { calculateLeadScore, assignAgent } = require('../services/leadService');

// POST /leads - Create new lead
exports.createLead = async (req, res) => {
  try {
    const data = req.body;
    // Calculate lead score and classification
    const { score, classification } = calculateLeadScore(data);
    // Assign agent
    const assigned_agent = assignAgent(data, classification);
    const lead = new Lead({
      ...data,
      lead_score: score,
      assigned_agent,
      notes: data.notes || '',
    });
    await lead.save();
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /leads - Get all leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ _id: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
