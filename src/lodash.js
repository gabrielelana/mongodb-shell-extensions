_.mixin({
  shellPrint: function(thing) {
    return tojson(thing.valueOf())
  }
})
