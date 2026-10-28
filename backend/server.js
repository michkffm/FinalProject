import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Rating from "./models/Rating.js";
import Chat from "./models/Chat.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./middlewares/authMiddleware.js";
import { mail } from "./mail.js";
import crypto from "crypto";
import { pathToFileURL } from "node:url";
import Contact from "./models/Contact.js";
import { connectDatabase } from "./database.js";
import { rateLimit } from "./middlewares/rateLimit.js";
import { allowChatSend, MAX_CHAT_MESSAGES } from './chatLimits.js';
import { listChats, messageWindow, incomingUnread } from './chatQueries.js';

const { ObjectId } = mongoose.Types;



const app = express();
const port = process.env.PORT || 3000;


const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.disable("x-powered-by");
app.use(cors({ origin: frontendUrl }));

app.use(express.json({ limit: "100kb" }));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Cache-Control', 'no-store');
  if (!process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY.length < 32) {
    return res.status(503).json({ error: 'Server ist nicht konfiguriert.' });
  }
  connectDatabase().then(() => next()).catch(() => {
    res.status(503).json({ error: 'Datenbank ist vorübergehend nicht verfügbar.' });
  });
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/login', rateLimit('login', 30));
app.use('/register', rateLimit('register', 10));
app.use('/forgot-password', rateLimit('reset', 5));
app.use('/contact', rateLimit('contact', 5));

const profileFields = ["role", "profession", "location", "description", "profilePhoto"];
const allowedCategories = Job.schema.path("category").enumValues;
const jobFields = ["title", "description", "category", "price", "location", "contact"];
const pick = (body, fields) => Object.fromEntries(fields.filter((key) => Object.hasOwn(body, key)).map((key) => [key, body[key]]));
const validPassword = (value) => typeof value === "string" && value.length >= 8 && Buffer.byteLength(value) <= 72 && /[!@#$%^&*(),.?":{}|<>]/.test(value);
const validId = value => typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);
const inputStatus = error => ["ValidationError", "CastError"].includes(error.name) ? 400 : 500;
const validEmail = (value) => typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const tokenHash = (value) => crypto.createHash("sha256").update(value).digest("hex");

for (const name of ["id", "jobId", "chatId", "messageId"]) {
  app.param(name, (req, res, next, value) => {
    if (!/^[a-f0-9]{24}$/i.test(value)) return res.status(400).json({ error: "Ungültige ID" });
    next();
  });
}
// Reject structured values before they can become MongoDB query operators.
app.use((req, res, next) => {
  if (req.body && (Array.isArray(req.body) || typeof req.body !== "object")) return res.status(400).json({ error: "Ungültige Eingabe" });
  for (const [key, value] of Object.entries(req.body || {})) {
    if (key === 'messageIds' && req.method === 'PATCH' && /^\/chats\/[a-f0-9]{24}\/read$/i.test(req.path) && Array.isArray(value) && value.length <= 20 && value.every(validId)) continue;
    if (key === "role" && Array.isArray(value) && value.every((item) => typeof item === "string")) continue;
    if (!["string", "number", "boolean"].includes(typeof value) && value !== null) return res.status(400).json({ error: "Ungültige Eingabe" });
  }
  if (Object.values(req.query).some((value) => typeof value !== "string" || value.length > 200)) return res.status(400).json({ error: "Ungültige Suchanfrage" });
  next();
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!validEmail(email) || typeof username !== "string" || !username.trim() || username.length > 100 || typeof password !== "string") {
    return res.status(400).json({ error: "Ungültige Registrierung" });
  }

  if (!validPassword(password)) return res.status(400).json({ error: "Passwort: mindestens 8 Zeichen, ein Sonderzeichen und höchstens 72 UTF-8-Bytes." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 500).json({ error: "Anfrage konnte nicht verarbeitet werden" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!validEmail(email) || typeof password !== "string" || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ error: "Ungültige Anmeldung" });
  }

  try {
    const user = await User.findOne({ email }).select("+password +tokenVersion");
    if (!user) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Ungültige Anmeldedaten" });
    }

    const payload = { userId: user._id.toString(), tokenVersion: user.tokenVersion };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d", algorithm: "HS256" });
    res.json({ user: user, token: token });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 500).json({ error: "Anfrage konnte nicht verarbeitet werden" });
  }
});

app.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    await User.updateOne({ _id: req.user.userId }, { $inc: { tokenVersion: 1 } });
    res.status(200).json({ message: "Alle Sitzungen beendet" });
  } catch (error) { next(error); }
});

