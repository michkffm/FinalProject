import express from "express";
import mongoose from "mongoose";
import User from './models/User.js'
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

app.post("/jobs", async (req, res) => {
  const { title, description, category, price, location, contact} = req.body;

  if (!category || !contact || location) {
      return res.status(400).json({ error: 'Invalid login' });
  }

  try {
      

  } catch (error) {
      res.status(500).json({ error: error.message });
  }

})

app.get('/jobs', async (req, res) => {
  try {
      const jobs = await Job.find().sort({ createdAt: -1 }); // -1 for descending order, 1 for ascending
      res.status(200).json(jobs);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
