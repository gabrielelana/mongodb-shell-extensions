/* global shellHelper, __prettyShell:true, sprintf, rs */

__prettyShell = false

shellHelper.pretty = function() {
  __prettyShell = true
  print('pretty printing: enabled');
}

shellHelper.ugly = function() {
  __prettyShell = false
  print('pretty printing: disabled');
}

shellHelper.so = function() {
  rs.slaveOk()
}

;(function() {

  shellHelper.databases = shellHelper.dbs = shellHelper.d = function() {
    var currentDbName = db.getName()
    var highlight = function(string) {
      return String.fromCharCode(0x1B) + '[32;1m' + string + String.fromCharCode(0x1B) + '[0m'
    }
    db.getMongo().getDBs().databases.forEach(function(d) {
      var numberOfCollections = db.getMongo().getDB(d.name).getCollectionNames().length
      print(
        sprintf(d.name === currentDbName ? highlight('%-30s\t%s') : '%-30s\t%s',
          d.name,
          ((d.sizeOnDisk > 1) ?
            numberOfCollections + '/' + bytesToSize(d.sizeOnDisk) :
            '(empty)'
          ))
      );
    })
  }

  shellHelper.collections = shellHelper.colls = shellHelper.c = function() {
    db.getCollections().forEach(function(c) {
      print(
        sprintf('%-30s\t%s', c.getName(),
          ((c.totalSize() > 0) ?
            c.count() + '/' + bytesToSize(c.totalSize()) :
            '(empty)'
          ))
      );
    })
  }


  function bytesToSize(bytes, precision) {
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    precision = precision || 0

    if ((bytes >= 0) && (bytes < kilobyte)) {
      return bytes + 'B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
      return (bytes / kilobyte).toFixed(precision) + 'KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
      return (bytes / megabyte).toFixed(precision) + 'MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
      return (bytes / gigabyte).toFixed(precision) + 'GB';

    } else if (bytes >= terabyte) {
      return (bytes / terabyte).toFixed(precision) + 'TB';

    } else {
      return bytes + 'B';
    }
  }
})()
