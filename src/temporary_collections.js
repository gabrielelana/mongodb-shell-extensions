var se = se || {}

se.collection = function() {
  return se._db(arguments, function(_db, _arguments) {
    if (_arguments.length === 2 && _.isString(_arguments[0]) && _.isFunction(_arguments[1])) {
      var collection = _db.getCollection(_arguments[0]),
          callback = _arguments[1],
          result = callback(collection)
      return result === undefined ? collection : result
    }
    if (_arguments.length >= 1 && _.isString(_arguments[0])) {
      return _db.getCollection(_arguments[0])
    }
    if (_arguments.length >= 1 && _.isFunction(_arguments[0])) {
      return _db.createTemporaryCollection(_arguments[0])
    }
    return _db
  })
}

se._db = function(_arguments, _callback) {
  var _db = db

  _arguments = Array.prototype.slice.call(_arguments)
  if (_arguments.length >= 1 && (_arguments[0].constructor === DB.prototype.constructor)) {
    _db = _arguments.shift()
  }
  if (!_db) {
    throw new Error(
      'Global variable db not defined... are you in a MongoDB shell?\n' +
      'In this case you need to use a valid DB instance as a first argument'
    )
  }

  return _callback(_db, _arguments)
}

DB.prototype.createTemporaryCollection = function(callback, options) {
  var uniquePrefixedName = '__t' + (new ObjectId().valueOf()),
      collection = this.getCollection(uniquePrefixedName),
      aCallbackIsGiven = !!callback,
      result = collection

  options = _({deleteAfter: aCallbackIsGiven}, options)
  try {
    if (aCallbackIsGiven) {
      result = callback(collection)
      if ((result === undefined) && !options.deleteAfter) {
        result = collection
      }
    }
  } finally {
    if (options.deleteAfter) {
      collection.drop()
    }
  }

  return result
}

DB.prototype.getTemporaryCollections = function() {
  return _(this.getCollectionNames()).filter(/^__t/).map(_.bind(this.getCollection, this)).valueOf()
}

DB.prototype.dropTemporaryCollections = function() {
  this.getTemporaryCollections().forEach(function(c) {
    c.drop()
  })
  return true
}

DBCollection.prototype.isTemporary = function() {
  return this.getName().substr(0, 3) === '__t'
}
