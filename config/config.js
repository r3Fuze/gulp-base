"use strict";

var _ = require("lodash");

// FIXME: Use init.js like meanjs?
process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = _.extend(
    require("./env/all"),
    require("./env/" + process.env.NODE_ENV) || {}
);
