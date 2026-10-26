import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Rating from '../models/Rating.js';
import Chat from '../models/Chat.js';

let mongo, server, directory, base, owner, other, third, ownerToken, otherToken, thirdToken, job;
process.env.JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');
delete process.env.RESEND_API_KEY;
const payload = { title: 'Testangebot', description: 'Nur synthetische Testdaten', category: 'Beratung', price: '60', location: 'Testort', contact: 'test@example.invalid' };
async function request(path, method = 'GET', body, token) {
  const response = await fetch(base + path, { method, headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: response.status, data: await response.json() };
}
async function register(name) {
  const result = await request('/register', 'POST', { username: name, email: `${name}@example.invalid`, password: 'Synthetic-Password!' });
  assert.equal(result.status, 201);
  const login = await request('/login', 'POST', { email: `${name}@example.invalid`, password: 'Synthetic-Password!' });
  assert.equal(login.status, 200);
  return [result.data, login.data.token];
}
before(async () => {
  directory = await mkdtemp(join(tmpdir(), 'finalproject-test-'));
  mongo = spawn(process.env.MONGOD_BINARY || 'mongod', ['--dbpath', directory, '--bind_ip', '127.0.0.1', '--port', '0', '--nounixsocket']);
  // MongoDB does not support ephemeral port zero consistently. Read the selected listening port.
  let output = '';
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('MongoDB test startup timed out')), 15000);
    mongo.once('error', error => { clearTimeout(timer); reject(error); });
    mongo.once('exit', code => { clearTimeout(timer); reject(new Error(`MongoDB exited: ${code}`)); });
    mongo.stdout.on('data', chunk => {
      output += chunk.toString();
      const match = output.match(/"msg":"Listening on"[^\n]*"address":"127\.0\.0\.1:(\d+)"/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  await mongoose.connect(`mongodb://127.0.0.1:${port}/finalproject_test`);
  const { app } = await import('../server.js');
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
  [owner, ownerToken] = await register('owner');
  [other, otherToken] = await register('other');
  [third, thirdToken] = await register('third');
  const created = await request('/jobs', 'POST', payload, ownerToken);
  assert.equal(created.status, 201);
  job = created.data.job;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  if (mongo && mongo.exitCode === null) { const exit = once(mongo, 'exit'); mongo.kill('SIGTERM'); await exit; }
  if (directory) await rm(directory, { recursive: true, force: true });
});
test('login returns expiring JWT, no password/reset/version fields', async () => {
  const decoded = jwt.verify(ownerToken, process.env.JWT_SECRET_KEY);
  assert.ok(decoded.exp > decoded.iat);
  assert.ok(decoded.exp - decoded.iat <= 86400);
  for (const key of ['password', 'resetPasswordToken', 'tokenVersion']) assert.equal(owner[key], undefined);
});
test('structured login/registration/query inputs and invalid IDs rejected', async () => {
  assert.equal((await request('/login', 'POST', { email: { $ne: null }, password: 'test' })).status, 400);
  assert.equal((await request('/register', 'POST', { username: [], email: 'test@example.invalid', password: 'Password!' })).status, 400);
  assert.equal((await request('/jobs?category[$ne]=x')).status, 400);
  assert.equal((await request('/users/not-an-id', 'GET', undefined, ownerToken)).status, 400);
});
test('unauthenticated and foreign offer updates cannot change data or ownership', async () => {
  assert.equal((await request(`/jobs/${job._id}`, 'PUT', { title: 'attack' })).status, 401);
  assert.equal((await request(`/jobs/${job._id}`, 'PUT', { title: 'attack', createdBy: other._id }, otherToken)).status, 404);
  const stored = await Job.findById(job._id);
  assert.equal(stored.title, payload.title);
  assert.equal(stored.createdBy.toString(), owner._id);
});
test('owner can update permitted offer fields but cannot transfer ownership', async () => {
  const result = await request(`/jobs/${job._id}`, 'PUT', { title: 'Aktualisiert', createdBy: other._id }, ownerToken);
  assert.equal(result.status, 200);
  assert.equal(result.data.title, 'Aktualisiert');
  assert.equal(result.data.createdBy, owner._id);
});
test('denied offer deletion leaves offer intact, including after search', async () => {
  await request('/search/jobs?query=Test');
  assert.equal((await request(`/jobs/${job._id}`, 'DELETE')).status, 401);
  assert.equal((await request(`/jobs/${job._id}`, 'DELETE', undefined, otherToken)).status, 404);
  assert.ok(await Job.findById(job._id));
});
test('foreign user modification and deletion are forbidden before side effects', async () => {
  assert.equal((await request(`/users/${owner._id}`, 'PATCH', { resetPasswordToken: 'attack', email: 'attack@example.invalid' }, otherToken)).status, 403);
  assert.equal((await request(`/users/${owner._id}`, 'DELETE', undefined, otherToken)).status, 403);
  assert.ok(await User.findById(owner._id));
  assert.ok(await Job.findById(job._id));
});
test('own profile permits expected fields but ignores password/reset mass assignment', async () => {
  assert.equal((await request(`/users/${other._id}`, 'PATCH', { description: 'Profiltest', password: 'attacker', resetPasswordToken: 'attacker' }, otherToken)).status, 200);
  const user = await User.findById(other._id).select('+resetPasswordToken');
  assert.equal(user.description, 'Profiltest');
  assert.equal(user.resetPasswordToken, undefined);
});
test('reset credentials never appear in own/public profiles or serialization', async () => {
  await User.findByIdAndUpdate(owner._id, { resetPasswordToken: 'synthetic-private-reset', resetPasswordExpires: new Date(Date.now() + 60000) });
  const publicProfile = await request(`/users/${owner._id}`, 'GET', undefined, otherToken);
  assert.equal(publicProfile.status, 200);
  assert.equal(publicProfile.data.resetPasswordToken, undefined);
  assert.equal(publicProfile.data.email, undefined);
  const secretDocument = await User.findById(owner._id).select('+resetPasswordToken +resetPasswordExpires +password +tokenVersion');
  for (const key of ['password', 'resetPasswordToken', 'resetPasswordExpires', 'tokenVersion']) assert.equal(secretDocument.toJSON()[key], undefined);
});
test('foreign rating deletion does not delete; author can delete', async () => {
  const created = await request('/ratings', 'POST', { jobId: job._id, rating: 4, content: 'Synthetischer Test' }, otherToken);
  assert.equal(created.status, 201);
  const id = created.data.newRating._id;
  assert.equal((await request(`/ratings/${id}`, 'DELETE', undefined, ownerToken)).status, 404);
  assert.ok(await Rating.findById(id));
  assert.equal((await request(`/ratings/${id}`, 'DELETE', undefined, otherToken)).status, 200);
});
test('chat outsiders cannot reply/read; participant can reply and recipient mark read', async () => {
  const created = await request('/chats', 'POST', { jobId: job._id, message: 'Private Testnachricht' }, otherToken);
  assert.equal(created.status, 200);
  const id = created.data._id, messageId = created.data.messages[0]._id;
  assert.equal((await request(`/chats/${id}/reply`, 'POST', { content: 'attack' }, thirdToken)).status, 404);
  assert.equal((await request(`/chats/${id}/messages/${messageId}`, 'PATCH', undefined, thirdToken)).status, 404);
  let stored = await Chat.findById(id);
  assert.equal(stored.messages.length, 1);
  assert.equal(stored.messages[0].read, false);
  assert.equal((await request(`/chats/${id}/messages/${messageId}`, 'PATCH', undefined, ownerToken)).status, 200);
  assert.equal((await request(`/chats/${id}/reply`, 'POST', { content: 'Berechtigte Antwort' }, ownerToken)).status, 201);
  assert.equal((await request('/chats', 'GET', undefined, thirdToken)).data.data.length, 0);
});
test('search treats regex characters literally and populates offer owner', async () => {
  const result = await request('/search/jobs?query=%5B');
  assert.equal(result.status, 200);
  assert.equal(result.data.length, 0);
  const all = await request('/search/jobs');
  assert.equal(all.data[0].createdBy.username, 'owner');
});
test('password reset is single use, validates password and revokes old session', async () => {
  const raw = crypto.randomBytes(32).toString('hex');
  await User.findByIdAndUpdate(other._id, { resetPasswordToken: crypto.createHash('sha256').update(raw).digest('hex'), resetPasswordExpires: new Date(Date.now() + 60000) });
  assert.equal((await request(`/reset-password/${raw}`)).status, 200);
  assert.equal((await request(`/reset-password/${raw}`, 'POST', { password: 'weak' })).status, 400);
  assert.equal((await request(`/reset-password/${raw}`, 'POST', { password: 'New-Synthetic-Password!' })).status, 200);
  assert.equal((await request(`/reset-password/${raw}`, 'POST', { password: 'Again-Synthetic-Password!' })).status, 400);
  assert.equal((await request('/users/profile', 'GET', undefined, otherToken)).status, 401);
  assert.equal((await request('/login', 'POST', { email: 'other@example.invalid', password: 'New-Synthetic-Password!' })).status, 200);
});
test('missing mail configuration gives safe error without external requests', async () => {
  const result = await request('/forgot-password', 'POST', { email: 'owner@example.invalid' });
  assert.equal(result.status, 503);
  assert.equal(typeof result.data.error, 'string');
});
test('account deletion revokes former token; owner-only offer deletion succeeds', async () => {
  assert.equal((await request(`/jobs/${job._id}`, 'DELETE', undefined, ownerToken)).status, 200);
  assert.equal(await Job.findById(job._id), null);
  assert.equal((await request(`/users/${third._id}`, 'DELETE', undefined, thirdToken)).status, 200);
  assert.equal((await request('/users/profile', 'GET', undefined, thirdToken)).status, 401);
});

test('logout invalidates copied tokens on the server', async () => {
  const signedIn = await request('/login', 'POST', { email: 'owner@example.invalid', password: 'Synthetic-Password!' });
  const token = signedIn.data.token;
  assert.equal((await request('/logout', 'POST', undefined, token)).status, 200);
  assert.equal((await request('/users/profile', 'GET', undefined, token)).status, 401);
});
test('expired or invented reset tokens cannot change an account', async () => {
  const raw = crypto.randomBytes(32).toString('hex');
  await User.findByIdAndUpdate(owner._id, { resetPasswordToken: crypto.createHash('sha256').update(raw).digest('hex'), resetPasswordExpires: new Date(Date.now() - 60000) });
  assert.equal((await request(`/reset-password/${raw}`, 'POST', { password: 'Never-Set-Password!' })).status, 400);
  const originalHash = bcrypt.hash;
  let calls = 0;
  bcrypt.hash = (...args) => { calls++; return originalHash(...args); };
  try {
    assert.equal((await request(`/reset-password/${'a'.repeat(64)}`, 'POST', { password: 'Never-Set-Password!' })).status, 400);
    assert.equal(calls, 0, 'invalid tokens must not trigger bcrypt work');
  } finally { bcrypt.hash = originalHash; }
  assert.equal((await request('/login', 'POST', { email: 'owner@example.invalid', password: 'Synthetic-Password!' })).status, 200);
});

test('price ranges compare numeric values even when stored as strings', async () => {
  const login = await request('/login', 'POST', { email: 'owner@example.invalid', password: 'Synthetic-Password!' });
  const created = await request('/jobs', 'POST', payload, login.data.token);
  assert.equal(created.status, 201);
  const result = await request('/search/jobs?price=50-110');
  assert.equal(result.status, 200);
  assert.ok(result.data.some(entry => entry._id === created.data.job._id));
  assert.equal((await request('/search/jobs?price=110-50')).status, 400);
  assert.equal((await request('/search/jobs?price=50oops-110')).status, 400);
});

test('health endpoint confirms database readiness and disables caching', async () => {
  const response = await fetch(base + '/health');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('contact validates input, uses configured recipient and handles delivery errors', async () => {
  const { mail } = await import('../mail.js');
  const { mock } = await import('node:test');
  const old = { key: process.env.RESEND_API_KEY, from: process.env.RESEND_EMAIL, to: process.env.CONTACT_EMAIL };
  process.env.RESEND_API_KEY = 'synthetic-test-key';
  process.env.RESEND_EMAIL = 'sender@example.invalid';
  process.env.CONTACT_EMAIL = 'recipient@example.invalid';
  const sent = [];
  const transport = mock.method(mail, 'send', async message => { sent.push(message); });
  try {
    const message = { email: 'visitor@example.invalid', subject: 'Kontakt', message: '<b>Nur Text</b>', to: 'attacker@example.invalid' };
    assert.equal((await request('/contact', 'POST', { ...message, email: 'invalid' })).status, 400);
    assert.equal((await request('/contact', 'POST', message)).status, 201);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].to, 'recipient@example.invalid');
    assert.equal(sent[0].replyTo, message.email);
    assert.equal(sent[0].html, undefined);
    assert.ok(sent[0].text.includes(message.message));
    transport.mock.mockImplementation(async () => { throw new Error('synthetic provider failure'); });
    assert.equal((await request('/contact', 'POST', message)).status, 502);
  } finally {
    transport.mock.restore();
    for (const [name, value] of Object.entries({ RESEND_API_KEY: old.key, RESEND_EMAIL: old.from, CONTACT_EMAIL: old.to })) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});

test('rate limits are shared and cannot be bypassed with a forwarded header locally', async () => {
  await mongoose.connection.collection('requestlimits').deleteMany({});
  const replies = await Promise.all(Array.from({ length: 12 }, (_, index) => fetch(base + '/forgot-password', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `192.0.2.${index}` },
    body: JSON.stringify({ email: 'synthetic@example.invalid' }),
  })));
  assert.equal(replies.filter(response => response.status === 503).length, 5);
  assert.equal(replies.filter(response => response.status === 429).length, 7);
  assert.ok(replies.find(response => response.status === 429).headers.get('retry-after'));
  const counters = await mongoose.connection.collection('requestlimits').find({}).toArray();
  assert.equal(counters.length, 1);
  assert.equal(counters[0].count, 12);
  assert.match(counters[0]._id, /^[a-f0-9]{64}$/);
  assert.ok(counters[0].expiresAt instanceof Date);
});

test('offer inputs validate price and required fields with a client error', async () => {
  const { data: login } = await request('/login', 'POST', { email: 'owner@example.invalid', password: 'Synthetic-Password!' });
  for (const price of ['-1', 'abc', '12.345']) {
    assert.equal((await request('/jobs', 'POST', { ...payload, price }, login.token)).status, 400);
  }
  assert.equal((await request('/jobs', 'POST', { ...payload, title: '  ' }, login.token)).status, 400);
  const created = await request('/jobs', 'POST', { ...payload, price: '25,50' }, login.token);
  assert.equal(created.status, 201);
  assert.equal(created.data.job.price, '25.50');
});

test('ratings and messages reject invalid input and references before saving', async () => {
  const { data: login } = await request('/login', 'POST', { email: 'owner@example.invalid', password: 'Synthetic-Password!' });
  const created = await request('/jobs', 'POST', payload, login.token);
  const jobId = created.data.job._id;
  for (const rating of [-1, 0, 6, 2.5, '5']) {
    assert.equal((await request('/ratings', 'POST', { jobId, rating }, login.token)).status, 400);
  }
  assert.equal((await request('/ratings', 'POST', { jobId: 'bad', rating: 4 }, login.token)).status, 400);
  assert.equal((await request('/ratings', 'POST', { jobId: new mongoose.Types.ObjectId().toString(), rating: 4 }, login.token)).status, 404);
  assert.equal((await request('/chats', 'POST', { jobId, message: '  ' }, login.token)).status, 400);
  assert.equal((await request('/chats', 'POST', { jobId: 'bad', message: 'Text' }, login.token)).status, 400);
  const chat = await request('/chats', 'POST', { jobId, message: 'Text' }, login.token);
  assert.equal((await request(`/chats/${chat.data._id}/reply`, 'POST', { content: '  ' }, login.token)).status, 400);
});

test('authorized offer deletion removes its ratings and chats', async () => {
  const { data: login } = await request('/login', 'POST', { email: 'owner@example.invalid', password: 'Synthetic-Password!' });
  const created = await request('/jobs', 'POST', payload, login.token);
  const jobId = created.data.job._id;
  await request('/ratings', 'POST', { jobId, rating: 4, content: 'Test' }, login.token);
  await request('/chats', 'POST', { jobId, message: 'Test' }, login.token);
  assert.equal((await request(`/jobs/${jobId}`, 'DELETE', undefined, login.token)).status, 200);
  assert.equal(await Rating.countDocuments({ jobId }), 0);
  assert.equal(await Chat.countDocuments({ jobId }), 0);
});
