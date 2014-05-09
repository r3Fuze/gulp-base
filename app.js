"use strict";

var express = require("express"),
    path    = require("path"),
    http    = require("http"),
    swig    = require("swig");

var middleware = {
    logger:         require("morgan"),
    bodyParser:     require("body-parser"),
    compress:       require("compression"),
    favicon:        require("static-favicon"),
    methodOverride: require("method-override"),
    errorHandler:   require("errorhandler")
};

var app = express();

// TODO: Replace with NODE_ENV stuff
var dev = true;

// TODO: swig
app.engine("swig", swig.renderFile);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "swig");

app.use(middleware.bodyParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, ".tmp")));

if (dev) {
    // Development
    swig.setDefaults({ cache: false });
}

require("./app/router")(app);

// Exports
var server = http.createServer(app);

app.listen = function() {
    server.listen.apply(server, arguments);
};

app.close = function(callback) {
    server.close(callback);
};

module.exports = app;
