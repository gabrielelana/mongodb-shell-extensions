
moment.yesterday = function() {return moment.utc().subtract(1, 'day').startOf('day')}
moment.today = function() {return moment.utc().startOf('day')}
moment.now = function() {return moment.utc()}
moment.tomorrow = function() {return moment.utc().add(1, 'day').startOf('day')}

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
  var applyLater = function(duration) {
    return {
      ago: function(now) {return (now || moment.now()).subtract(duration)},
      since: function(now) {return (now || moment.now()).add(duration)},
      duration: duration
    }
  }

  Number.prototype.years = Number.prototype.year = function() {return applyLater(moment.duration(this.valueOf(), 'years'))}
  Number.prototype.months = Number.prototype.month = function() {return applyLater(moment.duration(this.valueOf(), 'months'))}
  Number.prototype.days = Number.prototype.day = function() {return applyLater(moment.duration(this.valueOf(), 'days'))}
  Number.prototype.minutes = Number.prototype.minute = function() {return applyLater(moment.duration(this.valueOf(), 'minutes'))}
  Number.prototype.seconds = Number.prototype.second = function() {return applyLater(moment.duration(this.valueOf(), 'seconds'))}
})()


;(function(Moment) {

  Moment.prototype.tojson = function() {
    return '"' + this.clone().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') + '"'
  }

})(moment().constructor)


;(function(Duration) {

  Duration.prototype.startingNow = function() {
    return this.startingAt(moment.now())
  }

  Duration.prototype.endingNow = function() {
    return this.endingAt(moment.now())
  }

  Duration.prototype.startingAt = function(momentInTime) {
    return moment().range(momentInTime, momentInTime.clone().add(this))
  }

  Duration.prototype.endingAt = function(momentInTime) {
    return moment().range(momentInTime.clone().subtract(this), momentInTime)
  }

})(moment.duration().constructor)


;(function(DateRange) {
  
  DateRange.prototype.forEach = function(duration, callback) {
    duration = (typeof duration === 'string') ? moment.duration(1, duration) : duration
    this.by(duration.startingAt(this.start), callback)
  }

})(moment().range().constructor)
