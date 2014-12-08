
assert.that('DBQuery#select selects and flattens nested fields', function(c) {
  c.save({field: {nested: {nested: 'value_1', another: 'value_2'}}})
  c.save({field: {nested: {nested: 'value_1', another: 'value_2'}}})
  c.save({field: {nested: {nested: 'value_1', another: 'value_2'}}})

  var resultWithoutSelect = c.find()

  assert.eq(resultWithoutSelect[0].field.nested.nested, 'value_1')
  assert.eq(resultWithoutSelect[0].field.nested.another, 'value_2')

  var result = c.find().select('field.nested.nested')

  assert.eq(result[0], {'field.nested.nested': 'value_1'})
  assert.eq(result[1], {'field.nested.nested': 'value_1'})
  assert.eq(result[2], {'field.nested.nested': 'value_1'})
})

assert.that('DBQuery#select selects multiple things', function(c) {
  c.save({field: {nested: {nested: 'value_1', another: 'value_2'}}})
  c.save({field: {nested: {nested: 'value_1', another: 'value_2'}}})
  c.save({field: {nested: {nested: 'value_1', another: 'value_2'}}})

  var result = c.find().select(['field.nested.nested', 'field.nested.another'])

  assert.eq(result[0], {'field.nested.nested': 'value_1', 'field.nested.another': 'value_2'})
  assert.eq(result[1], {'field.nested.nested': 'value_1', 'field.nested.another': 'value_2'})
  assert.eq(result[2], {'field.nested.nested': 'value_1', 'field.nested.another': 'value_2'})
})

assert.that('DBQuery#select selects and rename multiple things', function(c) {
  c.save({field: {f1: 1, f2: 2, f3: 3}})
  c.save({field: {f1: 1, f2: 2, f3: 3}})
  c.save({field: {f1: 1, f2: 2, f3: 3}})

  var result = c.find().select({'field_1': 'field.f1', 'field_2': 'field.f2'})

  assert.eq(result[0], {'field_1': 1, 'field_2': 2})
  assert.eq(result[1], {'field_1': 1, 'field_2': 2})
  assert.eq(result[2], {'field_1': 1, 'field_2': 2})
})
