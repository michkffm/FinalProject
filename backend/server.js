import express from "express";
import mongoose from "mongoose";
import User from './models/User.js'
import Job from './models/Job.js'
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

await mongoose.connect(process.env.DB_URI);

const app = express();
const port = process.env.PORT


app.use(cors())

app.use(express.json());

app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
  
    if (!email || !password || !username || !role) {
      return res.status(400).json({error: 'Invalid registration'});
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role
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
// neue Job erstellen
app.post("/jobs", async (req, res) => {
  const { title, description, category, price, location, contact, createdBy} = req.body;
  const userId = req.params.id;

  try {
    const job = new Job({ title, description, category, price, location, contact, createdBy: userId });
    await job.save();
    res.status(201).json({ message: "Job posted successfully" });

  } catch (error) {
      res.status(500).json({ error: "Failed to post job" });
  }

})
// alle Anzeigen sortieren 
app.get('/jobs', async (req, res) => {
  try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.status(200).json(jobs);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

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

app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
