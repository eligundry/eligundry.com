var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var harp = require('harp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rsync = require('gulp-rsync');

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

// Compress all js files into one
gulp.task('compress', function() {
	var watch_list = [];

	// Load up all needed Prism highlighting language
	var prism_languages = [
		'core', 'markup', 'parser', 'bash', 'c', 'cpp', 'css', 'diff', 'git', 'go',
		'javascript', 'http', 'markdown', 'php', 'php-extras', 'python', 'sql', 'vim',
		'yaml'
	];

	for (var i = 0; i < prism_languages.length; i++) {
		watch_list.push('node_modules/prismjs/components/prism-' + prism_languages[i] + '.js');
	}
	watch_list.push('node_modules/prismjs/plugins/file-highlight/prism-file-highlight.js');

	// Load reveal.js
	watch_list.push('node_modules/reveal.js/js/reveal.js');

	// Load project specific files
	watch_list.push('public/assets/js/src/*.js');

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
