/* global isObject: false */

DBCollection.prototype.distinctAndCount = function(field, query) {
  field = [].concat(field)
  query = query || {}

  var groupById = _([].concat(field)).reduce(function(result, key) {
    result[key.replace(/\./g, '_')] = '$' + key; return result
  }, {})

  var it = this.aggregate(
    {$match: query},
    {$group: {_id: groupById, count: {$sum: 1}}},
    {$project: {values: '$_id', count: 1, _id: 0}}
  )

  var resultIsAnObject = (it.result !== undefined) && (it.ok !== undefined)
  if (resultIsAnObject && it.ok === 0) {
    return it
  }

  var result = it.result || it.toArray()
  return _.reduce(result, function(all, r) {

    var isValidValue =
      _(r.values)
        .chain()
        .values()
        .map(function(value) {
          if (value === null) {
            return {valueOf: function() {return value}}
          }
          return value
        })
        .any(function(value) {
          if (_(value).isArray()) {
            return _(value).all(function(value) {
              return !_(value).isObject()
            })
          }
          // we support values like Number or Date but not {}
          return value.constructor.name !== ''
        })
        .valueOf()

    if (!isValidValue) {
      throw 'distinctAndCount could not work when one or more fields are objects: ' + tojson(r.values)
    }

    var key =
      _(r.values)
        .chain()
        .values()
        .map(function(value) {
          if (value === null) {
            return '#null#'
          }
          if (_(value.valueOf).isFunction()) {
            value = value.valueOf()
          }
          if (_(value).isArray()) {
            value = _(value).sort().valueOf()
          }
          return value
        })
        .valueOf()
        .join(',')

    all[key] = (all[key] || 0) + r.count

    return all
  }, {})
}
