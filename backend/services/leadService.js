// Lead scoring and agent assignment logic

function calculateLeadScore(data) {
  let score = 0;
  if (data.budget && data.budget > 1000000) score += 3;
  if (data.timeline && data.timeline.toLowerCase().includes('immediate')) score += 3;
  if (data.budget && data.location && data.property_type) score += 2; // clear preferences
  if (data.timeline && data.timeline.toLowerCase().includes('browsing')) score -= 2;

  let classification = 'COLD';
  if (score >= 6) classification = 'HOT';
  else if (score >= 3) classification = 'WARM';

  return { score, classification };
}

function assignAgent(data, classification) {
  if (classification === 'HOT') return 'Senior Agent';
  if (data.intent && data.intent.toLowerCase().includes('invest')) return 'Investment Specialist';
  if (data.location) return `${data.location} Area Specialist`;
  return 'General Agent';
}

module.exports = { calculateLeadScore, assignAgent };
