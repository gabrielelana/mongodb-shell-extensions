/* global isObject: false */

DBCollection.prototype.distinctAndCount = function(field, query) {
  field = [].concat(field)
  query = query || {}

  var groupById = _([].concat(field)).reduce(function(result, key) {
    result[key.replace('.', '_')] = '$' + key; return result
  }, {})

  var it = this.aggregate(
    {$match: query},
    {$group: {_id: groupById, count: {$sum: 1}}},
    {$project: {values: '$_id', count: 1, _id: 0}}
  )

  if (it.ok === 1) {
    return _.reduce(it.result, function(all, r) {
      if (!_.any(r.values, isObject)) {
        all[_.values(r.values).join(',')] = r.count
        return all
      }
      throw 'distinctAndCount fields could not be objects: ' + tojson(r.values)
    }, {})
  }
  return it
}
