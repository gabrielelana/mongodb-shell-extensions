/* global DB:true, DBCollection:true, ObjectId:true, db:true, _:true, assert:true */

var se = se || {}

se.collection = function() {
  assert(db !== undefined, 'global variable db is not defined, are you in a MongoDB shell?')
  if (arguments.length === 0) {
    return db.createTemporaryCollection();
  }
  if (arguments.length === 2 && _.isString(arguments[0]) && _.isFunction(arguments[1])) {
    var collection = db.getCollection(arguments[0]),
        callback = arguments[1],
        result = callback(collection)
    return result === undefined ? collection : result
  }
  if (arguments.length >= 1 && _.isString(arguments[0])) {
    return db.getCollection(arguments[0])
  }
  if (arguments.length >= 1 && _.isFunction(arguments[0])) {
    return db.createTemporaryCollection(arguments[0])
  }
  return db
}

DB.prototype.createTemporaryCollection = function(callback) {
  var uniquePrefixedName = '__t' + (new ObjectId().valueOf()),
      collection = this.getCollection(uniquePrefixedName),
      result = collection

  if (callback) {
    try {
      result = callback(collection)
      result = result === undefined ? collection : result
    } finally {
      collection.drop()
    }
  }

  return result
}

DBCollection.prototype.isTemporary = function() {
  return this.getName().substr(0, 3) === '__t'
}
