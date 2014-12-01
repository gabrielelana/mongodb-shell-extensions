DBQuery.prototype.tocsv = function() {
  return tocsv(this)
}

DBQuery.prototype.printcsv = function() {
  return printcsv(this)
}

var CSV = (function(CSV) {

  CSV = function CSV(lines) {
    this.lines = lines
  }

  CSV.prototype.shellPrint = function() {
    this.lines.forEach(function(line) {
      print(line)
    })
  }

  ;_([
    'all', 'any', 'at', 'collect', 'contains', 'countBy', 'detect', 'each', 'eachRight', 'every',
    'filter', 'find', 'findLast', 'findWhere', 'foldl', 'foldr', 'forEach', 'forEachRight',
    'groupBy', 'include', 'indexBy', 'inject', 'invoke', 'map', 'max', 'min', 'pluck', 'reduce',
    'reduceRight', 'reject', 'sample', 'select', 'shuffle', 'size', 'some', 'sortBy', 'toArray',
    'where', 'compact', 'difference', 'drop', 'findIndex', 'findLastIndex', 'first', 'flatten',
    'head', 'indexOf', 'initial', 'intersection', 'last', 'lastIndexOf', 'object', 'pull',
    'range', 'remove', 'rest', 'sortedIndex', 'tail', 'take', 'union', 'uniq', 'unique',
    'unzip', 'without', 'xor', 'zip', 'zipObject'
  ]).forEach(function(method) {
    CSV.prototype[method] = function() {
      return _[method].apply(_, [this.lines].concat(_.toArray(arguments)))
    }
  })

  CSV.prototype.toString = function() {
    return this.lines.join('\n')
  }

  return CSV
})()


var printcsv = function(x) {
  tocsv(x).forEach(function(line) {
    print(line)
  })
}

var tocsv = (function() {
  var flatten = function(o) {
    return _.reduce(o, function(flattened, value, field) {
      if (_.isPlainObject(value)) {
        _.forEach(flatten(value), function(nestedValue, nestedField) {
          flattened[[field, nestedField].join('.')] = nestedValue
        })
      } else {
        flattened[field] = value
      }
      return flattened
    }, {})
  }

  return function(x) {
    var lines = [],
        fieldNames = {},
        encodedDocuments = x.map(function(doc) {
          return _.reduce(flatten(doc), function(values, value, field) {
            fieldNames[field] = true
            values[field] = tojson(value).replace(
              /^(?:ISODate|ObjectId)\((.*)\)$/,
              function(_, contentAsString) {
                return contentAsString
              }
            )
            return values
          }, {})
        })

    fieldNames = _.keys(fieldNames)

    lines.push(fieldNames.join(','))
    encodedDocuments.forEach(function(encodedDocument) {
      lines.push(
        fieldNames.map(function(fieldName) {
          if (encodedDocument[fieldName] !== undefined) {
            return encodedDocument[fieldName]
          }
          return ''
        }).join(',')
      )
    })

    return new CSV(lines)
  }
})()
