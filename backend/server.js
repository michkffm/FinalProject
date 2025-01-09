import express from "express";
import mongoose from "mongoose";
import User from './models/User.js';
import Job from './models/Job.js';
import Rating from './models/Rating.js';
import Message from './models/Message.js';
// import Chat from './models/Chat.js';
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middlewares/authMiddleware.js";

await mongoose.connect(process.env.DB_URI);

const app = express();
const port = process.env.PORT


app.use(cors())

app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!email || !password || !username) {
      return res.status(400).json({error: 'Invalid registration'});
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      })
  
  
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({error: error.message})
    }
    
  })

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid login' });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

        res.json({ user: user, token: token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

app.patch("/users/profile", authMiddleware, async (req, res) => {
  const { role, profession, location, description, profilePhoto } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const updateData = {
      role,
      profession,
      location,
      description,
      profilePhoto,
    };

    // Update user document by ID
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validations are run
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
});


app.get("/users/profile", authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const user = await User.findById(userId).select(
      "username email role profession location description profilePhoto"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
  }
});


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



// alle Anzeigen sortieren

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

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
      const user = await User.findByIdAndUpdate(id, updates, { new: true });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const user = await User.findByIdAndDelete(id);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get("/ratings/:jobId", authMiddleware, async (req, res) => {
  const { jobId } = req.params;

  try {
    const ratings = await Rating.find({ jobId })
    .populate("userId", "username")
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

app.delete('/ratings/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const rating = await Rating.findByIdAndDelete(id);

      if (!rating) {
          return res.status(404).json({ error: 'Rating not found' });
      }

      res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete rating' });
  }
});

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

app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
