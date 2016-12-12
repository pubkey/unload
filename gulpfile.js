const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test', function() {
    return gulp
        .src([
            '../test/nodejs.test.js'
        ])
        .pipe(mocha({
            bail: true
        }))
        .once('end', function() {
            process.exit();
        });
});
