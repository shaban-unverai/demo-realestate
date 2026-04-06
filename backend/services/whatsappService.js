const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Send WhatsApp message
async function sendMessage(to, message) {
  try {
    await client.messages.create({
      from: `whatsapp:${phoneNumber}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    return true;
  } catch (err) {
    console.error('Twilio send error:', err.message);
    return false;
  }
}

// Extract WhatsApp message from Twilio webhook
function receiveMessage(req) {
  const { Body, From } = req.body;
  return { body: Body, from: From.replace('whatsapp:', '') };
}

module.exports = { sendMessage, receiveMessage };
