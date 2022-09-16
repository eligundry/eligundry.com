const dateFns = require("date-fns");

module.exports = function formatDate(date, format) {
  switch (format) {
    case "iso8601-date":
      return dateFns.formatISO(date, { representation: "date" });
    case "iso8601":
      return dateFns.formatISO(date);
    case "month-year":
      return dateFns.format(date, "MMMM yyyy");
  }
};
