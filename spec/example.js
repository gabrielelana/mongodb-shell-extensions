assert.that('1+1 should be 2', function(c) {
  assert.eq(2, 1+1)
})

assert.that(
  'tearDown will be called',
  function(c) {
    this.originalAssertEqual = assert.eq
    assert.eq = false
  },
  function(c) {
    assert.eq = this.originalAssertEqual
  }
)

assert.that('previous tearDown was called', function(c) {
  assert.neq(false, assert.eq, 'previous tearDown was not called')
})
