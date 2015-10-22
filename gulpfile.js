var gulp = require('gulp'),
	babel = require('gulp-babel'),
	eslint = require('gulp-eslint');

gulp.task('lint', function () {
    return gulp.src(['src/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', ['lint'], function () {
	return gulp.src('src/*.js')
		.pipe(babel({
			stage: 0
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);