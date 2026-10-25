import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterJobs } from '../src/filterJobs.js';
const jobs = [{ title: 'Beratung', location: 'Frankfurt', price: '49' }, { title: 'Beratung', location: 'Frankfurt', price: '50' }, { title: 'Hilfe', location: 'Testort', price: '100' }, { title: 'Hilfe', location: 'Testort', price: '101' }];
test('price filters include the correct boundary values', () => {
  const filters = { name: '', location: '', price: 'medium' };
  assert.deepEqual(filterJobs(jobs, filters).map(job => job.price), ['50', '100']);
  assert.equal(filterJobs(jobs, { ...filters, price: 'low' }).length, 1);
  assert.equal(filterJobs(jobs, { ...filters, price: 'high' }).length, 1);
});
test('name and location filters combine without mutating results', () => {
  assert.equal(filterJobs(jobs, { name: 'BERATUNG', location: 'frank', price: 'all' }).length, 2);
  assert.equal(jobs.length, 4);
  assert.deepEqual(filterJobs(jobs, { name: 'unbekannt', location: '', price: 'all' }), []);
});
