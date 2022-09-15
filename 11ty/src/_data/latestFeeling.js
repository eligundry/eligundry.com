const feelingsFetch = require("./feelings");

module.exports = async function () {
  const feelings = await feelingsFetch();
  return feelings[0];
};
