DBCollection.prototype.last = function(n) {
  return this.find().sortAsInserted().last(n)
}

DBCollection.prototype.first = function(n) {
  return this.find().sortAsInserted().first(n)
}
