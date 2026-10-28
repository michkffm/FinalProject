import mongoose from 'mongoose';
import Chat from './models/Chat.js';
import { CHAT_PAGE_SIZE, MESSAGE_PAGE_SIZE } from './chatLimits.js';

const objectId = value => new mongoose.Types.ObjectId(value);
const validId = value => typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value);
export const incomingUnread = userId => ({ $and: [
  { $ne: ['$$message.sender', objectId(userId)] }, { $ne: ['$$message.read', true] },
] });

export function messageCursor(message) {
  return Buffer.from(JSON.stringify({ date: new Date(message.createdAt).toISOString(), id: String(message._id) })).toString('base64url');
}

export function chatCursor(chat) {
  return Buffer.from(JSON.stringify({ date: new Date(chat.updatedAt).toISOString(), id: String(chat._id) })).toString('base64url');
}

export async function listChats(userId, { jobId, cursor } = {}) {
  const match = { participants: objectId(userId), ...(jobId ? { jobId: objectId(jobId) } : {}) };
  if (cursor) {
    try {
      const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString());
      if (!validId(decoded.id) || typeof decoded.date !== 'string' || !Number.isFinite(Date.parse(decoded.date))) throw new Error();
      const date = new Date(decoded.date);
      match.$or = [{ updatedAt: { $lt: date } }, { updatedAt: date, _id: { $lt: objectId(decoded.id) } }];
    } catch { const error = new Error('Ungültiger Seitenzeiger'); error.status = 400; throw error; }
  }
  const rows = await Chat.aggregate([
    { $match: match }, { $sort: { updatedAt: -1, _id: -1 } }, { $limit: CHAT_PAGE_SIZE + 1 },
    { $project: { jobId: 1, participants: 1, updatedAt: 1,
      totalMessages: { $size: '$messages' },
      unreadCount: { $size: { $filter: { input: '$messages', as: 'message', cond: incomingUnread(userId) } } },
    } },
    { $lookup: { from: Chat.collection.name, let: { chatId: '$_id' }, pipeline: [
      { $match: { $expr: { $eq: ['$_id', '$$chatId'] } } },
      { $unwind: '$messages' }, { $sort: { 'messages.createdAt': -1, 'messages._id': -1 } },
      { $limit: MESSAGE_PAGE_SIZE }, { $replaceRoot: { newRoot: '$messages' } },
    ], as: 'messages' } },
    { $addFields: { messages: { $reverseArray: '$messages' } } },
  ]);
  const hasMore = rows.length > CHAT_PAGE_SIZE;
  const data = rows.slice(0, CHAT_PAGE_SIZE).map(chat => ({ ...chat,
    hasMoreMessages: chat.totalMessages > MESSAGE_PAGE_SIZE,
    before: chat.totalMessages > MESSAGE_PAGE_SIZE ? messageCursor(chat.messages[0]) : null,
  }));
  const nextCursor = hasMore ? chatCursor(data[data.length - 1]) : null;
  await Chat.populate(data, [ { path: 'participants', select: 'username' }, { path: 'messages.sender', select: 'username' }, { path: 'jobId', select: 'title' } ]);
  return { data, nextCursor };
}

export async function messageWindow(userId, chatId, before) {
  const match = { _id: objectId(chatId), participants: objectId(userId) };
  if (!await Chat.exists(match)) return null;
  let olderMatch;
  if (before) {
    try {
      const decoded = JSON.parse(Buffer.from(before, 'base64url').toString());
      if (!validId(decoded.id) || typeof decoded.date !== 'string' || !Number.isFinite(Date.parse(decoded.date))) throw new Error();
      const date = new Date(decoded.date);
      olderMatch = { $match: { $or: [ { 'messages.createdAt': { $lt: date } },
        { 'messages.createdAt': date, 'messages._id': { $lt: objectId(decoded.id) } } ] } };
    } catch { const error = new Error('Ungültiger Seitenzeiger'); error.status = 400; throw error; }
  }
  const rows = await Chat.aggregate([
    { $match: match }, { $unwind: '$messages' }, ...(olderMatch ? [olderMatch] : []),
    { $sort: { 'messages.createdAt': -1, 'messages._id': -1 } },
    { $limit: MESSAGE_PAGE_SIZE + 1 }, { $replaceRoot: { newRoot: '$messages' } },
  ]);
  const hasMore = rows.length > MESSAGE_PAGE_SIZE;
  const messages = rows.slice(0, MESSAGE_PAGE_SIZE).reverse();
  return { messages, hasMore, before: hasMore ? messageCursor(messages[0]) : null };
}
