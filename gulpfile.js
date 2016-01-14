const g = require("gulp");
const $ = require( 'gulp-load-plugins' )();
const connect = require('gulp-connect');

// local server
g.task("connect", () => {
    connect.server({
        port      : 3000,
        livereload: true
    });

    options = {
        url: "http://localhost:3000",
        app: "Google Chrome"
    };

    g.src("./index.html")
        .pipe($.open("", options));
});

g.task('css', ()=>{
    g.src(['src/css/style.sass'])
     .pipe($.sass())
     .pipe(g.dest('./'));
});


g.task('babel', ()=>{
    g.src(['src/js/modal.js'])
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(g.dest('./'));
});

g.task('lint', ()=>{
    g.src(['modal.js', 'app.js'])
        .pipe($.eslint())
        .pipe($.eslint.format());
});


g.task('jscs', ()=>{
    g.src(['modal.js', 'app.js'])
        .pipe($.jscs());
});

g.task('dev', ['babel'], ()=>{
    g.start(['lint', 'jscs']);
});

g.task("default", ['connect'], ()=>{
    g.watch("src/**/*.js", ["dev"]);
    g.watch("src/**/*.sass", ["css"]);
});


 //build
g.task('build', ()=>{
    g.src('./modal.js')
        .pipe($.sourcemaps.init())
        .pipe($.rename({
            basename: "modal.min",
            extname: ".js"
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(g.dest('./'));
});


