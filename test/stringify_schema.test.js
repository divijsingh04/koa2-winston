const test = require('ava');

const { generateSchema, asJsonSchemaPath } = require('../stringify_schema');

test('default schema on definitions', (t) => {
  const schema = generateSchema({});
  t.deepEqual(schema.definitions, {
    req: {
      type: 'object',
      properties: {
        header: {
          type: 'object',
          additionalProperties: { type: 'string' },
          properties: { cookie: { type: 'null' } },
        },
        url: { type: 'string' },
        method: { type: 'string' },
        httpVersion: { type: 'string' },
        href: { type: 'string' },
        query: { type: 'object', additionalProperties: { type: 'string' } },
        length: { type: 'integer' },
      },
    },
    res: {
      type: 'object',
      properties: {
        header: { type: 'object', additionalProperties: { type: 'string' } },
        status: { type: 'string' },
      },
    },
  });
});

test('unselect res.body.success should not work', (t) => {
  const schema = generateSchema({ resUnselect: ['body.success'] });
  t.deepEqual(schema.definitions, {
    req: {
      type: 'object',
      properties: {
        header: {
          type: 'object',
          additionalProperties: { type: 'string' },
          properties: { cookie: { type: 'null' } },
        },
        url: { type: 'string' },
        method: { type: 'string' },
        httpVersion: { type: 'string' },
        href: { type: 'string' },
        query: { type: 'object', additionalProperties: { type: 'string' } },
        length: { type: 'integer' },
      },
    },
    res: {
      type: 'object',
      properties: {
        header: { type: 'object', additionalProperties: { type: 'string' } },
        status: { type: 'string' },
      },
    },
  });
});

test('unselect res.status should not work', (t) => {
  const schema = generateSchema({
    reqKeys: [],
    resKeys: [],
    resUnselect: ['status'],
  });
  t.deepEqual(schema.definitions, {
    req: { type: 'object', properties: {} },
    res: { type: 'object', properties: {} },
  });
});

// Additional tests for the custom set implementation

test('custom schema setting with deeply nested paths', (t) => {
  const schema = generateSchema({ 
    reqSelect: ['body.data.items.id', 'body.data.items.name'] 
  });
  
  t.truthy(schema.definitions.req.properties.body);
  t.truthy(schema.definitions.req.properties.body.properties);
  t.truthy(schema.definitions.req.properties.body.properties.data);
  t.truthy(schema.definitions.req.properties.body.properties.data.properties);
  t.truthy(schema.definitions.req.properties.body.properties.data.properties.items);
  t.truthy(schema.definitions.req.properties.body.properties.data.properties.items.properties);
  t.truthy(schema.definitions.req.properties.body.properties.data.properties.items.properties.id);
  t.truthy(schema.definitions.req.properties.body.properties.data.properties.items.properties.name);
});

test('asJsonSchemaPath correctly transforms paths', (t) => {
  t.is(asJsonSchemaPath('a.b.c'), 'a.properties.b.properties.c');
  t.is(asJsonSchemaPath('header.cookie'), 'header.properties.cookie');
  t.is(asJsonSchemaPath('body.data.items'), 'body.properties.data.properties.items');
});
