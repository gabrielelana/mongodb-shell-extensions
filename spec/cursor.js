assert.that('DBQuery#reverse the original sort', function(c) {
  c.save({field: 21})
  c.save({field: 42})

  var orderByAsc = c.find().sort({field: 1})
  assert.eq(orderByAsc[0].field, 21)
  assert.eq(orderByAsc[1].field, 42)

  var orderByDesc = orderByAsc.clone().reverse()
  assert.eq(orderByDesc[0].field, 42)
  assert.eq(orderByDesc[1].field, 21)
})

assert.that('DBQuery#reverse keeps the original query', function(c) {
  c.save({field: 21})
  c.save({field: 42})

  var query = c.find({field: 42})
  assert.eq(query.count(), 1)

  var reversed = query.clone().reverse()
  assert.eq(reversed.count(), 1)
})
