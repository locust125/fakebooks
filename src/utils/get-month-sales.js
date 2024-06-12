import UtilDates from "./util-dates";
export const getDaysInMonth = (month, year) => {
    const daysOfMonth = UtilDates.daysInMonth(month, year);
    const res = [...Array(daysOfMonth).keys()].map(d=> d + 1);
    return res;
}
export const getMonthSales = (sales = [], month, year) => {
  if (!month) {
    return [];
  } 
  const daysOfMonth = UtilDates.daysInMonth(month, year);
  const values = [...Array(daysOfMonth).keys()];
  const r = values.map((v) => {
    const sale = sales.find((x) => {
      const d = new Date(x.date).getDate();
      return d === v+1 ? x.total : 0;
    }); 
    if(!sale)
    {
        return 0;
    }
    return sale.total ?? 0;
  });
  return r;
};
