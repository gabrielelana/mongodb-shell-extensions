/* global shellHelper, __prettyShell:true */

__prettyShell = false

shellHelper.pretty = function() {
  __prettyShell = true
  print('pretty printing: enabled');
}

shellHelper.ugly = function() {
  __prettyShell = false
  print('pretty printing: disabled');
}
