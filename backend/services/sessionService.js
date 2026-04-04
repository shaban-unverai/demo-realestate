// In-memory session store (replace with Redis for production)
const sessions = {};

function getSession(userId) {
  if (!sessions[userId]) {
    sessions[userId] = {
      step: 0,
      data: {},
    };
  }
  return sessions[userId];
}

function updateSession(userId, update) {
  sessions[userId] = { ...getSession(userId), ...update };
}

function clearSession(userId) {
  delete sessions[userId];
}

module.exports = { getSession, updateSession, clearSession };
