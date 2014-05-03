/* global describe, it, expect */

(function () {
    "use strict";

    describe("Give it some context", function () {
        describe("maybe a bit more context here", function () {
            it("should run here few assertions", function () {
                expect("Hello, world!").to.have.length(13);
            });
        });
    });
})();
