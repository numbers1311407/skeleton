var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  nano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  babelify = require('babelify'),
  gutil = require('gulp-util')
  source = require('vinyl-source-stream')
  buffer = require('vinyl-buffer')
  browserify = require('browserify')


gulp.task('js-vendor', function () {
  // Add paths to vendor JS to be concatenated and compiled
  // You may or may not need babel.  Foundation for example is written in
  // ES6 and requires babel to be compiled.  jQuery does not at this time.
  var paths = [
    'node_modules/jquery/dist/jquery.js' //,
    // 'bower_components/foundation-sites/js/foundation.util.mediaQuery.js',
    // 'bower_components/foundation-sites/js/foundation.util.triggers.js',
    // 'bower_components/foundation-sites/js/foundation.util.motion.js',
    // 'bower_components/foundation-sites/js/foundation.equalizer.js',
    // 'bower_components/foundation-sites/js/foundation.reveal.js',
    // 'bower_components/foundation-sites/js/foundation.util.keyboard.js',
    // 'bower_components/foundation-sites/js/foundation.util.box.js',
    // 'bower_components/foundation-sites/js/foundation.toggler.js',
    // 'bower_components/foundation-sites/js/foundation.util.touch.js',
    // 'bower_components/foundation-sites/js/foundation.util.timerAndImageLoader.js',
    // 'bower_components/foundation-sites/js/foundation.util.nest.js',
    // 'bower_components/foundation-sites/js/foundation.tabs.js',
    // 'bower_components/foundation-sites/js/foundation.dropdownMenu.js',
    // 'bower_components/foundation-sites/js/foundation.responsiveMenu.js',
    // 'bower_components/foundation-sites/js/foundation.responsiveToggle.js',
    // 'bower_components/foundation-sites/js/foundation.abide.js',
    // 'bower_components/foundation-sites/js/foundation.accordion.js',
    // 'bower_components/foundation-sites/js/foundation.accordionMenu.js',
    // 'bower_components/foundation-sites/js/foundation.drilldown.js',
    // 'bower_components/foundation-sites/js/foundation.interchange.js',
    // 'bower_components/foundation-sites/js/foundation.magellan.js',
    // 'bower_components/foundation-sites/js/foundation.offcanvas.js',
    // 'bower_components/foundation-sites/js/foundation.orbit.js',
    // 'bower_components/foundation-sites/js/foundation.slider.js',
    // 'bower_components/foundation-sites/js/foundation.sticky.js',
    // 'bower_components/foundation-sites/js/foundation.tooltip.js'
  ];

  return gulp.src(paths)
    .pipe(concat('vendor.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'));
});


gulp.task('js-bundle', function () {
  // See manual for using browserify with gulp/transforms: 
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-transforms.md
  
  var b = browserify({
    entries: './src/js/bundle.js',
    debug: true,
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/js'));
});


gulp.task('sass', function () {
  return gulp.src('./src/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      includePaths : [
        // './bower_components/motion-ui/src',
        './bower_components/foundation-sites/scss'
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions'],
      cascade: false
    }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(nano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'))
});


gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js-bundle']);
});


gulp.task('server', ['watch'], function () {
  browserSync.init({
    notify: false,
    open: false,
    snippetOptions: {
      // this is critical if you're developing a wp site so the back end pages 
      // don't automatically reload as you work on the source.  Gets weird
      // with form submissions and ajax.
      ignorePaths: "wp-admin/**"
    },
    server: {
      baseDir: './',
      port: 3000
    }
    // On my dev setup I already run a web server so I set up browsersync to
    // proxy instead of having it run a server
    //
    // proxy: 'localhost.dev'
  });

  // here we watch the compiled versions for changes so the browser reloads
  // after they're recompiled
  browserSync.watch([
    // '**/*.php', // reload on php changes if developing wordpress
    '**/*.html',
    'assets/css/styles.css',
    'assets/js/bundle.js'
  ])
  .on('change', browserSync.reload)
  .on('error', function (err) {
    console.log('error');
    this.emit('end');
  });

});


gulp.task('js', ['js-vendor', 'js-bundle']);
gulp.task('dist', ['js', 'sass']);
gulp.task('default', ['server']);
