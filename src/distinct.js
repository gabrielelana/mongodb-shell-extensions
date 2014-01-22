/* global _:true, DBCollection */

DBCollection.prototype.distinctAndCount = function(field, query) {
  query = query || {}

  var it = this.aggregate(
    {$match: query},
    {$group: {_id: '$' + field, count: {$sum: 1}}},
    {$project: {name: '$_id', count: 1, _id: 0}}
  )
  
  if (it.ok === 1) {
    return _.reduce(it.result, function(all, r) {
      all[r.name] = r.count
      return all
    }, {})
  }
  return it
}
