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
import { Resend } from "resend";
import crypto from "crypto";
import { pathToFileURL } from "node:url";
import Contact from "./models/Contact.js";

const { ObjectId } = mongoose.Types;



const app = express();
const port = process.env.PORT || 3000;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.disable("x-powered-by");
app.use(cors({ origin: frontendUrl }));

app.use(express.json({ limit: "100kb" }));

const profileFields = ["role", "profession", "location", "description", "profilePhoto"];
const allowedCategories = Job.schema.path("category").enumValues;
const jobFields = ["title", "description", "category", "price", "location", "contact"];
const pick = (body, fields) => Object.fromEntries(fields.filter((key) => Object.hasOwn(body, key)).map((key) => [key, body[key]]));
const validPassword = (value) => typeof value === "string" && value.length >= 8 && Buffer.byteLength(value) <= 72 && /[!@#$%^&*(),.?":{}|<>]/.test(value);
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
      .status(500)
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

    res.status(500).json({ error: "Job konnte nicht veröffentlicht werden" });
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
    res.status(500).json({ error: "Job konnte nicht aktualisiert werden" });
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
      .status(500)
      .json({ error: "Benutzer konnte nicht aktualisiert werden" });
  }
});

app.delete("/users/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  if (id !== userId) return res.status(403).json({ error: "Keine Berechtigung" });
  try {
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

  if (!jobId || !rating) {
    return res.status(400).json({ error: "Alle Felder sind Pflichtfelder" });
  }

  try {
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
app.post("/chats/:chatId/reply", authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  try {
    const chat = await Chat.findOne({ _id: chatId, participants: req.user.userId });
    if (!chat) {
      return res.status(404).json({ error: "Chat nicht gefunden" });
    }

    // Erstelle eine neue Antwort
    const reply = {
      sender: req.user.userId, // oder ein anderes Feld für den Absender
      content,
      timestamp: new Date(),
    };

    chat.messages.push(reply); // Füge die Antwort zum Chat hinzu
    await chat.save();

    res.status(201).json({ message: "Antwort erfolgreich gesendet" });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Senden der Antwort" });
  }
});

app.post("/chats", authMiddleware, async (req, res) => {
  const { jobId, message } = req.body;
  const senderId = req.user.userId;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job nicht gefunden" });
    }
    const recipientId = job.createdBy;
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

    res
      .status(500)
      .json({
        error: "Nachricht konnte nicht gesendet werden",
      });
  }
});

app.get("/chats", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const chats = await Chat.find({ participants: { $in: [userId] } })
      .populate("participants", "username") // Nur den Benutzernamen der Teilnehmer
      .populate("messages.sender", "username") // Nur den Benutzernamen des Senders
      .populate("jobId", "title") // Nur den Titel des Jobs
      .sort({ updatedAt: -1 }) // Zuletzt aktualisierte Chats zuerst
      .lean(); // Gibt ein einfaches JavaScript-Objekt zurück, um Änderungen vorzunehmen
    // Berechnung der ungelesenen Nachrichten für den aktuellen Benutzer
    const chatsWithUnreadCount = chats.map((chat) => {
      const unreadCount = chat.messages.filter(
        (msg) => !msg.read && msg.sender?._id.toString() !== userId // Ungelesene Nachrichten, nicht vom Benutzer gesendet
      ).length;
      return {
        ...chat, // Alle vorhandenen Chat-Daten
        unreadCount, // Neues Feld für ungelesene Nachrichten
      };
    });
    res.status(200).json({
      success: true,
      data: chatsWithUnreadCount,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      error: "Fehler beim Abrufen der Chats",
    });
  }
});

app.get("/chats/job/:jobId", authMiddleware, async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.userId;

  try {
    const chats = await Chat.find({
      jobId,
      participants: { $in: [userId] },
    })
      .populate("participants", "username")
      .populate("messages.sender", "username")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Chats konnten nicht abgerufen werden.",
      });
  }
});

