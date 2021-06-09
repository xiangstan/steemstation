// convert time
export function cvtTime(time) {
  const temp = new Date(time +".000Z");
  return temp.getFullYear() + "-" + ("0" + (temp.getMonth() + 1)).slice(-2) + "-" + ("0" + temp.getDate()).slice(-2) + " " + ("0" + temp.getHours()).slice(-2) + ":" + ("0" + temp.getMinutes()).slice(-2);
}

// current datetime
export function isToday() {
  return new Date();
}

// get this year
export function thisYear() {
  return new Date().getFullYear();
}
