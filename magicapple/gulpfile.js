// Include gulp
var gulp = require('gulp');

// Include Plugins
var rename       = require('gulp-rename');
var gutil        = require('gulp-util');
var size         = require('gulp-size');
var less         = require('gulp-less');
var csso         = require('gulp-csso');
var cmq          = require('gulp-combine-media-queries');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require('gulp-notify');
var buffer       = require('vinyl-buffer');
var merge        = require('merge-stream');

// Variables
var source = {
	css    : 'source/css',
	js     : 'source/js',
	img    : 'source/img',
	fonts  : 'source/fonts',
};
var assets = {
	css    : 'assets/css',
	js     : 'assets/js',
	img    : 'assets/img',
	fonts  : 'assets/fonts',
};

// Browser reload
gulp.task('browser-sync', function () {
	browserSync.init([
		'*.html'
	], {
		ghostMode : false
	});
});

// Copy fonts to assets
gulp.src(source.fonts + '/**', {base: source.fonts + '/'})
	.pipe(gulp.dest(assets.fonts + '/'));
	
// Compile less
gulp.task('css', function () {
	gulp.src(source.css + '/style.less')
		.pipe(less().on('error', notify.onError(function (error) {
			return "CSS: " + error.message;
		})))
		//.pipe(cmq())
		.pipe(autoprefixer({
			browsers: ['ie >= 8, last 4 versions, > 5%']
		}))
			.pipe(gulp.dest(assets.css))
			.pipe(size({ showFiles: true }))
			.pipe(browserSync.reload({ stream: true }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(csso())
			.pipe(gulp.dest(assets.css))
			.pipe(size({ showFiles: true }))
});

// Minify images
gulp.task('images', function () {
	gulp.src([source.img + '/**', '!' + source.sprite + '{,/**}', '!' + source.img + '/*.svg'])
		.pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
			.pipe(gulp.dest(assets.img))
			.pipe(notify('Images done!'))
		.pipe(browserSync.reload({ stream: true, once: true }))
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch([source.css + '/style.less', source.css + '/**/*.less'], ['css']);
});

// Default Task
gulp.task('default', ['css', 'watch', 'browser-sync']);