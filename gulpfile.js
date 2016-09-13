///* ========================================================================
//   #GULPFILE
//   ======================================================================== */

/* Packages
   ========================================================================== */

/**
* General
*/
var notify = require("gulp-notify");
var browserSync = require('browser-sync').create();
var del = require('del');

/**
* Markup
*/
var nunjucksRender = require('gulp-nunjucks-render');
var htmlmin = require('gulp-htmlmin');

/**
* Styles
*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var critical = require('critical').stream;

/**
* Javascript
*/
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

/**
* SVG
*/
var svgSprite = require('gulp-svg-sprite');
var svg2png = require('gulp-svg2png');

/**
* Images
*/
var responsive = require('gulp-responsive');

/* Paths
   ========================================================================== */

var paths = {
	input: './src',
	output: './dist',
	markup: {
		input: ['./src/templates/**/*.+(html)', '!./src/templates/partials/**/*.+(html)'],
		output: './dist/',
		dist: './dist/'
	},
	styles: {
		input: './src/sass/**/*.{scss,sass}',
		output: './dist/css/',
		dist: './dist/css/'
	},
	javascript: {
		main: './src/js/main.js',
		input: './src/js/**/*.js',
		output: './dist/js/',
		dist: './dist/js/'
	},
	images: {
		input: './src/images/**/*.+(png|jpg|jpeg|gif|svg)',
		output: './dist/images/',
		dist: './dist/images/'
	},
	fonts: {
		input: './src/fonts/**/*',
		dist: './dist/fonts/'
	},
	svg: {
		input: ['./src/svg/*.svg'],
		output: './dist/',
		dist: './dist/'
	}
};


/* Config
   ========================================================================== */
var sassOptions = {
	errLogToConsole: true,
	includePaths : __dirname+'/node_modules',
	outputStyle: 'expanded'
};

var autoprefixerOptions = {
	browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var svgOptions = {
	mode: {
		inline: true,
		symbol: {
			dest: './',
			sprite: 'sprite.svg',
			example: false
		}
	},
	svg: {
		xmlDeclaration: false,
		doctypeDeclaration: false
	}
};

var svgFallbackOptions = {
	width: 30,
	height: 30
};

var responsiveParams = {
	'**/*': [{
	   // image-small.jpg is 200 pixels wide
	   width: 200,
	   rename: {
	       suffix: '-small',
	       extname: '.jpg'
	   }
	}, {
	   // image-small@2x.jpg is 400 pixels wide
	   width: 200 * 2,
	   rename: {
	       suffix: '-small@2x',
	       extname: '.jpg'
	   }
	}, {
	   // image-large.jpg is 480 pixels wide
	   width: 480,
	   rename: {
	       suffix: '-large',
	       extname: '.jpg'
	   }
	}, {
	   // image-large@2x.jpg is 960 pixels wide
	   width: 480 * 2,
	   rename: {
	       suffix: '-large@2x',
	       extname: '.jpg'
	   }
	}, {
	   // image-extralarge.jpg is 1280 pixels wide
	   width: 1280,
	   rename: {
	       suffix: '-extralarge',
	       extname: '.jpg'
	   }
	}, {
	   // image-extralarge@2x.jpg is 2560 pixels wide
	   width: 1280 * 2,
	   rename: {
	       suffix: '-extralarge@2x',
	       extname: '.jpg'
	   }
	}, {
	   // image-small.webp is 200 pixels wide
	   width: 200,
	   rename: {
	       suffix: '-small',
	       extname: '.webp'
	   }
	}, {
	   // image-small@2x.webp is 400 pixels wide
	   width: 200 * 2,
	   rename: {
	       suffix: '-small@2x',
	       extname: '.webp'
	   }
	}, {
	   // image-large.webp is 480 pixels wide
	   width: 480,
	   rename: {
	       suffix: '-large',
	       extname: '.webp'
	   }
	}, {
	   // image-large@2x.webp is 960 pixels wide
	   width: 480 * 2,
	   rename: {
	       suffix: '-large@2x',
	       extname: '.webp'
	   }
	}, {
	   // image-extralarge.webp is 1280 pixels wide
	   width: 1280,
	   rename: {
	       suffix: '-extralarge',
	       extname: '.webp'
	   }
	}, {
	   // image-extralarge@2x.webp is 2560 pixels wide
	   width: 1280 * 2,
	   rename: {
	       suffix: '-extralarge@2x',
	       extname: '.webp'
	   }
	}]
};


var responsiveOptions = {
    strictMatchImages: false,
    withoutEnlargement: false,
    skipOnEnlargement: true
};

/* Development Tasks
   ========================================================================== */

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.output
		}
	});
});

