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

test('category, trimmed title and location combine with price', () => {
  const offers = [
    { title: 'PC Hilfe', location: 'Frankfurt', category: 'Technologie und IT', price: 50 },
    { title: 'PC Hilfe', location: 'Frankfurt', category: 'Beratung', price: 100 },
    { title: 'PC Hilfe', location: 'Berlin', category: 'Technologie und IT', price: 25 },
  ];
  const filters = { name: ' pc ', location: ' FRANK ', price: 'medium', category: 'Technologie und IT' };
  assert.deepEqual(filterJobs(offers, filters), [offers[0]]);
  assert.equal(filterJobs(offers, { name: '', location: '', price: 'all', category: '' }).length, 3);
  assert.deepEqual(filterJobs(offers, { ...filters, category: 'Bildung und Schulung' }), []);
});
