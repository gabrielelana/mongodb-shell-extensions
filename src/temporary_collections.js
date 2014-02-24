DB.prototype.collection = function() {
  var _arguments = Array.prototype.slice.call(arguments)
  if (_arguments.length === 2 && _.isString(_arguments[0]) && _.isFunction(_arguments[1])) {
    var collection = this.getCollection(_arguments[0]),
        callback = _arguments[1],
        result = callback(collection)
    return result === undefined ? collection : result
  }
  if (_arguments.length >= 1 && _.isString(_arguments[0])) {
    return this.getCollection(_arguments[0])
  }
  if (_arguments.length >= 1 && _.isFunction(_arguments[0])) {
    return this.createTemporaryCollection(_arguments[0])
  }
  return this
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

DB.prototype.getCollections = function() {
  return _(this.getCollectionNames()).map(_.bind(this.getCollection, this)).valueOf()
}

DB.prototype.getTemporaryCollections = function() {
  return _(this.getCollections()).filter(function(c) {return c.isTemporary()}).valueOf()
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
