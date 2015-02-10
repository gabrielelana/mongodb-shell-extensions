assert.that('DBQuery#first returns the first document in natural order', function(c) {
  // natural order == the order in which documents are inserted
  var o1 = {_id: ObjectId()} // created first -> with smaller _id
  var o2 = {_id: ObjectId()} // created last -> with bigger _id
  c.save(o2) // inserted first -> should be returned this even if o2._id > o1._id
  c.save(o1)

  assert.eq(c.find().first(), [o2])
  // same as
  assert.eq(c.find().sortAsInserted().first(), [o2])
  // same as
  assert.eq(c.first(), [o2])
})

assert.that('DBQuery#last returns the last document in natural order', function(c) {
  // natural order == the order in which documents are inserted
  var o1 = {_id: ObjectId()} // created first -> with smaller _id
  var o2 = {_id: ObjectId()} // created last -> with bigger _id
  c.save(o2)
  c.save(o1) // inserted last -> should be returned this even if o1._id < o2._id

  assert.eq(c.find().last(), [o1])
  // same as
  assert.eq(c.find().sortAsInserted().last(), [o1])
  // same as
  assert.eq(c.last(), [o1])
})

assert.that('DBQuery#first/last maintains the sort order previously given', function(c) {
  var o1 = {_id: ObjectId(), value: 2}
  var o2 = {_id: ObjectId(), value: 1}
  c.save(o1)
  c.save(o2)

  assert.eq(c.find().first(), [o1])
  assert.eq(c.find().sort({value: 1}).first(), [o2])

  assert.eq(c.find().last(), [o2])
  assert.eq(c.find().sort({value: 1}).last(), [o1])
})

assert.that('DBQuery#sortById', function(c) {
  var o1 = {_id: ObjectId()} // created first -> with smaller _id
  var o2 = {_id: ObjectId()} // created last -> with bigger _id
  c.save(o2)
  c.save(o1)

  assert.eq(c.find().sortById().first(), [o1])
  assert.eq(c.find().sortById().last(), [o2])
})


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
