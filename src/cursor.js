DBQuery.prototype.reverse = function() {
  if (!this._query.query || _.isEmpty(this._query.query)) {
    this._query.query = {}
  }
  if (!this._query.orderby || _.isEmpty(this._query.orderby)) {
    this._query.orderby = {'$natural': 1}
  }
  for (var field in this._query.orderby) {
    this._query.orderby[field] = this._query.orderby[field] * -1
  }
  return this
}

DBQuery.prototype.last = function(n) {
  return this.reverse().limit(n || 1)
}

DBQuery.prototype.first = function(n) {
  return this.limit(n || 1)
}
