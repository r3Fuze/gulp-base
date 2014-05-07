/* jshint expr: true */
/* global describe, it */
"use strict";

var expect = require("chai").expect;

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
