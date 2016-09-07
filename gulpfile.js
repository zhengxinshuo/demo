var gulp=require('gulp');
var rename=require('gulp-rename');
var less=require("gulp-less");
var concat=require("gulp-concat");
var minify=require("gulp-minify-css")


gulp.task('less', function(){
    gulp.src('src/less/*.less')
        .pipe(concat('all.less'))
        .pipe(less({ style: 'expanded' }))
        //.pipe(rename({suffix:'.min'}))
        //.pipe(minify())
        .pipe(gulp.dest("assets/css/"));
});
gulp.task('watch-less',function(){
    gulp.watch(['src/less/*.less'],['less'])
});


//生成add.min.css
gulp.task("add",function(){
    gulp.src('assets/css_test/*.css')
        .pipe(concat('all.css'))
        //.pipe(less({ style: 'expanded' }))
        .pipe(rename({suffix:'.min'}))
        .pipe(minify())
        .pipe(gulp.dest("assets/"));
});

//与线上的css合并
gulp.task("lessadd",function(){
    gulp.src('src/less/add.less')
        .pipe(less({ style: 'expanded' }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest("assets/css_test/"));
});