app.patch("/users/profile", authMiddleware, async (req, res) => {
  const { role, profession, location, description, profilePhoto } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ error: "Benutzer nicht authentifiziert" });
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
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    res
      .status(200)
      .json({ message: "Profil erfolgreich aktualisiert", updatedUser });
  } catch (error) {
    res
      .status(inputStatus(error))
      .json({
        error: "Profil konnte nicht aktualisiert werden",
      });
  }
});

app.get("/users/profile", authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ error: "Benutzer nicht authentifiziert" });
  }

  try {
    const user = await User.findById(userId).select(
      "username email role profession location description profilePhoto"
    );

    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Benutzerprofil konnte nicht abgerufen werden",
      });
  }
});

// neue Job erstellen
app.post("/jobs", authMiddleware, async (req, res) => {
  const { title, description, category, price, location, contact, username } =
    req.body;
  const userId = req.user.userId;

  try {
    const job = new Job({
      title,
      description,
      category,
      price,
      location,
      contact,
      username,
      createdBy: userId,
    });
    await job.save();

    const addUsername = await Job.findById(job._id).populate(
      "createdBy",
      "username"
    );

    res
      .status(201)
      .json({ message: "Job erfolgreich ausgeschrieben", job: addUsername });
  } catch (error) {

    res.status(inputStatus(error)).json({ error: "Job konnte nicht veröffentlicht werden. Bitte Eingaben prüfen." });
  }
});

app.get("/jobs", async (req, res) => {
  const { category } = req.query;



  try {
    let query = {};

    if (category && allowedCategories.includes(category)) {
      query = { category };
    }

    const jobs = await Job.find(query)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Abrufen der Aufträge fehlgeschlagen" });
  }
});
app.get("/search/jobs", async (req, res) => {
  const { category, query, price, location } = req.query;


  try {
    let filter = {};

    // Filter nach Kategorie, wenn angegeben
    if (category && allowedCategories.includes(category)) {
      filter.category = category;
    }

    // Filter nach Suchbegriff (Titel oder Beschreibung)
    if (query) {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
      ];
    }

    if (price) {
      const range = /^(\d+(?:\.\d{1,2})?)-(\d+(?:\.\d{1,2})?)$/.exec(price);
      if (!range || Number(range[1]) > Number(range[2])) return res.status(400).json({ error: "Ungültiger Preisbereich" });
      // Existing documents store prices as strings; compare numerically without a data migration.
      const amount = { $convert: { input: "$price", to: "double", onError: null, onNull: null } };
      filter.$expr = { $and: [{ $gte: [amount, Number(range[1])] }, { $lte: [amount, Number(range[2])] }] };
    }

    // Filter nach Standort, wenn angegeben
    if (location) {
      filter.location = { $regex: new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }; // Case insensitive Suche
    }

    const jobs = await Job.find(filter).populate("createdBy", "username").sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Suche nach Jobs fehlgeschlagen",
      });
  }
});

app.delete("/jobs/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });
    if (!job) {
      return res.status(404).json({ error: "Job nicht gefunden" });
    }
    await Promise.all([Rating.deleteMany({ jobId: id }), Chat.deleteMany({ jobId: id })]);
    res.status(200).json({ message: "Job erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ error: "Löschen des Auftrags fehlgeschlagen" });
  }
});

app.put("/jobs/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findOneAndUpdate({ _id: id, createdBy: req.user.userId }, { $set: pick(req.body, jobFields) }, { new: true, runValidators: true });

    if (!job) {
      return res.status(404).json({ error: "Job nicht gefunden" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(inputStatus(error)).json({ error: "Job konnte nicht aktualisiert werden. Bitte Eingaben prüfen." });
  }
});

app.get("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("username role profession location description profilePhoto");

    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Benutzer konnte nicht abgerufen werden" });
  }
});

app.patch("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  if (id !== req.user.userId) return res.status(403).json({ error: "Keine Berechtigung" });
  const updates = pick(req.body, profileFields);

  try {
    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(inputStatus(error))
      .json({ error: "Benutzer konnte nicht aktualisiert werden" });
  }
});

