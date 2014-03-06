/* global tocsv */

assert.that('CSV constructor should have a name', function(c) {
  assert.eq(tocsv([{a:1}]).constructor.name, 'CSV')
})
