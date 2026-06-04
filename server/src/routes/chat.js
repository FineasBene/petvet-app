const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { Message } = require('../chat');

// GET /api/chat/messages — last 50 messages (REST fallback)
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const msgs = await Message.find({ room: 'general' })
      .sort({ timestamp: -1 }).limit(50).lean();
    res.json(msgs.reverse());
  } catch {
    res.json([]);
  }
});

module.exports = router;