app.delete("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  if (id !== userId) return res.status(403).json({ error: "Keine Berechtigung" });
  try {
    const ownJobs = await Job.find({ createdBy: userId }).select("_id");
    const jobIds = ownJobs.map(job => job._id);
    await Promise.all([
      Rating.deleteMany({ $or: [{ senderId: userId }, { jobId: { $in: jobIds } }] }),
      Chat.deleteMany({ $or: [{ participants: userId }, { jobId: { $in: jobIds } }] }),
    ]);
    await Job.deleteMany({ createdBy: userId });
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
    res
      .status(200)
      .json({
        message:
          "Benutzer und alle zugehörigen Jobs wurden erfolgreich gelöscht",
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Fehler beim Löschen des Benutzers und der Jobs" });
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
    res
      .status(500)
      .json({
        error: "Bewertungen konnten nicht abgerufen werden",
      });
  }
});

app.post("/ratings", authMiddleware, async (req, res) => {
  const { jobId, rating, content } = req.body;
  const senderId = req.user.userId;

  if (!validId(jobId) || !Number.isInteger(rating) || rating < 1 || rating > 5 || (content !== undefined && (typeof content !== "string" || content.length > 2000))) {
    return res.status(400).json({ error: "Alle Felder sind Pflichtfelder" });
  }

  try {
    if (!await Job.exists({ _id: jobId })) return res.status(404).json({ error: "Job nicht gefunden" });
    const newRating = new Rating({ jobId, senderId, rating, content });
    await newRating.save();

    res
      .status(201)
      .json({ message: "Bewertung erfolgreich hinzugefügt", newRating });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Bewertung konnte nicht hinzugefügt werden",
      });
  }
});

app.delete("/ratings/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const rating = await Rating.findOneAndDelete({ _id: id, senderId: userId });
    if (!rating) {
      return res.status(404).json({ error: "Rating nicht gefunden" });
    }
    res.status(200).json({ message: "Bewertung erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ error: "Bewertung konnte nicht gelöscht werden" });
  }
});
async function appendChatMessage(chatId, userId, content) {
  return Chat.findOneAndUpdate({ _id: chatId, participants: userId,
    [`messages.${MAX_CHAT_MESSAGES - 1}`]: { $exists: false },
  }, { $push: { messages: { content, sender: userId, createdAt: new Date(), read: false } } },
  { new: true, runValidators: true, projection: { messages: { $slice: -1 }, participants: 1, jobId: 1 } });
}

app.post('/chats/:chatId/reply', authMiddleware, async (req, res, next) => {
  const { content } = req.body;
  if (typeof content !== 'string' || !content.trim() || content.length > 5000) return res.status(400).json({ error: 'Bitte eine Nachricht mit höchstens 5000 Zeichen eingeben.' });
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, participants: req.user.userId }).select('_id participants');
    if (!chat) return res.status(404).json({ error: 'Chat nicht gefunden' });
    const recipient = chat.participants.find(id => String(id) !== req.user.userId) || req.user.userId;
    if (!await allowChatSend(req.user.userId, String(recipient), res)) return;
    if (!await appendChatMessage(chat._id, req.user.userId, content)) return res.status(409).json({ error: 'Diese Unterhaltung ist voll oder nicht mehr verfügbar. Es wurden keine Nachrichten entfernt.' });
    res.status(201).json({ message: 'Antwort erfolgreich gesendet' });
  } catch (error) { next(error); }
});

app.post('/chats', authMiddleware, async (req, res, next) => {
  const { jobId, message } = req.body;
  if (!validId(jobId) || typeof message !== 'string' || !message.trim() || message.length > 5000) return res.status(400).json({ error: 'Ungültige Nachricht oder Job-ID' });
  const senderId = req.user.userId;
  try {
    const job = await Job.findById(jobId).select('createdBy');
    if (!job) return res.status(404).json({ error: 'Job nicht gefunden' });
    if (!await allowChatSend(senderId, String(job.createdBy), res)) return;
    let chat = await Chat.findOne({ jobId, participants: { $all: [senderId, job.createdBy] } }).select('_id');
    if (!chat) {
      // Stable identity prevents parallel first messages from creating duplicate chats.
      const participants = [...new Set([senderId, String(job.createdBy)])].sort();
      const id = crypto.createHash('sha256').update(`${job._id}:${participants.join(':')}`).digest('hex').slice(0, 24);
      try {
        chat = await Chat.findOneAndUpdate({ _id: id }, { $setOnInsert: { jobId, participants, messages: [] } }, { upsert: true, new: true, projection: { _id: 1 } });
      } catch (error) {
        if (error.code !== 11000) throw error;
        chat = { _id: id };
      }
    }
    const updated = await appendChatMessage(chat._id, senderId, message);
    if (!updated) return res.status(409).json({ error: 'Diese Unterhaltung ist voll oder nicht mehr verfügbar. Es wurden keine Nachrichten entfernt.' });
    res.status(200).json(updated);
  } catch (error) { next(error); }
});

