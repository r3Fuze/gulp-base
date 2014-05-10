"use strict";

var express = require("express"),
    // config  = require("./config"),
    path    = require("path"),
    swig    = require("swig");

// TODO: Rename to $?
var middleware = {
    logger:         require("morgan"),
    bodyParser:     require("body-parser"),
    compress:       require("compression"),
    favicon:        require("static-favicon"),
    methodOverride: require("method-override"),
    cookieParser:   require("cookie-parser"),
    errorHandler:   require("errorhandler")
};

// FIXME: DB?
module.exports = function() {
    var app = express();

    // FIXME: App locals here

    // FIXME: Passing the request url to environment locals
    app.use(function(req, res, next) {
        res.locals.url = req.protocol + "://" + req.headers.host + req.url;
        next();
    });

    // FIXME: use this?
    /*app.use(middleware.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader("Content-Type"));
        },
        level: 9
    }));*/

    // FIXME: Find out what this does
    app.set("showStackError". true);

    // TODO: swig
    app.engine("swig", swig.renderFile);
    app.set("views", path.resolve("views"));
    app.set("view engine", "swig");

    if (process.env.NODE_ENV === "development") {
        app.use(middleware.logger("dev"));

        // FIXME: Disable cache for development. Disable for swig too?
        app.set("view cache", false);
        // swig.setDefaults({ cache: false });
    } else if (process.env.NODE_ENV === "production") {
        // FIXME: What does this do?
        app.locals.cache = "memory";
    }

    app.use(middleware.bodyParser.urlencoded());
    app.use(middleware.bodyParser.json());
    app.use(middleware.methodOverride());

    // FIXME: Enable jsonp
    app.enable("jsonp callback");

    app.use(middleware.cookieParser());

    // FIXME: MongoDB session goes here

    // FIXME: Passport here

    // FIXME: Connect flash here

    // FIXME: helmet security here. Do we need it??

    app.use(express.static(path.resolve(".tmp"))); // css is server from .tmp during development
    app.use(express.static(path.resolve("public")));

    // Initialize routes
    require("../app/router")(app);

    // Handle 500 errors, requires 4 params
    app.use(function(err, req, res, next) {
        if (!err) { return next(); }

        // FIXME: Log it?
        console.error(err.stack);

        // FIXME: Render
        res.status(500).send("Error: " + err.stack);
    });

    // Handle 404. This has to go last
    app.use(function(req, res) {
        // FIXME: Render
        res.status(404).send("Not found");
    });

    return app;
};