gulp.task('html', function() {
	return gulp.src(paths.markup.input)
		.pipe(nunjucksRender({
			path: ['./src/templates']
		}))
		.pipe(gulp.dest(paths.markup.output))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: '<%= file.relative %> : HTML task complete' }))
});

gulp.task('sass', function() {
	return gulp.src(paths.styles.input)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions)).on('error', notify.onError(function(error) {
			return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
		}))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.styles.output))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: '<%= file.relative %> : Sass task complete' }))
});

gulp.task('javascript', function() {
	return browserify({
            entries: paths.javascript.main,
            extensions: ['.js', '.json', '.es6'],
            debug: true
        })
        .transform(babelify.configure({
            presets : ["es2015"],
            sourceMaps:true
        }))
        .bundle()
        .pipe(source('main.js'))
		.pipe(gulp.dest(paths.javascript.output))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: '<%= file.relative %> : Javascript task complete' }))
});

gulp.task('responsive-images', function() {
	return gulp.src(paths.images.input)
		.pipe(responsive(responsiveParams, responsiveOptions))
		.pipe(gulp.dest(paths.images.dist))
		.pipe(notify({ message: '<%= file.relative %> : Responsive Images have been generated' }))
});

gulp.task('svg', ['svg-fallback'], function() {
	return gulp.src(paths.svg.input)
		.pipe(svgSprite(svgOptions))
		.pipe(gulp.dest(paths.svg.output))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: '<%= file.relative %> : SVG task complete' }))
});

gulp.task('svg-fallback', function() {
	gulp.src(paths.svg.input)
		.pipe(svg2png(svgFallbackOptions, true))
		.pipe(gulp.dest(paths.images.output))
		.pipe(notify({ message: '<%= file.relative %> : Fallback png has been generated' }))
});

gulp.task('watch', function() {
	gulp.watch(paths.markup.input, ['html']);
	gulp.watch(paths.styles.input, ['sass']);
	gulp.watch(paths.svg.input, ['svg']);
	gulp.watch(paths.javascript.input, ['javascript']);
});

gulp.task('clean', function() {
	del([paths.output, '!dist/images', '!dist/images/**/*'])
});

/* Optimization Tasks
   ========================================================================== */

gulp.task('optimize-html', ['html'], function() {
	return gulp.src(paths.markup.output + '*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(paths.markup.dist))
		.pipe(notify({ message: 'HTML build task complete' }))
});

gulp.task('optimize-css', ['sass'], function() {
	return gulp.src(paths.styles.output + '*.css')
		.pipe(cssnano())
		.pipe(gulp.dest(paths.styles.dist))
		.pipe(notify({ message: 'CSS build task complete' }))
});

gulp.task('optimize-javascript', ['javascript'], function() {
	return gulp.src([paths.javascript.output + '*.js'])
		.pipe(uglify())
		.pipe(gulp.dest(paths.javascript.dist))
		.pipe(notify({ message: 'Javascript build task complete' }))
});

gulp.task('copy-fonts', function() {
	return gulp.src(paths.fonts.input)
		.pipe(gulp.dest(paths.fonts.dist))
		.pipe(notify({ message: 'Fonts have been copied' }))
});

gulp.task('copy-svg', function() {
	return gulp.src(paths.svg.output + 'sprite.svg')
		.pipe(gulp.dest(paths.svg.dist))
		.pipe(notify({ message: 'SVG build task complete' }))
});

 /* Performance Tasks
    ========================================================================== */

gulp.task('critical', function() {
	return gulp.src('./dist/*.html')
		.pipe(critical({
			base: './dist',
			inline: true,
			minify: true,
			width: 1366,
			height: 800
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(notify({ message: 'Critical CSS has been generated' }))
});


/* Task Runners
   ========================================================================== */

gulp.task('default', [
	'html',
	'sass',
	'javascript',
	'responsive-images',
	'svg',
	'watch',
	'browser-sync'
]);

gulp.task('build', [
	'clean',
	'html',
	'sass',
	'javascript',
	'responsive-images',
	'svg',
	'optimize-html',
	'optimize-css',
	'optimize-javascript',
	'copy-fonts',
	'copy-svg'
]);
