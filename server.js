"use strict";

var app  = require("./config/express")(),
    http = require("http");

var server = http.createServer(app);

app.listen = function() {
    server.listen.apply(server, arguments);
};

app.close = function(callback) {
    server.close(callback);
};

// Expose app
exports = module.exports = app;

// TODO: Remove
console.log("NODE_ENV: " + process.env.NODE_ENV);
