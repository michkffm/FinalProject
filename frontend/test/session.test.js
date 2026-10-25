import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSessionUserId } from '../src/session.js';

const userId = '0123456789abcdef01234567';
const token = (payload) => `header.${btoa(JSON.stringify(payload))}.signature`;
test('valid session payload preserves the user ID for client routing', () => {
  assert.equal(getSessionUserId(token({ userId, exp: Date.now() / 1000 + 60 })), userId);
});
test('corrupt, expired, missing-expiry and invalid-ID tokens redirect safely', () => {
  for (const value of [null, '', 'broken', 'x.not-json.y', token({ userId }), token({ userId, exp: 1 }), token({ userId: [], exp: Date.now() / 1000 + 60 }), token({ userId: [userId], exp: Date.now() / 1000 + 60 })]) {
    assert.equal(getSessionUserId(value), null);
  }
});
