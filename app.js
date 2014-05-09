"use strict";

var express = require("express"),
    path    = require("path"),
    http    = require("http");

var middleware = {
    logger:         require("morgan"),
    bodyParser:     require("body-parser"),
    compress:       require("compression"),
    favicon:        require("static-favicon"),
    methodOverride: require("method-override"),
    errorHandler:   require("errorhandler")
};

var app = express();

// TODO: swig
app.set("views", path.join(__dirname, "views"));


app.use(middleware.bodyParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, ".tmp")));

if (process.env.NODE_ENV === "development") {
    // Development
}


// Exports
var server = http.createServer(app);

app.listen = function() {
    server.listen.apply(server, arguments);
};

app.close = function(callback) {
    server.close(callback);
};

module.exports = app;
