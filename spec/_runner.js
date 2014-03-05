/* global listFiles, load, assert: true */

var files = listFiles('.'),
    startedAt = new Date(),
    testFilesToSkip = []


assert.that = function(testDescription, testCase) {
  assert(
    'test' === db.getName(),
    'You cannot run this tests in db \'' + db.getName() + '\'.\n' +
    'Retry with `mongo --quiet _runner.js`'
  )
  var runInCollection = db.getCollection('mongodb-shell-extensions')
  runInCollection.drop()
  testCase(runInCollection, db)
}

files.forEach(function(x) {
  var testFileName = x.name.replace(/^\.\//, '')
  if (/[\/\\]_/.test(x.name) || !/\.js$/.test(x.name) || testFilesToSkip.indexOf(testFileName) >= 0) {
    return print(' ### skipping: ' + testFileName)
  }
  print(' >>> running: ' + testFileName + '... ok! in ' + Date.timeFunc(function() {load(x.name)}, 1) + 'ms')
})

var endedAt = new Date()

print('time: ' + ((endedAt.getTime() - startedAt.getTime()) / 1000 ) + 's')
