# MongoDB Shell Extensions [![Build Status](https://travis-ci.org/gabrielelana/mongodb-shell-extensions.svg?branch=master)](https://travis-ci.org/gabrielelana/mongodb-shell-extensions)

Collection of utilities to make the life inside of the MongoDB shell a little bit easier

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
curl -sL https://raw.github.com/gabrielelana/mongodb-shell-extensions/master/released/mongorc.js > ~/.mongorc
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


# Thanks To
This is really a bunch of wonderful open source projects put together with a little glue, so, many thanks to:
* [MomentJS](http://momentjs.com/) with [DateRange](https://github.com/gf3/moment-range) plugin
* [LoDash](http://lodash.com/)
* [JSONPath](http://code.google.com/p/jsonpath/)
* [sprintf.js](https://github.com/alexei/sprintf.js)


# Documentation
Sorry, this is a work in progress, in the meantime, if you don't find what you are looking for _"look at the source Luke"_ or drop me an email :wink:
* [`DB#getCollections()`](#DB-getCollections) - get all collections in current db
* [`Collection#distinctAndCount()`](#Collection-distinctAndCount) - count how many distinct values
* [`Collection#first()`](#Collection-first) - first element inserted in collection
* [`Collection#last()`](#Collection-last) - last element inserted in collection
* [`Query#first()`](#Query-first) - return only the first element in result
* [`Query#last()`](#Query-last) - return only the last element in result
* [`Query#reverse()`](#Query-reverse) - reverse query sort order
* [`Query#tojson()`](#Query-tojson) - serialize query result using json format
* [`CSV Support`](#CSV)
  * [`tocsv(x)`](#tocsv) - serialize `x` using csv format
  * [`printcsv(x)`](#printcsv) - print `x` using csv format
  * [`Query#tocsv()`](#Query-tocsv) - serialize query result using csv format
  * [`Query#printcsv()`](#Query-printcsv) - print query result using csv format
* [`JSONPath Support`](#JSONPath)
  * [`Query#select(x)`](#Query-select) - filter result using jsonpath expression `x`
  * [`jsonpath(o, x)`](#jsonpath) - filter object `o` using jsonpath expression `x`
* [`Temporary Collections`](#TemporaryCollections)
  * [`DB#collection(f)`](#DB-collection) - creates a temporary collection that will be available to `f` and automatically destroyed immediately after
  * [`DB#getTemporaryCollections()`](#DB-getTemporaryCollections) - get all temporary collections
  * [`DB#dropTempraryCollections()`](#DB-dropTempraryCollections) - drop all temporary collections
  * [`Collection#isTemporary`](#Collection-isTemporary) - returns true if the collection is temporary
* [`Storable Cursors`](#StorableCursors)
  * [`Query#save(c)`](#Query-save) - save the query result into a collection `c`
* [`LoDash Integration`](#LoDash)
* [`MomentJS Integration`](#MomentJS)

<a name="DB-getCollections" />
### `DB#getCollections()`
Returns an array of all collection instances
```js
> db.getCollections().map(function(c) {return c.count()})
[ 5793, 4, 1003, 4373 ]
```

<a name="Collection-distinctAndCount" />
### `Collection#distinctAndCount(field, query)`
For each distinct value of `field` counts the occurrences in documents optionally filtered by `query`
```js
> db.users.distinctAndCount('name', {name: /^a/i})
{
  "Abagail": 1,
  "Abbey": 3,
  "Abbie": 1,
  "Abdiel": 2,
  "Abdullah": 1,
  "Adah": 1,
  "Adalberto": 5,
  "Adela": 1,
  ...
}
```
The `field` parameter could be an array of fields
```js
> db.users.distinctAndCount(['name','job'], {name: /^a/i})
{
  "Austin,Educator" : 1,
  "Aurelia,Educator" : 1,
  "Augustine,Carpenter" : 1,
  "Augusta,Carpenter" : 2,
  "Audreanne,Zoologist" : 1,
  "Audreanne,Farmer" : 1,
  "Aubree,Lawyer" : 1,
  ...
}
```

<a name="Collection-first" />
### `Collection#first(n)`
Returns the first n (ordered by `_id`) elements inserted in the collection
```js
> db.users.first().length()
1
> db.users.first(3).length()
3
```

<a name="Collection-last" />
### `Collection#last(n)`
Returns the last n (ordered by `_id`) elements inserted in the collection
```js
> db.users.save({name: "Gabriele", surname: "Lana", job: "Software Craftsman"})
> db.users.last().pretty()
{
  "_id" : ObjectId("531879529c812de54e6711e1"),
  "name" : "Gabriele",
  "surname" : "Lana",
  "job" : "Software Craftsman"
}
```

<a name="Query-first" />
### `Query#first()`
Same as [`Collection#first()`](#Collection-first)

<a name="Query-last" />
### `Query#last()`
Same as [`Collection#last()`](#Collection-last)

<a name="Query-reverse" />
### `Query#reverse()`
Reverse the order of the cursor
```js
> db.users.first()._id === db.users.find().reverse().last()._id
true
```

<a name="Query-tojson" />
### `Query#tojson()`



<a name="CSV" />
## `CSV`

<a name="tocsv" />
### `tocsv(x)`
Returns a `CSV` instance which is a collections of lines. The first line is the CSV header with the union of all the fields found in all the documents. The other lines are the CSV representation of the documents, one document per line. `CSV` inherits most of the collection methods implemented in `LoDash`
```js
> tocsv(db.users.find({name: /^a/i}))
_id,name,surname,job
"5318565aca4f6f419b00001e","Abagail","Crona","Zoologist"
"5318565aca4f6f419b000007","Abbey","Tromp","Writer"
"5318565aca4f6f419b0000da","Abbie","Wilkinson","Carpenter"
"5318565aca4f6f419b00007a","Abdiel","Schuster","Educator"
"5318565aca4f6f419b0002d1","Abdiel","Schneider","Librarian"
"5318565aca4f6f419b00030d","Abdullah","Baumbach","Librarian"
"5318565aca4f6f419b0000dc","Adah","Lind","Dancer"
"5318565aca4f6f419b0002ed","Adalberto","Reynolds","Librarian"
"5318565aca4f6f419b000066","Adela","Keebler","Educator"
"5318565aca4f6f419b0002d2","Adolf","Boyer","Farmer"
...
```
This is the same result of `printcsv` but don't be fooled, the shell calls `shellPrint()` method on every object that needs to be displayed by the shell itself, `shellPrint()` will print the `CSV` instance exactly as `printjson` would but you can do other things beside printing it
```js
> tocsv(db.users.find({name: /^a/i})).head()
_id,name,surname,job
// sample will return a random line
> tocsv(db.users.find({name: /^a/i})).sample()
"5318565aca4f6f419b000098","Arlo","Huels","Lawyer"
```
It will work with everything has a `map` method
```js
> tocsv([{name: "Gabriele", surname: "Lana"}])
name,surname
"Gabriele","Lana"
```

<a name="printcsv" />
### `printcsv(x)`
It will print each line of the CSV returned by `tocsv()`. This is useful when you want to export redirecting the output. Unfortunately `--eval` option will be evaluated **before** any script so it cannot be used to execute something defined in your `~/.mongorc.js`
```
$ cat > exportUsersToCSV.js <<SCRIPT
heredoc> printcsv(db.users.find())
heredoc> SCRIPT
$ mongo db-with-users --quiet ~/.mongorc.js ./exportUsersToCSV.js | tail -n +3 > users.csv
```

<a name="Query-tocsv" />
### `Query#tocsv()`
Same as `tocsv()` but called on a query
```js
> db.users.find().tocsv()
// It's the same as
> tocsv(db.users.find())
```

<a name="Query-printcsv" />
### `Query#printcsv()`
Same as `printcsv()` but called on a query
```js
> db.users.find().printcsv()
// It's the same as
> printcsv(db.users.find())
```



<a name="JSONPath" />
## `JSONPath Support`



<a name="TemporaryCollections" />
## `Temporary Collections`



<a name="StorableCursors" />
## `Storable Cursors`



<a name="LoDash" />
## `LoDash Integration`



<a name="MomentJS" />
## `MomentJS Integration`
