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

;(function() {

  shellHelper.d = function() {
    var collections = db.getMongo().getDBs().databases.forEach(function(d) {
      var numberOfCollections = db.getMongo().getDB(d.name).getCollectionNames().length
      print(
        d.name + '\t' +
        ((d.sizeOnDisk > 1) ?
          numberOfCollections + '/' + bytesToSize(d.sizeOnDisk) :
          '(empty)'
        )
      );
    })
  }

  shellHelper.c = function() {
    db.getCollections().forEach(function(c) {
      print(
        c.getName() + '\t' +
        ((c.totalSize() > 0) ?
          c.count() + '/' + bytesToSize(c.totalSize()) :
          '(empty)'
        )
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
