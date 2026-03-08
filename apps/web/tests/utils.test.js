import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cn, formatDate, getRiskColor } from '../.test-dist/apps/web/src/lib/utils.js';

test('cn merges duplicate Tailwind classes predictably', () => {
  assert.equal(cn('px-2 text-sm', 'px-4', false && 'hidden', 'text-sm'), 'px-4 text-sm');
});

test('formatDate returns a readable US date string', () => {
  const formatted = formatDate('2024-02-20T12:00:00.000Z');
  assert.match(formatted, /February 20, 2024/);
});

test('getRiskColor returns expected classes for known and unknown risk levels', () => {
  assert.equal(getRiskColor('critical'), 'text-red-600 bg-red-50');
  assert.equal(getRiskColor('moderate'), 'text-yellow-600 bg-yellow-50');
  assert.equal(getRiskColor('unknown'), 'text-gray-600 bg-gray-50');
});