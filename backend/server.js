import express from "express";
import mongoose from "mongoose";
import User from './models/User.js';
import Job from './models/Job.js';
import Rating from './models/Rating.js';
import Chat from './models/Chat.js';
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middlewares/authMiddleware.js";
import { Resend } from "resend";
import crypto from "crypto";

await mongoose.connect(process.env.DB_URI);

const app = express();
const port = process.env.PORT
const resend = new Resend("re_KyqmAF3D_85kbs7wN1vf1iNrVuM85NEyL");


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

app.post('/chats', authMiddleware, async (req, res) => {
  const { recipientId, message, jobId } = req.body;
  const senderId = req.user.userId;

  try {
    let chat = await Chat.findOne({
      jobId,
      participants: { $all: [senderId, recipientId] },
    });

    if (!chat) {
      chat = new Chat({
        jobId,
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

app.get('/chats/job/:jobId', authMiddleware, async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.userId;

  try {
    const chats = await Chat.find({
      jobId,
      participants: { $in: [userId] },
    })
      .populate('participants', 'username') 
      .populate('messages.sender', 'username') 
      .sort({ updatedAt: -1 }); 

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats', details: error.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-Mail ist erforderlich." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden." });
    }
    console.log(user);
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 1000 * 60 * 60 * 24; // Token gültig für 24 Stunden
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Passwort zurücksetzen",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #2d3e50; text-align: center; font-size: 24px; font-weight: 600; margin-bottom: 20px;">
            Passwort zurücksetzen
          </h1>
          <p style="color: #333333; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Sie haben beantragt, Ihr Passwort zurückzusetzen. Bitte klicken Sie auf die Schaltfläche unten, um Ihr Passwort zurückzusetzen:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/passwort-reset/${resetPasswordToken}" 
              style="background-color: #4CAF50; color: white; padding: 14px 32px; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 8px; display: inline-block; transition: background-color 0.3s;">
              Passwort zurücksetzen
            </a>
          </div>
          <p style="color: #555555; font-size: 14px; line-height: 1.4; text-align: center;">
            Wenn Sie kein neues Passwort angefordert haben, ignorieren Sie bitte diese E-Mail.
          </p>
          <footer style="text-align: center; font-size: 12px; color: #999999; margin-top: 40px;">
            <p style="margin: 0;">© 2024 EasyHelfer. Alle Rechte vorbehalten.</p>
          </footer>
        </div>
      `,
    });
    
    res.status(200).json({
      message: "E-Mail zum Zurücksetzen des Passworts wurde gesendet.",
    });
  } catch (error) {
    console.error("Fehler beim Zurücksetzen des Passworts:", error);
    res.status(500).json({
      error:
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    });
  }
});
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Passwort ist erforderlich." });
  }
  try {
    // Überprüfen, ob der Token existiert und nicht abgelaufen ist
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token muss noch gültig sein
    });
    if (!user) {
      return res.status(400).json({ error: "Ungültiger oder abgelaufener Token." });
    }
    // Neues Passwort setzen
    user.password = await bcrypt.hash(password, 10); // Passwort-Hashing
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Passwort erfolgreich zurückgesetzt." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});
app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token muss gültig sein
    });
    if (!user) {
      return res.status(400).json({ error: "Ungültiger oder abgelaufener Token." });
    }
    res.status(200).json({ message: "Token ist gültig" });
  } catch (error) {
    console.error("Error in getResetPasswordPage:", error.message);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});


app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
