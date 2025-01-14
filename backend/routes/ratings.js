

app.get("/ratings/:jobId", authMiddleware, async (req, res) => {
    const { jobId } = req.params;
  
    try {
      const ratings = await Rating.find({ jobId })
      .populate("senderId", "username")
      .sort({ createdAt: 1 });
  
      res.status(200).json(ratings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ratings", details: error.message });
    }
  });
  
  app.post("/ratings", authMiddleware, async (req, res) => {
    const { jobId, rating, content } = req.body;
    const senderId = req.user.userId;
  
    if (!jobId || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const newRating = new Rating({ jobId, senderId, rating, content });
      await newRating.save();
  
      res.status(201).json({ message: "Rating added successfully", newRating });
    } catch (error) {
      res.status(500).json({ error: "Failed to add rating", details: error.message });
    }
  });
  
  app.delete('/ratings/:id',authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const rating = await Rating.findByIdAndDelete(id);
        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }
        if (rating.senderId.toString() !== userId) {
          return res.status(403).json({ error: "Keine Berechtigung, diese Bewertung zu löschen." });
        }
        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete rating' });
    }
  });