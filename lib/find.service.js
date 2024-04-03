const mongoParse = require("./mongo-parse");

async function getQueryEntities(queryString) {
  try {
    //
    let lengthOfLastIndex = 0;
    const limitData = await getLimit(queryString);
    const sortData = await getSort(queryString);
    if (limitData) {
      lengthOfLastIndex = limitData.length + lengthOfLastIndex;
    }
    if (sortData) {
      lengthOfLastIndex = sortData.length + lengthOfLastIndex;
    }
    const projectionData = await getProjection(queryString);
    if (projectionData) {
      lengthOfLastIndex = projectionData.length + lengthOfLastIndex;
    }
    const queryData = await getQuery(queryString, lengthOfLastIndex);
    return {
      query: queryData.query,
      limit: limitData?.limit || null,
      sort: sortData?.sort || null,
      projection:
        projectionData === null
          ? queryData.projection
          : projectionData.projection,
    };
  } catch (error) {
    console.log("error====", error);
  }
  // Regular expressions to match find, findOne, and aggregate
}

function getLimit(queryString) {
  // Regular expression to match the limit part within parentheses
  const limitRegex = /\.limit\(([^)]+)\)/;

  // Match the limit part
  const match = queryString.match(limitRegex);

  if (match) {
    const limit = match[1];
    if (limit) {
      return { limit: parseInt(limit), length: match[1].length + 8 }; // here 8 is .limit() length
    }
    return null;
  } else {
    console.log("Limit not found.");
    return null;
  }
}
async function getProjection(queryString) {
  const Regex = /\.project\(([^)]+)\)/;
  // Match the limit part
  const match = queryString.match(Regex);

  if (match) {
    // Extract the limit
    const projectString = match[1];
    if (projectString) {
      const projectData = await mongoParse.convertToValidJSON(projectString);
      return { projection: projectData[0], length: match[1].length + 10 }; // here 10 is .project() length
    }
    return null;
  } else {
    console.log("project not found.");
    return null;
  }
}
async function getSort(queryString) {
  const sortRegex = /\.sort\(([^)]+)\)/;
  const match = queryString.match(sortRegex);
  if (match) {
    const sortString = match[1];
    if (sortString) {
      const sort = await mongoParse.convertToValidJSON(sortString);
      return { sort: sort[0], length: match[1].length + 7 }; // here 7 is .sort() length
    }
    return null;
  } else {
    console.log("Sort not found.");
  }
}

function extractQueryString(inputString, lengthOfLastIndex) {
  const reversedString = inputString.split("").reverse().join("");
  const slicedReversedString = reversedString.slice(0, lengthOfLastIndex);
  const string = slicedReversedString.split("").reverse().join("");
  const q = inputString.replace(string, "");
  let sIndex = inputString.indexOf(".find(");
  let startIndex = sIndex + 6; // 6 is .find( length
  if (sIndex === -1) {
    sIndex = inputString.indexOf(".findOne(");
    startIndex = sIndex + 9; // 9 is .findOne( length
  }
  const finalString = q.slice(startIndex, q.length - 1);
  return finalString;
}

async function getQuery(inputString, lengthOfLastIndex) {
  try {
    const stringFilter = await extractQueryString(
      inputString,
      lengthOfLastIndex
    );
    const { query, projection } = await mongoParse.stringToJsonFind(
      stringFilter
    );

    return {
      query,
      projection,
    };
  } catch {
    console.log("Sort not found.");
    return {
      query: null,
      projection: null,
    };
  }
}

module.exports = { getQueryEntities };