app.get('/chats/unread', authMiddleware, async (req, res, next) => {
  try {
    const rows = await Chat.aggregate([
      { $match: { participants: new ObjectId(req.user.userId) } },
      { $project: { count: { $size: { $filter: { input: '$messages', as: 'message', cond: incomingUnread(req.user.userId) } } } } },
      { $group: { _id: null, unreadCount: { $sum: '$count' } } },
    ]);
    res.json({ unreadCount: rows[0]?.unreadCount || 0 });
  } catch (error) { next(error); }
});
app.get('/chats', authMiddleware, async (req, res, next) => {
  try { res.json({ success: true, ...await listChats(req.user.userId, { cursor: req.query.cursor }) }); }
  catch (error) { next(error); }
});
app.get('/chats/job/:jobId', authMiddleware, async (req, res, next) => {
  try {
    const page = await listChats(req.user.userId, { jobId: req.params.jobId, cursor: req.query.cursor });
    if (page.nextCursor) res.set('X-Next-Cursor', page.nextCursor);
    res.json(page.data);
  } catch (error) { next(error); }
});
app.get('/chats/:chatId/messages', authMiddleware, async (req, res, next) => {
  try {
    const page = await messageWindow(req.user.userId, req.params.chatId, req.query.before);
    if (!page) return res.status(404).json({ error: 'Chat nicht gefunden' });
    await Chat.populate(page.messages, { path: 'sender', model: 'User', select: 'username' });
    res.json(page);
  } catch (error) { next(error); }
});
app.patch('/chats/:chatId/read', authMiddleware, async (req, res, next) => {
  const ids = req.body?.messageIds;
  if (!Array.isArray(ids) || !ids.length || ids.length > 20 || !ids.every(validId)) return res.status(400).json({ error: 'Ungültige Nachrichtenauswahl' });
  try {
    const result = await Chat.updateOne({ _id: req.params.chatId, participants: req.user.userId },
      { $set: { 'messages.$[message].read': true } },
      { arrayFilters: [{ 'message._id': { $in: ids.map(id => new ObjectId(id)) }, 'message.sender': { $ne: new ObjectId(req.user.userId) } }], timestamps: false });
    if (!result.matchedCount) return res.status(404).json({ error: 'Chat nicht gefunden' });
    res.json({ success: true });
  } catch (error) { next(error); }
});

