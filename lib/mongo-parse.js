const { ObjectId } = require("mongodb");
const operators = [
  "$group",
  "$sum",
  "$avg",
  "$min",
  "$max",
  "$push",
  "$addToSet",
  "$first",
  "$last",
  "$match",
  "$expr",
  "$project",
  "$addFields",
  "$unset",
  "$sort",
  "$limit",
  "$skip",
  "$arrayElemAt",
  "$arrayToObject",
  "$filter",
  "$map",
  "$concat",
  "$substr",
  "$setUnion",
  "$setIntersection",
  "$setDifference",
  "$dateToString",
  "$dateFromParts",
  "$accumulator",
  "$eq",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$ne",
  "$in",
  "$nin",
  "$and",
  "$or",
  "$not",
  "$nor",
  "$exists",
  "$type",
  "$expr",
  "$jsonSchema",
  "$all",
  "$elemMatch",
  "$size",
  "$text",
  "$search",
  "$geoWithin",
  "$geoIntersects",
  "$regex",
  "$options",
  "$where",
  "$floor",
  "$divide",
  "$lookup",
  "_id",
];
async function convertToValidJsonForAggregate(inputString) {
  try {
    let str = inputString.replaceAll("'", `"`);

    operators.forEach((wordToReplace) => {
      let regex = new RegExp(`\\${wordToReplace}:`, "g");
      str = str.replace(regex, `"${wordToReplace}":`);
    });
    // Extracting words not containing "$"
    str = await replaceWordWithDoubleQuote(str);
    str = await replaceISODateType(str);
    jsonQuery = await convertMongoDBQueryStringsToObjects(str);

    return jsonQuery;
  } catch (error) {
    console.log("error:==========", error);
  }
}
async function stringToJsonFind(inputString) {
  try {
    let str = inputString.replaceAll("'", `"`);
    operators.forEach((wordToReplace) => {
      let regex = new RegExp(`\\${wordToReplace}:`, "g");
      str = str.replace(regex, `"${wordToReplace}":`);
    });
    str = await replaceWordWithDoubleQuote(str);
    str = await replaceISODateType(`[${str}]`);
    const jsonQuery = JSON.parse(str);
    const filter = await convertMongoDBQueryStringsToObjects(str);
    return { query: filter[0], projection: jsonQuery[1] || null };
  } catch (error) {
    console.log("error:==========", error);
  }
}
async function convertToValidJSON(inputString) {
  try {
    let str = inputString.replaceAll("'", `"`);
    operators.forEach((wordToReplace) => {
      let regex = new RegExp(`\\${wordToReplace}:`, "g");
      str = str.replace(regex, `"${wordToReplace}":`);
    });
    // Extracting words not containing "$"
    str = await replaceWordWithDoubleQuote(str);
    // str = await replaceISODateType(`[${str}]`);
    const jsonQuery = JSON.parse(str);
    return jsonQuery;
  } catch (error) {
    console.log("error:==========", error);
  }
}
function replaceWordWithDoubleQuote(inputString) {
  try {
    // Regular expression pattern to find words not containing "$"
    const pattern = /\b(?<!")(?!")(?!false|true|null)\w+(?!")\b/g;
    // const filteredWords = inputString.match(pattern);
    const matches = [...inputString.matchAll(pattern)];
    const filteredWords = matches.map((match) => ({
      word: match[0],
      index: match.index,
    }));
    const filteredArray = filteredWords.filter(
      (item, index, self) => isNaN(item.word)
      //&& self.indexOf(item) === index
    );

    let replacedString = inputString;
    let newIndex = 0;
    filteredArray.map((n, i) => {
      const { word } = n;
      let index = i === 0 ? n.index : n.index + newIndex;
      replacedString = replacedString.replace(
        // new RegExp(`\\b${word}\\b`),
        new RegExp(`(?<!")\\b${word}\\b(?!")`, "g"),
        (match, offset) => {
          return offset === index ? `"${word}"` : match;
        }
      );
      newIndex = newIndex + 2;
    });

    return replacedString;
  } catch (error) {
    console.log("replaceWordWithDoubleQuote=====", error);
  }
}
async function replaceISODateType(inputString) {
  try {
    let replacedStr = await inputString.replace(
      /"new" "Date"\("([^"]+)"\)/g,
      (match, p1) => `"ISODate"("${p1}")`
    );
    // Replace ISODate with JavaScript Date object
    replacedStr = await replacedStr.replace(
      /"ISODate"\("([^"]+)"\)/g,
      (match, p1) => `"${new Date(p1).toISOString()}"`
    );
    replacedStr = await replacedStr.replace(
      /"ObjectId"\("([^"]+)"\)/g,
      (match, p1) => `"${p1}"`
    );
    return replacedStr;
  } catch (error) {}
}

async function convertMongoDBQueryStringsToObjects(inputString) {
  try {
    const modifiedQuery = inputString.replace(
      /"ObjectId"\("([^"]+)"\)/g,
      (match, p1) => `"${p1}"`
    );
    var query = JSON.parse(modifiedQuery);
    function replaceObjectIdsAndDates(obj) {
      for (let key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          replaceObjectIdsAndDates(obj[key]);
        } else if (typeof obj[key] === "string") {
          if (/^[0-9a-fA-F]{24}$/.test(obj[key])) {
            // Check if it's an ObjectId string
            obj[key] = new ObjectId(obj[key]);
          } else if (
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj[key])
          ) {
            // Check if it's a date string
            obj[key] = new Date(obj[key]);
          }
        }
      }
    }

    await query.forEach(replaceObjectIdsAndDates);
    return query;
  } catch (error) {
    console.log("modifiedQuery===== error", error);
  }
}

module.exports = {
  convertToValidJsonForAggregate,
  stringToJsonFind,
  convertToValidJSON,
};
