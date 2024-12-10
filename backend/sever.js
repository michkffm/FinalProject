import express from "express";
import mongoose from "mongoose";
import User from './models/User.js'
import cors from 'cors';

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
    //   const verificationToken = crypto.randomBytes(32).toString("hex");
      
  
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

app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
