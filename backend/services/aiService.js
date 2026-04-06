const axios = require('axios');

const HUGGINGFACE_KEY = process.env.HUGGINGFACE_KEY;
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-large'; // Example model

async function generateAIReply(messages) {
  // messages: [{role: 'system'|'user'|'assistant', content: string}]
  try {
    // Concatenate messages for prompt
    const prompt = messages.map(m => m.content).join('\n');
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // HuggingFace returns array of generated_text
    const result = response.data && response.data[0]?.generated_text;
    return (result || 'Sorry, I had trouble replying.').trim();
  } catch (err) {
    console.error('HuggingFace API error:', err.response?.data || err.message);
    return 'Sorry, I had trouble replying. Can you repeat?';
  }
}

module.exports = { generateAIReply };
