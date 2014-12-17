/* global NumberLong:false */

assert.that('distinctAndCount works on one field', function(c) {
  c.save({field: 'value_1'})
  c.save({field: 'value_2'})
  c.save({field: 'value_1'})

  var result = c.distinctAndCount('field')

  assert.eq(2, result['value_1'])
  assert.eq(1, result['value_2'])
})

assert.that('distinctAndCount works on one nested field', function(c) {
  c.save({field: {nested: 'value_1'}})
  c.save({field: {nested: 'value_2'}})
  c.save({field: {nested: 'value_1'}})

  var result = c.distinctAndCount('field.nested')

  assert.eq(2, result['value_1'])
  assert.eq(1, result['value_2'])
})

assert.that('distinctAndCount works on deeply nested fields', function(c) {
  c.save({field: {nested: {nested: {nested: 'value_1'}}}})
  c.save({field: {nested: {nested: {nested: 'value_2'}}}})
  c.save({field: {nested: {nested: {nested: 'value_1'}}}})

  var result = c.distinctAndCount('field.nested.nested.nested')

  assert.eq(2, result['value_1'])
  assert.eq(1, result['value_2'])
})

assert.that('distinctAndCount works on multiple fields', function(c) {
  c.save({'field_1': 'value_1', 'field_2': 'value_1'})
  c.save({'field_1': 'value_2', 'field_2': 'value_2'})
  c.save({'field_1': 'value_1', 'field_2': 'value_3'})
  c.save({'field_1': 'value_1', 'field_2': 'value_3'})

  var result = c.distinctAndCount(['field_1', 'field_2'])

  assert.eq(2, result['value_1,value_3'])
  assert.eq(1, result['value_2,value_2'])
  assert.eq(1, result['value_1,value_1'])
})

assert.that('distinctAndCount works on array fields', function(c) {
  c.save({field: 'value_1'})
  c.save({field: ['value_2', 'value_3']})
  c.save({field: ['value_3', 'value_2']})
  c.save({field: ['value_1', 'value_2']})

  var result = c.distinctAndCount('field')

  assert.eq(1, result['value_1'])
  assert.eq(2, result['value_2,value_3'])
  assert.eq(1, result['value_1,value_2'])
})

assert.that('distinctAndCount works on multiple array fields', function(c) {
  c.save({'field_1': ['value_1','value_2'], 'field_2': 'value_1'})
  c.save({'field_1': ['value_1','value_2'], 'field_2': 'value_2'})
  c.save({'field_1': ['value_2','value_1'], 'field_2': 'value_2'})

  var result = c.distinctAndCount(['field_1', 'field_2'])

  assert.eq(1, result['value_1,value_2,value_1'])
  assert.eq(2, result['value_1,value_2,value_2'])
})

assert.that('distinctAndCount works when distinct field is null', function(c) {
  c.save({field: 'value_1'})
  c.save({field: null})
  c.save({field: undefined}) // undefined is saved as null
  c.save({field: 'value_1'})

  var result = c.distinctAndCount('field')

  assert.eq(2, result['#null#'])
})

assert.that('distinctAndCount throws an exception on object fields', function(c) {
  c.save({field: 'value_1'})
  c.save({field: {key: 'value_2'}})

  assert.throws(function() {
    c.distinctAndCount('field')
  })
})

assert.that('distinctAndCount throws an exception on array fields that contains objects', function(c) {
  c.save({field: 'value_1'})
  c.save({field: [{key: 'value_2'}]})

  assert.throws(function() {
    c.distinctAndCount('field')
  })
})

assert.that('distinctAndCount works with Number fields', function(c) {
  c.save({field: 'value_1'})
  c.save({field: NumberLong(200)})

  var result = c.distinctAndCount('field')

  assert.eq(1, result['value_1'])
  assert.eq(1, result[200])
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
