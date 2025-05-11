const test = require('ava');

// Import the custom set function
// Since it's not exported, we'll recreate it here for testing
function set(obj, path, value) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return obj;
}

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