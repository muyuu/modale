g = require "gulp"
$ = require( 'gulp-load-plugins' )()
connect = require 'gulp-connect'

# local server
g.task "connect", ->
    connect.server
        port: 3000
        livereload: true

    options =
        url: "http://localhost:3000"
        app: "Google Chrome"

    g.src "./index.html"
    .pipe $.open "", options


g.task 'babel', ->
    g.src ['src/js/modal.js']
    .pipe $.babel()
    .pipe g.dest './'

g.task 'lint', ->
    g.src(['modal.js', 'app.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())


g.task 'jscs', ()->
    g.src ['modal.js', 'app.js']
    .pipe $.jscs()

g.task 'dev', ['babel'], ()->
    g.start ['lint', 'jscs']


g.task "default", ['connect'], ->
    g.watch "**/*.js", ["dev"]


# build
g.task 'build', ->
    g.src './modal.js'
    .pipe $.sourcemaps.init()
    .pipe $.rename
        basename: "modal.min"
        extname: ".js"
    .pipe $.uglify()
    .pipe $.sourcemaps.write('./')
    .pipe g.dest './'


