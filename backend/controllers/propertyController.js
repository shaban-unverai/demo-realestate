// Property matching function
function matchProperties(user, properties) {
  return properties
    .map(property => {
      let score = 0;
      if (property.price_aed <= user.budget) score += 3;
      if (property.location.toLowerCase() === user.location.toLowerCase()) score += 3;
      if (property.property_type.toLowerCase() === user.property_type.toLowerCase()) score += 2;
      if (user.bedrooms && property.bedrooms >= user.bedrooms) score += 1;
      if (user.intent === 'invest' && (property.features || []).join(' ').toLowerCase().includes('roi')) score += 2;
      if (user.intent === 'buy' && property.status === 'Ready') score += 2;
      return { ...property, match_score: score };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 3);
}

// POST /match-properties (Supabase)
exports.matchProperties = async (req, res) => {
  try {
    const user = req.body;
    const supabase = req.app.get('supabase');
    const { data: properties, error } = await supabase.from('properties').select('*');
    if (error) throw error;
    const matches = matchProperties(user, properties);
    res.json({ success: true, matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { matchProperties };
