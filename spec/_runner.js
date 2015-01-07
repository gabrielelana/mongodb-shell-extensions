/* global listFiles, load, assert, doassert */

var files = listFiles('.'),
    startedAt = new Date(),
    testFilesToSkip = []

if (db) {
  print(' ### MongoDB(' + db.version() + ')')
}

assert.that = function(description, assertion, tearDown) {
  assert(
    'test' === db.getName(),
    'You cannot run this tests in db \'' + db.getName() + '\'.\n' +
    'Retry with `mongo --quiet _runner.js`'
  )
  var context = {}, runInCollection = db.getCollection('mongodb-shell-extensions')
  runInCollection.drop()
  try {
    assertion.call(context, runInCollection, db)
  } finally {
    if (tearDown) {
      tearDown.call(context, runInCollection, db)
    }
  }
}

if (!assert.doesNotThrow) {
  assert.doesNotThrow = function(func, params, msg) {
    if (assert._debug && msg) {
      print('in assert for: ' + msg);
    }
    if (params && typeof(params) === 'string') {
      throw ('2nd argument to assert.throws has to be an array, not ' + params);
    }
    try {
      func.apply(null, params);
    }
    catch (e) {
      doassert('threw unexpected exception: ' + e + ' : ' + msg);
    }
    return;
  };
}

_(files).sortBy('name').forEach(function(x) {
  var testFileName = x.name.replace(/^\.\//, '')
  if (/[\/\\]_/.test(x.name) || !/\.js$/.test(x.name) || testFilesToSkip.indexOf(testFileName) >= 0) {
    return print(' ### skipping: ' + testFileName)
  }
  print(' >>> running: ' + testFileName + '... ok! in ' + Date.timeFunc(function() {load(x.name)}, 1) + 'ms')
})

var endedAt = new Date()

print('time: ' + ((endedAt.getTime() - startedAt.getTime()) / 1000 ) + 's')
