const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const terser = require("gulp-terser");
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// Путь к файлам
const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/'
    },
    images: {
        src: 'src/images/*',
        dest: 'dist/images'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    }
};

// Компиляция SCSS в CSS
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Минификация и конкатинация JS
function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(concat('script.min.js'))
        .pipe(terser())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Оптимизация изображений
function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
}

// Копирование HTML и перезагрузка
function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// Слежение за изменениями
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.html.src, html);
}

// Задачи для сборки
const build = gulp.series(gulp.parallel(styles, scripts, images, html), watchFiles);

// Экспорт задач
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.html = html;
exports.watch = watchFiles;
exports.build = build;
