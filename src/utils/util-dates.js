export default class UtilDates {
  static getFirstDayOfCurrentMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  static getLastDayOfCurrentMonth() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, Utils.daysInMonth(month, year));
  }
  static daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
}
