import crypto from 'node:crypto';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  count: { type: Number, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
const RequestLimit = mongoose.model('RequestLimit', schema);

// Shared MongoDB counters also work across concurrent Vercel instances.
export function rateLimit(scope, maximum, windowMs = 15 * 60 * 1000) {
  return async (req, res, next) => {
    try {
      const now = Date.now();
      const window = Math.floor(now / windowMs);
      const address = process.env.VERCEL === '1'
        ? req.get('x-vercel-forwarded-for') || req.socket.remoteAddress
        : req.socket.remoteAddress;
      const hash = crypto.createHmac('sha256', process.env.JWT_SECRET_KEY)
        .update(`${scope}:${address}:${window}`).digest('hex');
      const expiresAt = new Date((window + 1) * windowMs);
      const counter = await RequestLimit.findOneAndUpdate(
        { _id: hash },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
        { upsert: true, new: true },
      );
      if (counter.count > maximum) {
        res.set('Retry-After', String(Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000))));
        return res.status(429).json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
