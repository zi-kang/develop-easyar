/**
 * Created by huzikang on 17/8/11.
 */
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    cleanCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    fs = require('fs'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

//开发
gulp.task('clean',function(){
    gulp.src('dev/*')
        .pipe(clean());
});

gulp.task('copyJs',function(){
   gulp.src('source/js/*.js')
       .pipe(concat('main.js') )
       .pipe( gulp.dest('dev/js/') )
});
gulp.task('copyFont',function(){
   gulp.src('source/font/*')
       .pipe( gulp.dest('dev/font/') )
});
gulp.task('copyImg',function(){
   gulp.src('source/image/*')
       .pipe( gulp.dest('dev/image') )
});

gulp.task('html',function(){
   gulp.src(['source/*.html','source/*/*.html'])
       .pipe( gulp.dest('dev/') )
});

gulp.task('include', function(){
    var htmlDir = './dev/';
    fs.readdir(htmlDir, function(err, files) {
        if (err) {
            console.log(err);
        } else {
            files.forEach(function(f) {
                if (f !== 'header.html' && f !== 'footer.html') {
                    console.info( f );
                    gulp.src(htmlDir + f)
                        .pipe(replace(/<!--header-->[\s\S]*<!--headerend-->/, '<!--header-->\n' + fs.readFileSync(htmlDir + 'layout/header.html', 'utf-8') + '\n<!--headerend-->'))
                        .pipe(replace(/<!--footer-->[\s\S]*<!--footerend-->/, '<!--footer-->\n' + fs.readFileSync(htmlDir + 'layout/footer.html', 'utf-8') + '\n<!--footerend-->'))
                        .pipe(gulp.dest(htmlDir))
                }
            });
        }
    });
});




gulp.task('less',function(){
    gulp.src(['source/less/index.less'])
        .pipe( less() )
        .pipe(autoprefixer({
            browsers: ['last 20 versions','last 2 Explorer versions','last 3 Safari versions','Firefox >= 20'],
            cascade: true
        }))
        .pipe( gulp.dest('dev/css/'));
});
gulp.task('watch',function(){
    gulp.watch('source/less/*.less',['less']);
    gulp.watch('source/*.html',['html']);
    gulp.watch('dev/*.html',['include']);
});
gulp.task('localhost',function(){
    connect.server({
        root:'./',
        port:8090
    });

});


//发布
gulp.task('publishCss',function(){
    gulp.src(['dev/css/*.css'])
        .pipe( cleanCss() )
        .pipe( gulp.dest('release/css/'));
});
gulp.task('publishJs',function(){
    gulp.src(['dev/js/*.js'])
        .pipe( uglify() )
        .pipe( gulp.dest('release/js/'));
});
gulp.task('publishImg',function(){
    gulp.src(['dev/image/*'])
        .pipe( gulp.dest('release/image/'));
});
gulp.task('publishFont',function(){
    gulp.src(['dev/font/*'])
        .pipe( gulp.dest('release/font/'));
});
gulp.task('publishHtml',function(){
    gulp.src(['dev/*.html'])
        .pipe( gulp.dest('release/'));
});


gulp.task('dev',['copyJs','copyImg','copyFont','less','html']);
gulp.task('publish',['publishCss','publishJs','publishImg','publishFont','publishHtml']);
gulp.task('default',['include','localhost','watch']);
