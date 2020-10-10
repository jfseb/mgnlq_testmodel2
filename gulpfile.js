

var gulp = require('gulp');

var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

/**
 * Directory containing generated sources which still contain
 * JSDOC etc.
 */
var srcDir = 'src';
var testDir = 'test';

gulp.task('watch', function () {
  return gulp.watch([srcDir + '/**/*.js', testDir + '/**/*.js', srcDir + '/**/*.tsx',  srcDir + '/**/*.ts', 'gulpfile.js'],
    gulp.series('tsc', 'eslint', 'test'));
});


// compile with inlineSourceMaps  ( this should be same as plain tsc execution on commandline)
gulp.task('tsc', function () {
  var tsProject = ts.createProject('tsconfig.json', { declaration: true, sourceMap : false, inlineSourceMap: true });
  return tsProject.src() // gulp.src('lib/*.ts')
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js'));
});

var del = require('del');

gulp.task('clean_testmodel_zip', function () {
  return del([
    'testmodel2/_cache.js.zip',
    'mgrecrep2/_cache.js.zip'
  ],{ force : true});
});


gulp.task('clean:models', function () {
  return del([
    'test/data/mongoose_record_replay/testmodel/data/*',
    'test/data/mongoose_record_replay/testmodel/queries.json',
    'sensitive/_cachefalse.js.zip',
    'testmodel2/_cachefalse.js.zip',
    'node_modules/mgnlq_testmodel/testmodel/_cache.js.zip',
    'node_modules/mgnlq_testmodel_replay/testmodel/_cache.js.zip',
    'node_modules/abot_testmodel/testmodel/_cachefalse.js.zip',
    'node_modules/abot_testmodel/testmodel/_cachetrue.js.zip',
    'testmodel/_cachefalse.js.zip',
    'mgrecrep2/data/*',
    'testmodel2/_cache.js.zip',
    'mgrecrep2/_cache.js.zip',
    'testmodel2/_cache.js.zip',
    'sensitive/_cachetrue.js.zip',
    'testmodel2/_cachetrue.js.zip',
    'testmodel/_cachetrue.js.zip',
    'testmodel2/_cache.js.zip',
    'testmodel/_cache.js.zip'
  ], { force : true});
});

gulp.task('clean', gulp.series('clean:models'));


var jest = require('gulp-jest').default;

gulp.task('jestonly', function () {
  process.env.NODE_ENV = 'test';
  return gulp.src('test').pipe(jest({
    'preprocessorIgnorePatterns': [
      './dist/', './node_modules/'
    ],
    'automock': false
  }));
});

const eslint = require('gulp-eslint');

gulp.task('eslint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['src/**/*.js', 'test/**/*.js', 'gulpfile.js'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
    .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('test', gulp.series('tsc', 'jestonly')); 

const gulpRun = require('gulp-run');

gulp.task('pack', () => {
  return gulpRun('npm pack').exec().pipe(gulp.dest('outpu'));
});

var jsdoc = require('gulp-jsdoc3');

gulp.task('doc', gulp.series('test', function (cb) {
  return gulp.src([srcDir + '/**/*.js', 'README.md', './js/**/*.js'], { read: false })
    .pipe(jsdoc(cb));
}));

// Default Task
gulp.task('default', gulp.series('tsc', 'eslint', 'test', 'doc'));
gulp.task('build', gulp.series('tsc', 'eslint'));
