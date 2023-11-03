const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
var sourcemaps = require('gulp-sourcemaps');
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const browsersync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");
const del = require("del");
const plumber = require("gulp-plumber");

/* Options
 * ------ */
const options = {
  pug: {
    src: ["app/views/*.pug", "app/views/!blocks/**", "app/views/!layout/**"],
    all: "app/views/**/*.pug",
    dest: "template",
  },
  styles: {
    src: "app/scss/**/*.scss",
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
function copyLibrary() {
  return gulp.src(['app/assets/library/**/*']).pipe(gulp.dest('template/assets/library'));
}
copyLibrary();

function copyGetfile() {
  return gulp.src(['app/views/getfile.php']).pipe(gulp.dest('template'));
}
copyGetfile();

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: options.browserSync.baseDir,
    },
    port: 3000,
  });
  done();
}

function styles() {
  return gulp
    .src(options.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(
      plumber(function (err) {
        console.log("Styles Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
        grid: true,
      })
    )
    .pipe(gulp.dest(options.styles.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}
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
function images() {
  return gulp
    .src(options.images.src)
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest(options.images.dest));
}
function fonts() {
  return gulp.src(options.fonts.src).pipe(gulp.dest(options.fonts.dest));
}
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
