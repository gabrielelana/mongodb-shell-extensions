/* global tocsv, flatten */

assert.that('CSV constructor should have a name', function(c) {
  assert.eq(tocsv([{a:1}]).constructor.name, 'CSV')
})

assert.that('CSV first line contains field names', function(c) {
  assert.eq(tocsv([{a:1}]).lines[0], 'a')
  assert.eq(tocsv([{a:1, b: 2}]).lines[0], 'a,b')
})

assert.that('CSV documents could have different fields', function(c) {
  assert.eq(tocsv([{a:1}, {b:2}]).lines[0], 'a,b')
  assert.eq(tocsv([{a:1}, {b:2}]).lines[1], '1,')
  assert.eq(tocsv([{a:1}, {b:2}]).lines[2], ',2')
})

assert.that('CSV support nested fields', function(c) {
  assert.eq(tocsv([{a:{b:2}}]).lines[0], 'a.b')
  assert.eq(tocsv([{a:{b:2}}]).lines[1], '2')
  assert.eq(tocsv([{a:{b:2,c:3}}]).lines[0], 'a.b,a.c')
  assert.eq(tocsv([{a:{b:2,c:3}}]).lines[1], '2,3')
})