app.patch('/chats/:chatId/messages/:messageId', authMiddleware, async (req, res, next) => {
  const { chatId, messageId } = req.params;
  try {
    const chat = await Chat.findOne({ _id: chatId, participants: req.user.userId },
      { messages: { $elemMatch: { _id: new ObjectId(messageId) } } });
    if (!chat || !chat.messages.length) return res.status(404).json({ error: 'Nachricht nicht gefunden' });
    const message = chat.messages[0];
    if (String(message.sender) === req.user.userId) return res.status(403).json({ error: 'Nur empfangene Nachrichten können als gelesen markiert werden' });
    const result = await Chat.updateOne({ _id: chatId, participants: req.user.userId, 'messages._id': messageId },
      { $set: { 'messages.$.read': true } }, { timestamps: false });
    if (!result.matchedCount) return res.status(404).json({ error: 'Nachricht nicht gefunden' });
    message.read = true;
    res.json({ success: true, message });
  } catch (error) { next(error); }
});
app.delete('/chats/:chatId', authMiddleware, async (req, res, next) => {
  try {
    const deleted = await Chat.findOneAndDelete({ _id: req.params.chatId, participants: req.user.userId }, { projection: { _id: 1 } });
    if (!deleted) return res.status(404).json({ error: 'Chat nicht gefunden oder Zugriff verweigert' });
    res.json({ success: true, message: 'Chat erfolgreich gelöscht' });
  } catch (error) { next(error); }
});
app.delete('/chats/:chatId/messages/:messageId', authMiddleware, async (req, res, next) => {
  const { chatId, messageId } = req.params;
  try {
    const chat = await Chat.findOne({ _id: chatId, participants: req.user.userId },
      { messages: { $elemMatch: { _id: new ObjectId(messageId) } } });
    if (!chat || !chat.messages.length) return res.status(404).json({ error: 'Nachricht nicht gefunden' });
    if (String(chat.messages[0].sender) !== req.user.userId) return res.status(403).json({ error: 'Sie können nur Ihre eigenen Nachrichten löschen' });
    await Chat.updateOne({ _id: chatId, participants: req.user.userId },
      { $pull: { messages: { _id: messageId, sender: req.user.userId } } });
    res.json({ success: true, message: 'Nachricht erfolgreich gelöscht' });
  } catch (error) { next(error); }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!validEmail(email)) {
    return res.status(400).json({ error: "E-Mail ist erforderlich." });
  }
  try {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_EMAIL) return res.status(503).json({ error: "Mailversand ist nicht konfiguriert." });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "Falls ein Konto existiert, wurde eine E-Mail angefordert." });

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 1000 * 60 * 60 * 24; // Token gültig für 24 Stunden
    user.resetPasswordToken = tokenHash(resetPasswordToken);
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    await mail.send({
      from: process.env.RESEND_EMAIL,
      to: user.email,
      subject: "Passwort zurücksetzen",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #2d3e50; text-align: center; font-size: 24px; font-weight: 600; margin-bottom: 20px;">
            Passwort zurücksetzen
          </h1>
          <p style="color: #333333; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 20px;">
            Du hast beantragt, Dein Passwort zurückzusetzen. Bitte klicke  auf die Schaltfläche unten, um Dein Passwort zurückzusetzen:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/passwort-reset/${resetPasswordToken}"
              style="background-color: #4CAF50; color: white; padding: 14px 32px; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 8px; display: inline-block; transition: background-color 0.3s;">
              Passwort zurücksetzen
            </a>
          </div>
          <p style="color: #555555; font-size: 14px; line-height: 1.4; text-align: center;">
            Wenn Du kein neues Passwort angefordert hast, ignoriere bitte diese E-Mail.
          </p>
          <footer style="text-align: center; font-size: 12px; color: #999999; margin-top: 40px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} EasyHelfer. Alle Rechte vorbehalten.</p>
          </footer>
        </div>
      `,
    });

    res
      .status(200)
      .json({
        message: "Falls ein Konto existiert, wurde eine E-Mail angefordert.",
      });
  } catch (error) {

    res.status(500).json({
      error:
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    });
  }
});
app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!validPassword(password)) {
    return res.status(400).json({ error: "Passwort ist erforderlich." });
  }
  try {
    // Überprüfen, ob der Token existiert und nicht abgelaufen ist
    const resetQuery = { resetPasswordToken: tokenHash(token), resetPasswordExpires: { $gt: Date.now() } };
    if (!await User.exists(resetQuery)) return res.status(400).json({ error: "Ungültiger oder abgelaufener Token." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate({
      resetPasswordToken: tokenHash(token), resetPasswordExpires: { $gt: Date.now() },
    }, { $set: { password: hashedPassword }, $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 }, $inc: { tokenVersion: 1 } });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Ungültiger oder abgelaufener Token." });
    }
    res.status(200).json({ message: "Passwort erfolgreich zurückgesetzt." });
  } catch (error) {

    res.status(500).json({ error: "Interner Serverfehler" });
  }
});
app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: tokenHash(token),
      resetPasswordExpires: { $gt: Date.now() }, // Token muss gültig sein
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Ungültiger oder abgelaufener Token." });
    }
    res.status(200).json({ message: "Token ist gültig" });
  } catch (error) {

    res.status(500).json({ error: "Interner Serverfehler" });
  }
});
app.post("/contact", async (req, res) => {
  const { email, subject, message } = req.body;
  if (!validEmail(email) || typeof subject !== 'string' || !subject.trim() || subject.length > 120 || typeof message !== 'string' || !message.trim() || message.length > 5000) {
    return res.status(400).json({ error: 'Bitte E-Mail, Betreff und Nachricht gültig ausfüllen.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_EMAIL || !validEmail(process.env.CONTACT_EMAIL)) {
    return res.status(503).json({ error: 'Mailversand ist nicht konfiguriert.' });
  }
  try {
    await mail.send({
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[EasyHelfer] ${subject.trim().replace(/[\r\n]/g, ' ')}`,
      text: `Absender: ${email}\n\n${message.trim()}`,
    });
  } catch {
    return res.status(502).json({ error: 'Mailversand fehlgeschlagen. Bitte später erneut versuchen.' });
  }
  try {
    await Contact.create({ email, subject: subject.trim(), message: message.trim() });
    res.status(201).json({ message: 'Nachricht erfolgreich gesendet!' });
  } catch {
    // Delivery already succeeded; do not prompt duplicate sends on a storage failure.
    console.error('Kontaktmail zugestellt, Speicherung fehlgeschlagen.');
    res.status(201).json({ message: 'Nachricht erfolgreich gesendet!' });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  res.status(status).json({ error: status < 500 ? "Ungültige Anfrage" : "Interner Serverfehler" });
});

export { app };
export default app;
if (process.env.VERCEL !== "1" && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.env.DB_URI || !process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY.length < 32) throw new Error("DB_URI und ein JWT_SECRET_KEY mit mindestens 32 Zeichen sind erforderlich.");
  await connectDatabase();
  app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
}

