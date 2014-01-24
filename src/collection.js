/* global DBCollection:true */

DBCollection.prototype.last = function(n) {
  return this.find().sort({_id: -1}).limit(n || 1)
}

DBCollection.prototype.first = function(n) {
  return this.find().sort({_id: 1}).limit(n || 1)
}
