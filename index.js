const service = require("./lib/index");


function getMethod(queryString) {
  const findRegex = /\bfind\s*\(/;
  const findOneRegex = /\bfindOne\s*\(/;
  const aggregateRegex = /\baggregate\s*\(/;

  // Check for matches
  if (findRegex.test(queryString)) {
    console.log("The method used is: find");
    return "find";
  } else if (findOneRegex.test(queryString)) {
    console.log("The method used is: findOne");
    return "findOne";
  } else if (aggregateRegex.test(queryString)) {
    console.log("The method used is: aggregate");
    return "aggregate";
  } else {
    console.log("Method not detected.");
  }
}

async function convert(queryString) {
  const match = queryString.split(".");
  const collectionName = match[1];

  if (match.length > 0) {
    // Regular expressions to match find, findOne, and aggregate
    const method = getMethod(queryString);
    let query = null;
    let limit = null;
    let sort = null;
    let pipeline = null;
    let projection = null;
    if (method !== "aggregate") {
      const entities = await service.getQueryEntities(queryString);
      query = entities.query;
      (limit = entities.limit), (sort = entities.sort);
      projection = entities.projection;
    } else {
      pipeline = await service.getAggregatePipeline(queryString);
    }
    return {
      collectionName,
      method,
      query,
      limit,
      sort,
      projection: null,
      pipeline,
    };
  }
}
module.exports = { convert };