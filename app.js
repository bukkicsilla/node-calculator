//https://stackoverflow.com/questions/52898456/simplest-way-of-finding-mode-in-javascript

const express = require("express");
const EE = require("./error");
const app = express();

const mode = (a) =>
  Object.values(
    a.reduce((count, e) => {
      if (!(e in count)) {
        count[e] = [0, e];
      }

      count[e][0]++;
      return count;
    }, {})
  ).reduce((a, v) => (v[0] < a[0] ? a : v), [0, null])[1];

app.get("/mean/", (req, res, next) => {
  const { nums } = req.query;
  if (!nums) {
    //return res.status(400).send("Numbers are required!");
    const err = new EE(
      "You must pass a query key of nums with a comma-separated list of numbers.",
      400
    );
    return next(err);
  }
  const lst = nums.split(",");
  let sum = 0;
  for (let num of lst) {
    if (Number.isNaN(+num)) {
      //return res.status(400).send(`Bad request, ${num} is not a Number.`);
      const NaNErr = new EE(`Bad request, ${num} is not a Number.`, 400);
      return next(NaNErr);
    } else {
      sum += +num;
    }
  }
  return res.json({
    response: {
      operation: "mean",
      value: sum / lst.length,
    },
  });
});

app.get("/median", (req, res) => {
  const { nums } = req.query;
  if (!nums) {
    return res.status(400).send("Numbers are required!");
  }
  const lst = nums.split(",");
  let v = [];
  for (let num of lst) {
    if (Number.isNaN(+num)) {
      return res.status(400).send(`Bad request, ${num} is not a Number.`);
    } else {
      v.push(+num);
    }
  }
  const values = [...v].sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  res.json({
    response: {
      operation: "median",
      value: values[half],
    },
  });
});

app.get("/mode", (req, res) => {
  const { nums } = req.query;
  if (!nums) {
    return res.status(400).send("Numbers are required!");
  }
  const lst = nums.split(",");
  let v = [];
  for (let num of lst) {
    if (Number.isNaN(+num)) {
      return res.status(400).send(`Bad request, ${num} is not a Number.`);
    } else {
      v.push(+num);
    }
  }
  res.json({
    response: {
      operation: "mode",
      value: mode(v),
    },
  });
});

/** general error handler */

app.use(function (req, res, next) {
  const err = new EE("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    //message: err.message,
  });
});
app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
