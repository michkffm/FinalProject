



// neue Job erstellen
app.post("/jobs", authMiddleware, async (req, res) => {
    const { title, description, category, price, location, contact } = req.body;
    const userId = req.user.userId;
  
    try {
      const job = new Job({ title, description, category, price, location, contact, createdBy: userId });
      await job.save();
  
      const addUsername = await Job.findById(job._id).populate('createdBy', 'username');
  
      const testPopulate = await Job.findById(job._id).populate('createdBy');
  
      console.log(testPopulate.createdBy);
  
      res.status(201).json({ message: "Job posted successfully", job: addUsername });
  
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: "Failed to post job" });
    }
  
  })
  
  app.get('/jobs', async (req, res) => {
    const { category } = req.query;
  
    const allowedCategories = [
      "Beratung",
      "Bildung und Schulung",
      "Betreuung und Gesundheit",
      "Finanzen und Versicherungen",
      "Technologie und IT",
      "Reparatur und Wartung",
      "Transport und Logistik",
      "Reinigung und Pflege",
      "Bau- und Renovierungsdienste",
      "Freizeit und Unterhaltung"
    ];
  
    try {
      let query = {};
  
      
      if (category && allowedCategories.includes(category)) {
        query = { category };
      }
  
      const jobs = await Job.find(query).sort({ createdAt: -1 });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });
  app.get('/search/jobs', async (req, res) => {
    const { category, query, price, location } = req.query;
    app.delete('/jobs/:id', async (req, res) => {
      const { id } = req.params;
    
      try {
          const job = await Job.findByIdAndDelete(id);
    
          if (!job) {
              return res.status(404).json({ error: 'Job not found' });
          }
    
          res.status(200).json({ message: 'Job deleted successfully' });
      } catch (error) {
          res.status(500).json({ error: 'Failed to delete job' });
      }
    });
    const allowedCategories = [
      "Beratung",
      "Bildung und Schulung",
      "Betreuung und Gesundheit",
      "Finanzen und Versicherungen",
      "Technologie und IT",
      "Reparatur und Wartung",
      "Transport und Logistik",
      "Reinigung und Pflege",
      "Bau- und Renovierungsdienste",
      "Freizeit und Unterhaltung"
    ];
  
    try {
      let filter = {};
  
      // Filter nach Kategorie, wenn angegeben
      if (category && allowedCategories.includes(category)) {
        filter.category = category;
      }
  
      // Filter nach Suchbegriff (Titel oder Beschreibung)
      if (query) {
        const regex = new RegExp(query, 'i');
        filter.$or = [
          { title: { $regex: regex } },
          { description: { $regex: regex } }
        ];
      }
  
      // Filter nach Preis, wenn angegeben
      if (price) {
        const priceRange = price.split('-'); // Beispiel: '50-200'
        if (priceRange.length === 2) {
          filter.price = { $gte: parseInt(priceRange[0]), $lte: parseInt(priceRange[1]) };
        }
      }
  
      // Filter nach Standort, wenn angegeben
      if (location) {
        filter.location = { $regex: new RegExp(location, 'i') };  // Case insensitive Suche
      }
  
      const jobs = await Job.find(filter).sort({ createdAt: -1 });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search jobs', details: error.message });
    }
  });
  
  
  app.delete('/jobs/:id',authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.createdBy.toString() !== userId) {
          return res.status(403).json({ error: "Keine Berechtigung, diesen Job zu löschen." });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete job' });
    }
  });
  
  app.put('/jobs/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
  
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
  
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
    }
  });