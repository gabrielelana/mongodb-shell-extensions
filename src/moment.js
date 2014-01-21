/* global _:true */

moment.yesterday = function() {return moment.utc().subtract(1, 'day').startOf('day')}
moment.today = function() {return moment.utc().startOf('day')}
moment.now = function() {return moment.utc()}
moment.tomorrow = function() {return moment.utc().add(1, 'day').startOf('day')}

moment.INTERVALS = ['year', 'month', 'day', 'hour', 'minute', 'second', 'years', 'months', 'days', 'hours', 'minutes', 'seconds']

moment.between = function(start, end) {
  return moment().range(start, end)
}

moment.$today = function() {
  return moment.$between(moment.today())
}

moment.$between = function(fromTime, toTime) {
  toTime = toTime || moment.now()
  return {
    '$gte': fromTime.toDate(),
    '$lte': toTime.toDate()
  }
}

moment.$inDay = function(aDay) {
  return {
    '$gte': moment(aDay).startOf('day').toDate(),
    '$lte': moment(aDay).endOf('day').toDate()
  }
}


;(function() {
  moment.last = dateRangeFromIntervalOfTime(function(quantity, interval) {
    return function() {
      return moment.between(moment.now().subtract(quantity, interval), moment.now())
    }
  })

  moment.next = dateRangeFromIntervalOfTime(function(quantity, interval) {
    return function() {
      return moment.between(moment.now(), moment.now().add(quantity, interval))
    }
  })

  function dateRangeFromIntervalOfTime(apply) {
    return function(quantity) {
      var asString = function() {return quantity + ' of what?'}
      return _.inject(
        moment.INTERVALS,
        function(proxy, interval) {
          return _.tap(proxy, function() {
            proxy[interval] = apply(quantity, interval)
          })
        },
        {toString: asString, tojson: asString}
      )
    }
  }
})()


;(function() {
  moment.INTERVALS.forEach(function(interval) {
    Number.prototype[interval] = function() {return moment.duration(this.valueOf(), interval)}
  })
})()


;(function(Moment) {

  Moment.prototype.toString = function() {
    return this.clone().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  Moment.prototype.tojson = function() {
    return '"' + this.toString() + '"'
  }

  Moment.prototype.tillNow = Moment.prototype.toNow = function() {
    return this.to(moment.now())
  }

  Moment.prototype.to = function(momentInTime) {
    momentInTime = momentInTime || moment.now()
    if (this.isAfter(momentInTime)) {
      return moment.between(momentInTime, this)
    }
    return moment.between(this, momentInTime)
  }

})(moment().constructor)


;(function(Duration) {

  Duration.prototype.startingNow = function() {
    return this.startingAt(/* now is implicit */)
  }

  Duration.prototype.endingNow = function() {
    return this.endingAt(/* now is implicit */)
  }

  Duration.prototype.startingAt = function(momentInTime) {
    momentInTime = (momentInTime ? moment(momentInTime) : moment.now())
    return moment.between(momentInTime, moment(momentInTime).add(this))
  }

  Duration.prototype.endingAt = function(momentInTime) {
    momentInTime = (momentInTime ? moment(momentInTime) : moment.now())
    return moment.between(momentInTime.subtract(this), momentInTime)
  }

  Duration.prototype.since = function() {
    return this.after(/* now is implicit */)
  }

  Duration.prototype.ago = function() {
    return this.before(/* now is implicit */)
  }

  Duration.prototype.after = function(momentInTime) {
    momentInTime = (momentInTime ? moment(momentInTime) : moment.now())
    return momentInTime.add(this)
  }

  Duration.prototype.before = function(momentInTime) {
    momentInTime = (momentInTime ? moment(momentInTime) : moment.now())
    return momentInTime.subtract(this)
  }

  Duration.prototype.toString = Duration.prototype.humanize
  Duration.prototype.tojson = function() {
    return '"' + this.toString.apply(this, arguments) + '"'
  }

})(moment.duration().constructor)


;(function(DateRange) {
  
  DateRange.prototype.forEach = function(duration, callback) {
    duration = (typeof duration === 'string') ? moment.duration(1, duration) : duration
    if (!callback) {
      var moments = []
      this.by(duration.startingAt(this.start), function(moment) {
        moments.push(moment)
      })
      moments._ = _(moments)
      return moments
    }
    this.by(duration.startingAt(this.start), callback)
  }

  DateRange.prototype.duration = function() {
    return moment.duration(this.start.diff(this.end))
  }

  DateRange.prototype.toString = function() {
    return [this.start.toString(), this.end.toString()].join('/')
  }

  DateRange.prototype.tojson = function() {
    return '"' + this.toString() + '"'
  }

})(moment().range().constructor)
