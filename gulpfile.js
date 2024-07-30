const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const browsersync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");
const del = require("del");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const tinypng = require('gulp-tinypng-compress');
const gulpIf = require('gulp-if');
const fs = require('fs');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
/* Options
 * ------ */
const options = {
  pug: {
    src: ["app/views/*.pug", "app/views/!blocks/**", "app/views/!layout/**"],
    all: "app/views/**/*.pug",
    dest: "template",
  },
  styles: {
    src: ["app/scss/**/*.scss", "app/scss/blocks/*.scss"],
    dest: "template/css",
  },
  scripts: {
    src: "app/js/**/*.js",
    dest: "template/js",
  },
  images: {
    src: "app/assets/images/*.+(png|jpeg|jpg|gif|svg)",
    dest: "template/assets/images",
  },
  fonts: {
    src: "app/assets/font/*/*",
    dest: "template/assets/font",
  },
  browserSync: {
    baseDir: "template",
  },
};


// Coppy Library
function copyLibrary() {
  return gulp.src(['app/assets/library/**/*']).pipe(gulp.dest('template/assets/library'));
}
copyLibrary();

// Coppy Library
function copyGetfile() {
  return gulp.src(['app/views/getfile.php']).pipe(gulp.dest('template'));
}
copyGetfile();

//Tiny PNG
var API_KEY = [
  '8FiQFj9oWwEyTBHMMwxjvuYNx05Fphk2'
];

function optimizeImages() {
  const sizeLimit = 1024 * 1024;

  return gulp.src('app/assets/images/**/*.{png,jpg,jpeg}')
    .pipe(plumber())
    .pipe(gulpIf(file => {
      const stats = fs.statSync(file.path);
      return stats.size > sizeLimit;
    }, tinypng({
      key: 'FGoVcM6w4vm17yx_H4DCdqoePrn4CF2Z',
      sigFile: 'images/.tinypng-sigs',
      log: true
    })))
    .pipe(gulp.dest('template/assets/images'));
}
optimizeImages()


/* Browser-sync
 * ------------ */
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: options.browserSync.baseDir,
    },
    port: 3000,
  });
  done();
}

/* Styles
 * ------ */

function styles() {
  return gulp
    .src(options.styles.src)
    .pipe(
      plumber(function (err) {
        console.log("Styles Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    // .pipe(sourcemaps.init())
    // .pipe(rename(function (filePath) {
    //   if (filePath.dirname.includes('blocks') && filePath.basename.startsWith("_")) {
    //     filePath.basename = filePath.basename.substring(1);
    //   }
    // }))
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
        grid: true,
      })
    )
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.styles.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

/* Scripts
 * ------ */



function scripts() {
  return gulp
    .src(options.scripts.src)
    .pipe(
      plumber(function (err) {
        console.log("Scripts Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(gulp.dest(options.scripts.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

/* Views
 * ------ */

function views() {
  return gulp
    .src(options.pug.src)
    .pipe(
      plumber(function (err) {
        console.log("Pug Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(options.pug.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

/* Images
 * ------ */

function images() {
  return gulp
    .src(options.images.src)
    .pipe(gulp.dest(options.images.dest));
}

/* Fonts
 * ------ */

function fonts() {
  return gulp.src(options.fonts.src).pipe(gulp.dest(options.fonts.dest));
}

/* Clean up
 * ------ */

async function clean() {
  return Promise.resolve(del.sync("template"));
}

function watchFiles() {
  gulp.watch(options.pug.all, views);
  gulp.watch(options.styles.src, styles);
  gulp.watch(options.scripts.src, scripts);
  gulp.watch(options.images.src, images);
  gulp.watch(options.fonts.src, fonts);
}

/* Build
 * ------ */
const build = gulp.series(
  clean,
  gulp.parallel(styles, views, scripts, images, fonts)
);
const watch = gulp.parallel(watchFiles, browserSync);
// export tasks
exports.styles = styles;
exports.views = views;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
