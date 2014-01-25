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
* `se.collection` could take the current db connection an optional argument
* Chainable cursors saving in temporary collections `cursor.find(query)` same as 
  ```
  se.collection(function(c) {
    return cursor.save(c).find(query)
  })
  ```
* Execute same query on multiple collections and merge the results (scatter & gather)