app.patch(
  "/chats/:chatId/messages/:messageId",
  authMiddleware,
  async (req, res) => {
    const { chatId, messageId } = req.params;

    try {
      const chat = await Chat.findOne({ _id: chatId, participants: req.user.userId });

      if (!chat) {
        return res.status(404).json({ error: "Chat nicht gefunden" });
      }

      const message = chat.messages.id(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message nicht gefunden" });
      }

      if (message.sender.toString() === req.user.userId) return res.status(403).json({ error: "Nur empfangene Nachrichten können als gelesen markiert werden" });
      message.read = true;
      await chat.save();

      res.status(200).json({ success: true, message });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Nachricht konnte nicht aktualisiert werden",
        });
    }
  }
);

app.delete("/chats/:chatId", authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.userId;
  // Überprüfe, ob die chatId eine gültige ObjectId ist
  if (!ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Ungültige chatId" });
  }
  try {
    // Wandelt chatId in ObjectId um, um sicherzustellen, dass sie korrekt behandelt wird
    const chat = await Chat.findOne({
      _id: new ObjectId(chatId),
      participants: { $in: [userId] },
    });
    if (!chat) {
      return res
        .status(404)
        .json({ error: "Chat nicht gefunden oder Zugriff verweigert" });
    }
    // Lösche den Chat
    await Chat.findByIdAndDelete(chatId);
    res
      .status(200)
      .json({ success: true, message: "Chat erfolgreich gelöscht" });
  } catch (error) {

    res
      .status(500)
      .json({ error: "Fehler beim Löschen des Chats", });
  }
});

app.delete(
  "/chats/:chatId/messages/:messageId",
  authMiddleware,
  async (req, res) => {
    const { chatId, messageId } = req.params;
    const userId = req.user.userId;

    try {
      const chat = await Chat.findOne({
        _id: chatId,
        participants: { $in: [userId] },
      });

      if (!chat) {
        return res
          .status(404)
          .json({ error: "Chat nicht gefunden oder Zugriff verweigert" });
      }

      const message = chat.messages.id(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message nicht gefunden" });
      }

      if (message.sender.toString() !== userId) {
        return res
          .status(403)
          .json({ error: "Sie können nur Ihre eigenen Nachrichten löschen" });
      }

      chat.messages.pull(messageId);
      await chat.save();

      res
        .status(200)
        .json({ success: true, message: "Nachricht erfolgreich gelöscht" });
    } catch (error) {

      res
        .status(500)
        .json({
          error: "Nachricht konnte nicht gelöscht werden",
        });
    }
  }
);

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!validEmail(email)) {
    return res.status(400).json({ error: "E-Mail ist erforderlich." });
  }
  try {
    if (!resend || !process.env.RESEND_EMAIL) return res.status(503).json({ error: "Mailversand ist nicht konfiguriert." });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "Falls ein Konto existiert, wurde eine E-Mail angefordert." });

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = Date.now() + 1000 * 60 * 60 * 24; // Token gültig für 24 Stunden
    user.resetPasswordToken = tokenHash(resetPasswordToken);
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    const { error } = await resend.emails.send({
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
            <p style="margin: 0;">© 2025 EasyHelfer. Alle Rechte vorbehalten.</p>
          </footer>
        </div>
      `,
    });
    if (error) {
      return res.status(502).json({ error: "Mailversand fehlgeschlagen." });
    }

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
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich." });
    }

    const newContact = new Contact({
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({ message: "Nachricht erfolgreich gesendet!" });
  } catch (error) {

    res
      .status(500)
      .json({ error: "Es gab einen Fehler beim Senden der Nachricht." });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  res.status(status).json({ error: status < 500 ? "Ungültige Anfrage" : "Interner Serverfehler" });
});

export { app };
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.env.DB_URI || !process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY.length < 32) throw new Error("DB_URI und ein JWT_SECRET_KEY mit mindestens 32 Zeichen sind erforderlich.");
  await mongoose.connect(process.env.DB_URI);
  app.listen(port, () => console.log(`Server läuft auf Port ${port}`));
}

