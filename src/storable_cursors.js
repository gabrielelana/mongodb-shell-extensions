var se = se || {}

DBQuery.prototype.save = function(collection) {
  collection = (typeof collection === 'string') ? this._db.getCollection(collection) : collection
  collection = collection || se.collection()
  while (this.hasNext()) {
    collection.save(this.next())
  }
  return collection
}
