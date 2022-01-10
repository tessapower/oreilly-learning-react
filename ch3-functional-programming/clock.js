// A ticking clock that displays hours, minutes, seconds, and time of day in
// civilian time.

const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = message => console.log(message);

// Takes a date object nd returns an object for clock time that contains hours,
// minutes, and seconds.
const serializeClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds()
});

// Takes the clock time object and returns an object where hours are converted
// to civilian time, e.g. 1300 -> 1:00.
const civilianHours = clockTime => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours
});

// Takes the clock time object and appends time of day (AM or PM) to that object.
const appendAMPM = clockTime => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? "PM" : "AM"
});

// Takes the target function and returns a function that will send a time to the
// target.
const display = target => time => target(time);

// Takes a template string and uses it to return clock time formatted based on
// the criteria from the string.
const formatClock = format => time =>
  format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);

// Takes an object's key as an argument and prepends a zero to the value stored
// under that object's key. It takes in a key to a specific field and prepends
// values with a zero if the value is less than 10.
const prependZero = key => clockTime => ({
  ...clockTime,
  key: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
});

const compose = (...fns) => arg =>
  fns.reduce((composed, f) => f(composed), arg);

// Takes clock time as an argument and transforms it into civilian time by using
// both civilian hours.
const convertToCivilianTime = clockTime =>
  compose(
    appendAMPM,
    civilianHours
  )(clockTime);

// Takes civilian clock time and makes sure the hours, minutes, and seconds
// display double digits by prepending zeroes where needed.
const doubleDigits = civilianTime =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime);

// Starts the clock by setting an interval that invokes a callback every second.
const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock("hh:mm:ss tt"),
      display(log)
    ),
    oneSecond()
  );

startTicking();

// Non-functional Approach
/*
// Log Clock Time every second
setInterval(logClockTime, 1000);

function logClockTime() {
  // Get Time string as civilian time
  let time = getClockTime();

  // Clear the console and log the time
  console.clear();
  console.log(time);
}

function getClockTime() {
  // Get the current time
  let date = new Date();
  let time = "";

  // Serialize clock time
  time = {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    ampm: "AM"
  };

  // Convert to civilian time
  if (time.hours == 12) {
    time.ampm = "PM";
  } else if (time.hours > 12) {
    time.ampm = "PM";
    time.hours -= 12;
  }

  // Prepend a 0 on the hours to make double digits
  if (time.hours < 10) {
    time.hours = "0" + time.hours;
  }

  // Prepend a 0 on the minutes to make double digits
  if (time.minutes < 10) {
    time.minutes = "0" + time.minutes;
  }

  // Prepend a 0 on the seconds to make double digits
  if (time.seconds < 10) {
    time.seconds = "0" + time.seconds;
  }

  // Format the clock time as a string "hh:mm:ss tt"
  return time.hours + ":" + time.minutes + ":" + time.seconds + " " + time.ampm;
}
*/
