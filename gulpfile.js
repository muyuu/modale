const gulp = require("gulp");
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const connect = require("gulp-connect");
const jscs = require("gulp-jscs");
const open = require("gulp-open");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const port = 7000;
const filename = "modale";
const file = `${filename}.js`;


// local server
gulp.task("connect", () =>{
    connect.server({
        port      : port,
        livereload: true
    });

    gulp.src("./index.html")
        .pipe(open({
            uri: `http://localhost:${port}/index.html`,
            app: "Google Chrome"
        }));
});

gulp.task("css", ()=>{
    gulp.src(["src/css/style.sass"])
        .pipe(sass())
        .pipe(gulp.dest("./"));
});


gulp.task("babel", ()=>{
    gulp.src([`src/js/${file}`])
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("./"));
});


gulp.task("lint", ()=>{
    gulp.src([`src/js/${file}`])
        .pipe(eslint())
        .pipe(eslint.format());
});


gulp.task("dev", ["babel"], ()=>{
    gulp.run(["lint"]);
});


gulp.task("default", ["connect"], ()=>{
    gulp.watch("./src/**/*.js", ["dev"]);
    gulp.watch("./src/**/*.sass", ["css"]);
});


// build
gulp.task("build", ()=>{
    gulp.src(file)
        .pipe(sourcemaps.init())
        .pipe(rename({
            basename: `${filename}.min`,
            extname : `.js`
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./"));
});
