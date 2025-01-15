


app.post('/chats', authMiddleware, async (req, res) => {
    const { recipientId, message } = req.body;
    const senderId = req.user.userId;
    try {
      let chat = await Chat.findOne({
        participants: { $all: [senderId, recipientId] },
      });
      if (!chat) {
        chat = new Chat({
          participants: [senderId, recipientId],
          messages: [{ content: message, sender: senderId }],
        });
      } else {
        chat.messages.push({ content: message, sender: senderId });
      }
      await chat.save();
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
  });
  app.get('/chats', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    try {
      const chats = await Chat.find({
        participants: { $in: [userId] },
      }).populate('participants', 'username')
        .sort({ updatedAt: -1 });
      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chats', details: error.message });
    }
  });
  app.get('/chats/:chatId', async (req, res) => {
    const { chatId } = req.params;
    try {
      const chat = await Chat.findById(chatId)
        .populate('messages.sender', 'username')
        .populate('participants', 'username');
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat', details: error.message });
    }
  });