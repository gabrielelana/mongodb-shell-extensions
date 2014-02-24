/* global _, tojson */

_.mixin({
  shellPrint: function(thing) {
    return tojson(thing.valueOf())
  }
})
