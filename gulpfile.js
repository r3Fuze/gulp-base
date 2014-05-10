/* global $:true */
"use strict";

// TODO: Create TODO file
// HTML lint? Maybe more?

var gulp   = require("gulp"),
    config = require("./config/config");

// load plugins
var $ = require("gulp-load-plugins")();

// Attach non-gulp plugins to `$` variable
$.browserSync = require("browser-sync");
$.wiredep     = require("wiredep").stream;


function onError(err) {
    $.util.beep(); // TODO: Will this destroy the world?
    console.log(err.toString());
    process.exit(1);
}


gulp.task("styles", function () {
    return gulp.src("public/styles/main.scss")
        .pipe($.rubySass({
            style: "expanded",
            precision: 10
        }))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(".tmp/styles"))
        .pipe($.size());
});

gulp.task("scripts", function () {
    return gulp.src("public/scripts/**/*.js")
        .pipe($.jshint())
        .pipe($.jshint.reporter(require("jshint-stylish")))
        .pipe($.size());
});

gulp.task("html", ["styles", "scripts"], function () {
    var jsFilter = $.filter("**/*.js");
    var cssFilter = $.filter("**/*.css");

    // TODO: Only swig
    return gulp.src("views/*.swig")
        .pipe($.useref.assets({ searchPath: "{.tmp,public}" }))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest("dist"))
        .pipe($.size());
});

gulp.task("images", function () {
    return gulp.src("public/images/**/*")
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest("dist/images"))
        .pipe($.size());
});

gulp.task("fonts", function () {
    return $.bowerFiles()
        .pipe($.filter("**/*.{eot,svg,ttf,woff}"))
        .pipe($.flatten())
        .pipe(gulp.dest("dist/fonts"))
        .pipe($.size());
});

gulp.task("extras", function () {
    return gulp.src(["public/*.*", "!public/*.html"], { dot: true })
        .pipe(gulp.dest("dist"));
});


// TODO: Use karma?
gulp.task("mocha", function() {
    // TODO: Replace this with something else
    process.env.NODE_ENV = "test";
    return gulp.src("test/*-test.js")
        .pipe($.mocha({ reporter: "dot" })) // dot, list, spec
        .on("error", onError); // TODO: Find a fix for this!
});

gulp.task("clean", function () {
    return gulp.src([".tmp", "dist"], { read: false })
        .pipe($.clean());
});

gulp.task("build", ["html", "images", "fonts", "extras"]);

gulp.task("default", ["clean"], function () {
    gulp.start("build");
});

gulp.task("express", function() {
    var app = require("./server");

    app.listen(config.port, function() {
        $.util.log("Started express web server on http://localhost:" + config.port);
    });
});

gulp.task("browser-sync", function() {
    $.browserSync.init([
        "public/*.html", // TODO: Only swig
        "views/**/*",
        ".tmp/styles/**/*.css",
        "public/scripts/**/*.js",
        "public/images/**/*"
    ], {
        proxy: "localhost:" + config.port, // Express url (make configurable)
        open: false // Don't open browser
    });
});

// TODO: Remove this task?
gulp.task("serve", ["express", "styles"], function () {
    require("opn")("http://localhost:3002"); // port 3002 for browser-sync
});

// Inject bower components. Run when new bower modules are installed
gulp.task("wiredep", function () {
    gulp.src("public/styles/*.scss")
        .pipe($.wiredep({
            directory: "public/bower_components"
        }))
        .pipe(gulp.dest("public/styles"));

    // TODO: Only swig, where should swig files be placed?
    gulp.src("public/*.html")
        .pipe($.wiredep({
            directory: "public/bower_components",
            exclude: ["bootstrap-sass-official"]
        }))
        .pipe(gulp.dest("public"));

    // Swig files are served as being in the public directory
    // TODO: Fix the paths that are being injected, current method is hacky
    gulp.src("views/test.swig")
        .pipe($.wiredep({
            directory: "public/bower_components",
            exclude: ["bootstrap-sass-official"]
        }))
        .pipe($.replace("../public/", "")) // Fix the path for bower stuff
        .pipe(gulp.dest("views"));
});

gulp.task("watch", ["express", "serve", "browser-sync"], function () {
    gulp.watch("public/styles/**/*.scss", ["styles"]);
    gulp.watch("public/scripts/**/*.js", ["scripts"]);
    gulp.watch("public/images/**/*", ["images"]);
    gulp.watch("bower.json", ["wiredep"]);
});
