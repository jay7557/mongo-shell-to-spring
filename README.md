# mongo-shell-to-spring

**mongo-shell-to-spring** is an npm package designed to simplify the conversion of MongoDB shell command queries into Spring Data queries. This utility offers developers a seamless way to translate MongoDB shell commands into equivalent Spring Data queries, streamlining the process of integrating MongoDB data into Spring applications. By automating the translation process, this tool enhances developer productivity and ensures consistency between MongoDB and Spring Data query syntax.

## Installation

To install **mongo-shell-to-spring**, you can use npm:

``````bash
npm install mongo-shell-to-spring

## Usage

#The find and findOne query example

`````javascript
const mongoToSpringConverter = require("mongo-shell-to-spring");

const mongoQuery = "db.collection.find({ field: value })";
const  { query, projection, sort, limit, method, collectionName }  = mongoToSpringConverter.convert(mongoQuery);
console.log("Query:", query);
console.log("Projection:", projection);
console.log("Sort:", sort);
console.log("Limit:", limit);
console.log("Method:", method);
console.log("Collection Name:", collectionName);````

#The aggregate query example

```javascript
const mongoToSpringConverter = require("mongo-shell-to-spring");

const mongoShellQuery = "db.users.aggregate([
  { $lookup: { from: "comments", localField: "_id", foreignField: "user_id", as: "comments" }},
  { $match: { "comments.movie_id": ObjectId("660a798060f6c59acc818cd5") }}
])";

const { query, projection, sort, limit, pipeline, method, collectionName } =
  await mongoToSpringConverter.convert(mongoShellQuery);

console.log("Query:", query);
console.log("Projection:", projection);
console.log("Sort:", sort);
console.log("Limit:", limit);
console.log("Pipeline:", pipeline);
console.log("Method:", method);
console.log("Collection Name:", collectionName);
``````

## Features

Convert MongoDB shell queries to Spring Data queries.
Seamless transition between MongoDB and Spring Data MongoDB.
Improves developer productivity by automating query translation.

## Examples

const mongoQuery = 'db.collection.find({ field: value })';
const springQuery = mongoToSpringConverter.convert(mongoQuery);

console.log('Spring Query:', springQuery);

This README provides clear instructions on installation, usage, features, examples, and license information for your package. Adjustments can be made according to your specific package functionality and requirements.
Package
