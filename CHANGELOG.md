# Release 0.3.0
* Update `lodash` to ^4.17

# Release 0.2.9
* Update `moment` to ~2.10
* Add `moment-timezone`

# Release 0.2.8
* command `d` to list databases
* command `c` to list collections
* command `pretty` to switch to pretty print mode
* command `ugly` to switch off from pretty print mode
* command `so` to enable read on slave nodes

# Release 0.2.7
* `DBCollection.distinctAndCount` on null fields

# Release 0.2.6
* `DBQuery#reverse` more robust and compatible with 0.2.2, 0.2.4 and 0.2.6

# Release 0.2.5
* `DBCollection.distinctAndCount` on array fields
* `DBCollection.distinctAndCount` on primitive like (ex. `Number`, `ISODate`, …) fields

# Release 0.2.4
* `toCSV` support for documents with nested fields

# Release 0.2.3
* Support aggregate framework changes in 2.6

# Release 0.2.2
* Add release version in startup message

# Release 0.2.0
* `DBCollection.distinctAndCount` on multiple fields

# Release 0.1.5
* Fixed CSV constructor without a name

# Release 0.1.4
* Initial documentation
* Fixed spec run on Travis

# Release 0.1.3
* Fixed npm install process

# Release 0.1.2
* Setup spec harness
* Setup continuous integration with `travis-ci`
* User install process doesn't require to build the whole thing

# Release 0.1.1
* Fixed release process

# Release 0.1.0
* `DB#getCollections` - get all collections in current db
* `Collection#distinctAndCount` - count how many distinct values
* `Collection#first` - first element inserted in collection
* `Collection#last` - last element inserted in collection
* `Query#reverse` - reverse query sort order
* `Query#first` - return only the first element in result
* `Query#last` - return only the last element in result
* `Query#tojson` - serialize query result using json format
* CSV support
  * `Query#tocsv` - serialize query result using csv format
  * `Query#printcsv` - print query result using csv format
  * `tocsv(x)` - serialize `x` using csv format
  * `printcsv(x)` - print `x` using csv format
* JSONPath support
  * `Query#select(x)` - filter result using jsonpath expression `x`
  * `jsonpath(o, x)` - filter object `o` using jsonpath expression `x`
* Temporary collections
  * `DB#collection(f)` - creates a temporary collection that will be available to `f` and automatically destroyed immediately after
  * `DB#getTemporaryCollections()` - get all temporary collections
  * `DB#dropTempraryCollections()` - drop all temporary collections
  * `Collection#isTemporary` - returns true if the collection is temporary
* Storable cursors
  * `Query#save(c)` - save the query result into a collection `c`
* Better time manipulation support using moment.js library
  * `db.orders.find({created_at: moment.$today()})` - find orders created today, it will generate something like `{$gte: ISODate('2014-02-25'), $lte: ISODate()}`
  * `db.orders.find({created_at: moment.$last(3, 'days')})` - find orders created in the last 3 days
  * `moment.last(30, 'days').forEach('day', function(m) { db.orders.count({created_at: moment.$inDay(m)}) })` - how many orders per day where created in the last 30 days
