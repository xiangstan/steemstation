export default class MngDates {
  // get this year
  ThisYear() {
    return this.Today().getFullYear();
  }
  // current datetime
  Today() {
    return new Date();
  }
}
