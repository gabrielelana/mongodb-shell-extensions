// assert.that('distinctAndCount on one field', function(c) {
//   c.save({field: 'value_1'})
//   c.save({field: 'value_2'})
//   c.save({field: 'value_1'})

//   var result = c.distinctAndCount('field')

//   assert.eq(2, result['value_1'])
//   assert.eq(1, result['value_2'])
// })

// assert.that('distinctAndCount on one nested field', function(c) {
//   c.save({field: {nested: 'value_1'}})
//   c.save({field: {nested: 'value_2'}})
//   c.save({field: {nested: 'value_1'}})

//   var result = c.distinctAndCount('field.nested')

//   assert.eq(2, result['value_1'])
//   assert.eq(1, result['value_2'])
// })

assert.that('distinctAndCount on deeply nested fields', function(c) {
  c.save({field: {nested: {nested: {nested: 'value_1'}}}})
  c.save({field: {nested: {nested: {nested: 'value_2'}}}})
  c.save({field: {nested: {nested: {nested: 'value_1'}}}})

  var result = c.distinctAndCount('field.nested.nested.nested')

  assert.eq(2, result['value_1'])
  assert.eq(1, result['value_2'])
})

assert.that('distinctAndCount on multiple fields', function(c) {
  c.save({'field_1': 'value_1', 'field_2': 'value_1'})
  c.save({'field_1': 'value_2', 'field_2': 'value_2'})
  c.save({'field_1': 'value_1', 'field_2': 'value_3'})
  c.save({'field_1': 'value_1', 'field_2': 'value_3'})

  var result = c.distinctAndCount(['field_1', 'field_2'])

  assert.eq(2, result['value_1,value_3'])
  assert.eq(1, result['value_2,value_2'])
  assert.eq(1, result['value_1,value_1'])
})

assert.that('distinctAndCount throws an exception with array fields', function(c) {
  c.save({field: 'value_1'})
  c.save({field: ['value_2']})

  assert.throws(function() {
    c.distinctAndCount('field')
  }, [])
})

assert.that('distinctAndCount throws an exception with object fields', function(c) {
  c.save({field: 'value_1'})
  c.save({field: {key: 'value_2'}})

  assert.throws(function() {
    c.distinctAndCount('field')
  }, [])
})

assert.that('distinctAndCount takes a query as second parameter', function(c) {
  c.save({field: 'value_1', tag: 1})
  c.save({field: 'value_2', tag: 2})
  c.save({field: 'value_1', tag: 1})
  c.save({field: 'value_2', tag: 1})

  var result = c.distinctAndCount('field', {tag: 1})

  assert.eq(2, result['value_1'])
  assert.eq(1, result['value_2'])
})
