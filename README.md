# MongoDB Shell Extensions
Simple collection of utilities to make the life inside of the MongoDB shell a little bit easier

# How to Use
...TODO...

# How to Install
You need to have installed the latest version of [NodeJS](http://nodejs.org)
* `npm install --global bower grunt-cli`
* then inside the root directory of this project
  * `npm install`
  * `bower install`
  * `grunt install`

# TODO
* Save query result in a named collection `cursor.save('collection')`
* Chainable cursors saving in temporary collections `cursor.find(query)` same as 
  ```
  Collection.temporary(function(tc) {
    return cursor.save(tc).find(query)
  })
  ```
* Create temporary collections `Collection.temporari([callback])`
* Execute same query on multiple collections and merge the results ala scatter & gather
