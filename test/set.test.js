const test = require('ava');
const { set } = require('../stringify_schema');

test('set: sets a value at a simple path', (t) => {
  const obj = {};
  set(obj, 'a', 1);
  t.deepEqual(obj, { a: 1 });
});

test('set: sets a value at a nested path', (t) => {
  const obj = {};
  set(obj, 'a.b.c', 1);
  t.deepEqual(obj, { a: { b: { c: 1 } } });
});

test('set: updates an existing value', (t) => {
  const obj = { a: { b: { c: 1 } } };
  set(obj, 'a.b.c', 2);
  t.deepEqual(obj, { a: { b: { c: 2 } } });
});

test('set: sets a value at a path where part of the path exists', (t) => {
  const obj = { a: { b: 1 } };
  set(obj, 'a.c.d', 2);
  t.deepEqual(obj, { a: { b: 1, c: { d: 2 } } });
});

test('set: handles null values in the path', (t) => {
  const obj = { a: { b: null } };
  set(obj, 'a.b.c', 1);
  t.deepEqual(obj, { a: { b: { c: 1 } } });
});

test('set: returns the object', (t) => {
  const obj = {};
  const result = set(obj, 'a', 1);
  t.is(result, obj);
});

test('set: handles non-object inputs', (t) => {
  const result = set(null, 'a', 1);
  t.is(result, null);
}); 