const { calculateLeadScore, assignAgent } = require('../services/leadService');

// POST /leads - Create new lead (Supabase)
exports.createLead = async (req, res) => {
  try {
    const data = req.body;
    const { score, classification } = calculateLeadScore(data);
    const assigned_agent = assignAgent(data, classification);
    const leadData = {
      ...data,
      lead_score: score,
      assigned_agent,
      notes: data.notes || '',
    };
    const supabase = req.app.get('supabase');
    const { data: lead, error } = await supabase.from('leads').insert([leadData]).select('*').single();
    if (error) throw error;
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /leads - Get all leads (Supabase)
exports.getLeads = async (req, res) => {
  try {
    const supabase = req.app.get('supabase');
    const { data: leads, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
