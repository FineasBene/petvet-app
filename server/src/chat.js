const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId:   { type: Number, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, default: 'owner' },
  text:       { type: String, required: true },
  room:       { type: String, default: 'general' },
  timestamp:  { type: Date,   default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

let mongoConnected = false;

async function connectMongo() {
  const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/petvet';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    mongoConnected = true;
    console.log('MongoDB connected:', uri);
  } catch (e) {
    console.warn('MongoDB unavailable – chat history disabled:', e.message);
  }
}

function setupChat(io, sessionMiddleware) {
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  io.on('connection', async (socket) => {
    const sess = socket.request.session;
    if (!sess?.userId) { socket.disconnect(); return; }

    const { userId, userName, userRole } = sess;

    if (mongoConnected) {
      try {
        const msgs = await Message.find({ room: 'general' })
          .sort({ timestamp: -1 }).limit(50).lean();
        socket.emit('history', msgs.reverse());
      } catch {}
    } else {
      socket.emit('history', []);
    }

    socket.broadcast.emit('system', `${userName} s-a alăturat chat-ului`);

    socket.on('message', async (text) => {
      if (!text?.trim()) return;
      const msg = {
        senderId: userId,
        senderName: userName,
        senderRole: userRole,
        text: text.trim().slice(0, 500),
        room: 'general',
        timestamp: new Date()
      };
      if (mongoConnected) {
        try { await Message.create(msg); } catch {}
      }
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('system', `${userName} a ieșit din chat`);
    });
  });
}

module.exports = { connectMongo, setupChat, Message };
