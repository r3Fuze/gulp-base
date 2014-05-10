/* jshint expr: true */
/* global describe, it, before, after, $:true */
"use strict";

var expect  = require("chai").expect,
    request = require("supertest"),
    cheerio = require("cheerio"), $;

var app    = require("../server"),
    config = require("../config/config");

describe("String", function () {
    describe(".replace()", function () {
        it("should replace part of a string", function () {
            var str = "foobar";

            expect(str.replace("bar", "baz")).to.equal("foobaz");
        });
    });

    describe(".toLowerCase()", function () {
        it("should make strings lowercase", function () {
            var str = "THIS STRING is uPPerCASE";

            expect(str.toLowerCase()).to.equal("this string is uppercase");
        });
    });
});

describe("String", function() {
    it("should do stuff", function() {
        expect("something").to.not.be.null;
    });
});

describe("Server", function() {

    before(function(done) {
        // TODO: Change port. Make it configurable?
        app.listen(config.port, done);
    });

    after(function(done) {
        app.close(done);
    });

    it("should be running", function(done) {
        request(app)
            .get("/")
            .expect(200, done);
    });

    // TODO: Skip for now
    it.skip("should do some DOM testing", function(done) {
        request(app)
            .get("/")
            .end(function(err, res) {
                if (err) { return done(err); }

                $ = cheerio.load(res.text);

                expect($(".header h3").text()).to.equal("new-project");

                done();
            });
    });
});
