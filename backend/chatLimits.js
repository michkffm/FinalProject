import { consumeLimit } from './middlewares/rateLimit.js';

export const MAX_CHAT_MESSAGES = 500;
export const MESSAGE_PAGE_SIZE = 20;
export const CHAT_PAGE_SIZE = 10;
export const SENDER_MESSAGES_PER_MINUTE = 30;
export const RECIPIENT_MESSAGES_PER_MINUTE = 60;

export async function allowChatSend(senderId, recipientId, res) {
  const retryAfter = await consumeLimit('chat-sender', senderId, SENDER_MESSAGES_PER_MINUTE, 60000) ||
    await consumeLimit('chat-recipient', recipientId, RECIPIENT_MESSAGES_PER_MINUTE, 60000);
  if (!retryAfter) return true;
  res.set('Retry-After', String(retryAfter));
  res.status(429).json({ error: 'Zu viele Nachrichten. Bitte warte kurz und versuche es erneut.' });
  return false;
}
