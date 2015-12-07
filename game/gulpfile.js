//npm install --save-dev gulp gulp-csslint gulp-minify-css gulp-sourcemaps gulp-uglify gulp-concat gulp-notify gulp-sass gulp-jshint jshint-stylish gulp-autoprefixer gulp-inject
var gulp = require("gulp");
var csslint = require("gulp-csslint");
var cssMinifier = require("gulp-minify-css");
var sourcemaps = require("gulp-sourcemaps");
var jshint = require("gulp-jshint");
// var jsStylish = require("jshint-stylish");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var notify = require("gulp-notify");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var inject = require("gulp-inject");
var nodemon = require("gulp-nodemon");

var jsFiles = ['*.js', 'public/**/*.js']

gulp.task("default", function(){
    var styleWatcher = gulp.watch("./public/styles/**/*.scss", ["css-build"]);
    styleWatcher.on("change", function(event){});

    var jsWatcher = gulp.watch("./public/scripts/**/*.js", ["js-build"]);
    jsWatcher.on("change", function(){});
});

gulp.task("js", function(){
    gulp.src("/public/scripts/**/*.js")
    //.pipe(jshint())
    //.pipe(jshint.reporter(jsStylish))
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.js"))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/js'))
    .pipe(notify({message: 'js built'}));
});

gulp.task("css", function () {
    gulp.src("./public/styles/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(csslint({
        'ids': false
    }))
    .pipe(csslint.reporter())
    .pipe(autoprefixer())
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.css"))
    // .pipe(cssMinifier())
    //disable for deployment
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./public/dist/css"))
    .pipe(notify({message: 'stylesheet built'}));
});

gulp.task("inject", ["js"], function(){

    var injectSrc = gulp.src(["./public/dist/css/*.css","./public/dist/js/*.js"],{read: false});

    var injectOptions = {
        ignorePath: "/public"
    };

    //only need to inject into index.html, the other pages are angular templates.
    return gulp.src("./public/views/index.html")
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest("./public/views"))
});

gulp.task("serve", ["inject"], function(){
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            'PORT': 8080
        },
        watch: jsFiles
    }

    return nodemon(options)
        .on('restart', function(ev){
            console.log("Restarting.......");
        })
});
