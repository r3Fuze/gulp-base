/* global $:true */
"use strict";

// TODO: Create TODO file
// HTML lint? Maybe more?

var gulp = require("gulp");

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

    return gulp.src("public/*.html")
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


gulp.task("mocha", function() {
    return gulp.src("test/*-test.js")
        .pipe($.mocha({ reporter: "dot" })) // dot, list, spec
        .on("error", onError); // TODO: Find a fix for this!
});

gulp.task("clean", function () {
    return gulp.src([".tmp", "dist"], { read: false }).pipe($.clean());
});

gulp.task("build", ["html", "images", "fonts", "extras"]);

gulp.task("default", ["clean"], function () {
    gulp.start("build");
});

gulp.task("connect", function () {
    var connect = require("connect");
    var app = connect()
        .use(require("connect-livereload")({ port: 35729 }))
        .use(connect.static("public"))
        .use(connect.static(".tmp"))
        .use(connect.directory("public"));

    require("http").createServer(app)
        .listen(9000)
        .on("listening", function () {
            $.util.log("Started connect web server on http://localhost:9000");
        });
});

gulp.task("express", function() {
    var app = require("./app");

    app.listen(9000, function() {
        $.util.log("Started express web server on http://localhost:9000");
    });
});

gulp.task("browser-sync", function() {
    $.browserSync.init([
        "public/*.html",
        ".tmp/styles/**/*.css",
        "public/scripts/**/*.js",
        "public/images/**/*"
    ], {
        proxy: "localhost:9000", // Express url (make configurable)
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

    gulp.src("public/*.html")
        .pipe($.wiredep({
            directory: "public/bower_components",
            exclude: ["bootstrap-sass-official"]
        }))
        .pipe(gulp.dest("public"));
});

gulp.task("watch", ["express", "serve", "browser-sync"], function () {
    // TODO: Remove these comments
    // var server = $.livereload();

    // watch for changes

    // gulp.watch([
    //     "public/*.html",
    //     ".tmp/styles/**/*.css",
    //     "public/scripts/**/*.js",
    //     "public/images/**/*"
    // ]).on("change", function (file) {
    //     $.util.log(file.path.replace(__dirname, "") + " changed");
    //     server.changed(file.path);
    // });

    gulp.watch("public/styles/**/*.scss", ["styles"]);
    gulp.watch("public/scripts/**/*.js", ["scripts"]);
    gulp.watch("public/images/**/*", ["images"]);
    gulp.watch("bower.json", ["wiredep"]);
});
