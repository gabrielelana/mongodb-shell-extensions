# MongoDB Shell Extensions
Collection of utilities to make the life inside of the MongoDB shell a little bit easier

[![Build Status](https://travis-ci.org/gabrielelana/mongodb-shell-extensions.png?branch=master)](https://travis-ci.org/gabrielelana/mongodb-shell-extensions)

# Quick Examples
You have a collection `visits` like that
```js
> db.visits.findOne()
{
	"_id" : "a0039342e1cda7446cbb55aac2108491-20140306",
	"at" : ISODate("2014-03-06T11:04:59.524Z"),
	"digest" : "a0039342e1cda7446cbb55aac2108491",
	"duration" : 150,
	"hits" : 5,
	"url" : "http://roob.biz/pearline"
}
```
You need to find how many visits there have been in the last 10 day... You know that dealing with dates is a mess, unless you have loaded the mighty `MongoDB Shell Extensions` in that case your life would be much, much easier
```js
> moment.last(10).days().forEach('day', function(m) {
>   print(m.format('YYYYDDMM') + ': ' + db.visits.count({at: moment.$inDay(m)}))
> })

20140224: 153
20140225: 228
20140226: 228
20140227: 209
20140228: 246
20140301: 247
20140302: 243
20140303: 240
20140304: 208
20140305: 139
20140306: 204
```
You will have helpful output
```js
> moment.last(10)
10 of what?
> moment.last(10).days()
"2014-02-24T11:36:50.509Z/2014-03-06T11:36:50.509Z"
```
You will have various helpful methods to reduce query verbosity
```js
// Suppose we have a day d
> d
ISODate("2014-03-06T11:49:12.383Z")
> startOfDay = ISODate(d.toISOString())
> startOfDay.setUTCHours(0)
> startOfDay.setUTCMinutes(0)
> startOfDay.setUTCSeconds(0)
> startOfDay.setUTCMicroseconds(0)
> endOfDay = ISODate(d.toISOString())
> endOfDay.setUTCHours(23)
> endOfDay.setUTCMinutes(59)
> endOfDay.setUTCSeconds(59)
> endOfDay.setUTCMilliseconds(999)
> db.visits.count({at: {$gte: startOfDay, $lte: endOfDay}})
204

// YUCK! Can we do better?
// Yes, using dates manipulation functions
> db.visits.count({at: {
>   $gte: moment(d).startOf('day').toDate(),
>   $lte: moment(d).endOf('day').toDate()}
> })
204

// Can we do better?
// Yes, using moment.$between to generate $gte and $lte range
> db.visits.count({
>   at: moment.$between(
>     moment(d).startOf('day'),
>     moment(d).endOf('day'))
>   }
> )
204

// Can we do better?
// Yes, using moment.$inDay to use moment.$between and call startOf('day') and endOf('day')
> db.visits.count({at: moment.$inDay(d)})
204

// WOW! That's what I call an improvement!
```
Be mind, we only have scratched the surface of what we can do

# How to Install
Download `mongorc.js` from the latest [release](https://raw.github.com/gabrielelana/mongodb-shell-extensions/master/released/mongorc.js) and copy it into your home directory as `.mongorc`
```
curl -sL https://raw.github.com/gabrielelana/mongodb-shell-extensions/master/released/mongorc.js | ~/.mongorc
```
Or if you want you can install it using npm (N.B. This is going to install a bunch of dependencies, if you care about your disk space then prefer the first option)
```
npm install --global mongodb-shell-extensions
```

Now you have a `.mongorc` file in your home directory that contains all the extensions. This file will be loaded automatically in the next MongoDB shell session

The next time you'll start a MongoDB shell you should see a message like this (the message will not be displayed if the shell is in quiet mode `mongo --quiet`)
```
$ mongo
MongoDB shell version: 2.4.8
connecting to: test
+ MongoDB Shell Extensions by Gabriele Lana <gabriele.lana@gmail.com>
>
```

# How to Temporary Disable
If you want to temporary disable the extensions you can start the MongoDB shell with the `--norc` flag
```
$ mongo --norc
MongoDB shell version: 2.4.8
connecting to: test
>
```

# How to Uninstall
Remove `.mongorc` from your home directory
```
$ rm ~/.mongorc
```

# Documentation
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
