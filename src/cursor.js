/* global shellHelper, __prettyShell:true */

DBQuery.prototype.reverse = function() {
  this._checkModify();
  if (!this._query.orderby || _.isEmpty(this._query.orderby)) {
    this._addSpecial('orderby', {'$natural': 1});
  }
  for (var field in this._query.orderby) {
    this._query.orderby[field] = this._query.orderby[field] * -1
  }
  return this
}

DBQuery.prototype.last = DBQuery.prototype.tail =
  function(n) {
    return this.reverse().limit(n || 1)
  }

DBQuery.prototype.first = DBQuery.prototype.head =
  function(n) {
    return this.limit(n || 1)
  }

DBQuery.prototype.tojson = function() {
  return tojson(this.toArray())
}

DBQuery.prototype.ugly = function(){
    this._prettyShell = false;
    return this;
}

;(function(shellPrint, prettyShell) {
  DBQuery.prototype.shellPrint = function() {
    prettyShell = this._prettyShell
    this._prettyShell = this._prettyShell || __prettyShell
    var result = shellPrint.call(this)
    this._prettyShell = prettyShell
    return result
  }
})(DBQuery.prototype.shellPrint)
