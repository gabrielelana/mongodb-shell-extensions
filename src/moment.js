/* global _:true */

moment.yesterday = function() {return moment.utc().subtract(1, 'day').startOf('day')}
moment.today = function() {return moment.utc().startOf('day')}
moment.now = function() {return moment.utc()}
moment.tomorrow = function() {return moment.utc().add(1, 'day').startOf('day')}

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
  Number.prototype.years = Number.prototype.year = function() {return moment.duration(this.valueOf(), 'years')}
  Number.prototype.months = Number.prototype.month = function() {return moment.duration(this.valueOf(), 'months')}
  Number.prototype.days = Number.prototype.day = function() {return moment.duration(this.valueOf(), 'days')}
  Number.prototype.minutes = Number.prototype.minute = function() {return moment.duration(this.valueOf(), 'minutes')}
  Number.prototype.seconds = Number.prototype.second = function() {return moment.duration(this.valueOf(), 'seconds')}
})()


;(function(Moment) {

  Moment.prototype.toString = function() {
    return this.clone().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  Moment.prototype.tojson = function() {
    return '"' + this.toString() + '"'
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
    return moment().range(momentInTime, moment(momentInTime).add(this))
  }

  Duration.prototype.endingAt = function(momentInTime) {
    momentInTime = (momentInTime ? moment(momentInTime) : moment.now())
    return moment().range(momentInTime.subtract(this), momentInTime)
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
    this.by(duration.startingAt(this.start), callback)
  }

  DateRange.prototype.toString = function() {
    return [this.start.toString(), this.end.toString()].join('/')
  }

  DateRange.prototype.tojson = function() {
    return '"' + this.toString() + '"'
  }

})(moment().range().constructor)
