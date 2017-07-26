var gulp = require('gulp');

gulp.task('stream', function() {
    return watch('*.js', { ignoreInitial: false })
            .pipe(gulp.dest('build'));
});