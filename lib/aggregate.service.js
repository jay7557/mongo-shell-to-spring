const mongoParse = require("./mongo-parse");

function getAggregatePipeline(inputString) {
  const pipelineStartIndex = inputString.indexOf("([");
  const lastIndexOfString = inputString.length;
  const queryPipeline = inputString.slice(
    pipelineStartIndex + 1,
    lastIndexOfString - 1
  );
  return mongoParse.convertToValidJsonForAggregate(queryPipeline);
}

module.exports = {
  getAggregatePipeline,
};
