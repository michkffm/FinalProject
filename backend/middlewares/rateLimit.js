import crypto from 'node:crypto';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  count: { type: Number, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
const RequestLimit = mongoose.model('RequestLimit', schema);

// Counters are shared across Vercel instances and independent of chat lifetime.
export async function consumeLimit(scope, identity, maximum, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const hash = crypto.createHmac('sha256', process.env.JWT_SECRET_KEY)
    .update(`${scope}:${identity}:${window}`).digest('hex');
  const expiresAt = new Date((window + 1) * windowMs);
  let counter;
  try {
    counter = await RequestLimit.findOneAndUpdate(
      { _id: hash }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, new: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    counter = await RequestLimit.findOneAndUpdate({ _id: hash }, { $inc: { count: 1 } }, { new: true });
    if (!counter) throw error;
  }
  return counter.count > maximum ? Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)) : 0;
}

export function rateLimit(scope, maximum, windowMs = 15 * 60 * 1000) {
  return async (req, res, next) => {
    try {
      const address = process.env.VERCEL === '1'
        ? req.get('x-vercel-forwarded-for') || req.socket.remoteAddress
        : req.socket.remoteAddress;
      const retryAfter = await consumeLimit(scope, address, maximum, windowMs);
      if (retryAfter) {
        res.set('Retry-After', String(retryAfter));
        return res.status(429).json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
      }
      next();
    } catch (error) { next(error); }
  };
}
