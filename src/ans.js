/* global shellPrintHelper:true, ___ans___: true, shellHelper */

shellHelper.ans = function() {
  if (typeof(___ans___) === 'undefined' || ___ans___ === null) {
    print('no last answer')
    return
  }
  return ___ans___
}

shellPrintHelper = (function(shellPrintHelper) {
  return function(x) {
    ___ans___ = x
    return shellPrintHelper.call(this, x)
  }
})(shellPrintHelper)
