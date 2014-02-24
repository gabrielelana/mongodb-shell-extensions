DBQuery.prototype.save = function(collection) {
  collection = (typeof collection === 'string') ? this._db.getCollection(collection) : collection
  collection = collection || this._db.createTemporaryCollection()
  assert(collection && collection.constructor.name === 'DBCollection', 'need a collection')
  while (this.hasNext()) {
    collection.save(this.next())
  }
  return collection
}
