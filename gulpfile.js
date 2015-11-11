var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var harp = require('harp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rsync = require('gulp-rsync');
var shell = require('gulp-shell');

/**
 * Serve the Harp Site from the src directory
 */
gulp.task('serve', function () {
  harp.server(__dirname, {
		port: 9000
	}, function () {
		browserSync({
			proxy: "localhost:9000",
			open: false,
			/* Hide the notification. It gets annoying */
			notify: {
			styles: ['opacity: 0', 'position: absolute']
			}
		});

		/**
		 * Watch for scss changes, tell BrowserSync to refresh main.css
		 */
		gulp.watch(['*.sass', '*.less', '*.scss', '*.css'], function () {
			reload("main.css", {stream: true});
		});

		/**
		 * Watch for all other changes, reload the whole page
		 */
		gulp.watch(['*.ejs', '*.html', '*.jade', '*.json', '*.md', '*.js'], function () {
			reload();
		});
	});
});

gulp.task('build_highlight_js', shell.task([
	'npm install',
	'node tools/build.js -n python javascript bash go http json php less scss vim xml'
], {
	cwd: 'lib/highlight.js/'
}));

// Compress all js files into one
gulp.task('compress', function() {
	var watch_list = [
		'node_modules/reveal.js/js/reveal.js',
		'lib/highlight.js/build/highlight.pack.js',
		'public/assets/js/src/*.js'
	];

	gutil.log(watch_list);

	return gulp.src(watch_list)
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/assets/js/'));
});

gulp.task('deploy', function() {
	// Compile harp site
	gutil.log('Building website in public/')
	harp.compile('public/');

	// Upload to webserver
	gutil.log('Deploying website to server')
	gulp.src('www/**')
		.pipe(rsync({
			root: 'www',
			hostname: "eligundry.com",
			destination: "/usr/share/nginx/eligundry.com"
		}))
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve', 'compress']);
