# MongoDB Shell Extensions
Collection of utilities to make the life inside of the MongoDB shell a little bit easier

# Highlights
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

# How to Install
Download `mongorc.js` from the latest [release](https://github.com/gabrielelana/mongodb-shell-extensions/releases/latest) and copy it into your home directory as `.mongorc`
```
curl -sL https://github.com/gabrielelana/mongodb-shell-extensions/releases/download/0.1.1/mongorc.js | ~/.mongorc
```
Or if you want you can install it using npm (N.B. it will do a complete build and so it needs to install a bunch of packages)
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

# How to Disable
If you want to temporary disable the extensions you can start the MongoDB shell with the `--norc` flag
```
$ mongo --norc
MongoDB shell version: 2.4.8
connecting to: test
>
```

# How to Use
...TODO...
