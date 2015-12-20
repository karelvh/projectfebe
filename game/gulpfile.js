//npm install --save-dev gulp gulp-csslint gulp-minify-css gulp-sourcemaps gulp-uglify gulp-concat gulp-notify gulp-sass gulp-jshint jshint-stylish gulp-autoprefixer gulp-inject
var gulp = require("gulp");
var csslint = require("gulp-csslint");
var cssMinifier = require("gulp-minify-css");
var sourcemaps = require("gulp-sourcemaps");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var notify = require("gulp-notify");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var inject = require("gulp-inject");
var series = require('stream-series');

var jsFiles = ['*.js', './app/**/*.js'];

gulp.task("default", function(){
    var styleWatcher = gulp.watch("./app/styles/**/*.scss", ["css"]);
    styleWatcher.on("change", function(event){});

    var jsWatcher = gulp.watch("./app/scripts/**/*.js", ["js"]);
    jsWatcher.on("change", function(){});
});

gulp.task("js", function(){
    gulp.src("./app/scripts/**/*.js")
    //.pipe(jshint())
    //.pipe(jshint.reporter(jsStylish))
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.js"))
    .pipe(sourcemaps.write())
    //enable for deployment
    // .pipe(uglify())
    .pipe(gulp.dest('./app/dist/js'))
    .pipe(notify({message: 'js built'}));
});

gulp.task("css", function () {
    gulp.src("./app/styles/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(csslint({
        'ids': false
    }))
    .pipe(csslint.reporter())
    .pipe(autoprefixer())
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.css"))
    .pipe(sourcemaps.write())
    //enable for deployment
    .pipe(cssMinifier())
    .pipe(gulp.dest("./app/dist/css"))
    .pipe(notify({message: 'stylesheet built'}));
});

gulp.task("inject", ["js"], function(){

    var injectCSSnJS = gulp.src(["./app/dist/css/*.css","./app/dist/js/*.js"],{read: false});
    var vendorStream = gulp.src(["./app/dist/js/vendor/*.js"], { read: false});
    var angularModulesStream = gulp.src(["./app/dist/js/angular-modules/*.js"], { read: false});

    var injectOptions = {
        ignorePath: "/app"
    };

    //only need to inject into index.html, the other pages are angular templates.
    return gulp.src("./app/index.html")
        .pipe(inject(series(vendorStream, angularModulesStream, injectCSSnJS), injectOptions))
        .pipe(gulp.dest("./app"));
});
