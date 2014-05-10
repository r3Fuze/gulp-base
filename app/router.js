"use strict";

module.exports = function(app) {
    app.get("/", function(req, res) {
        res.send("Hello, world!");
    });

    app.get("/test", function(req, res) {
        res.render("test", {});
    });
};
