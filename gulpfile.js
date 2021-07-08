const __prod__ = process.env.NODE_ENV === 'production'
const { src, dest, watch, series, parallel } = require('gulp')

const noop = require('gulp-noop')
const merge = require('merge-stream')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const { createGulpEsbuild } = require('gulp-esbuild')

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const rimraf = require('rimraf')

sass.compiler = require('node-sass')

const beScriptEsBuild = createGulpEsbuild({
  incremental: true,

})

const feScriptEsBuild = createGulpEsbuild({
  incremental: true,
})

const scripts = [
  {
    src: './src/index.js',
    esbuild: beScriptEsBuild,
    option: {
      minify: __prod__,
      bundle: true,
      loader: {
        '.js': 'jsx',
        '.svg': 'text',
      },
      outfile: 'blocks.build.js',
    },
  },
  {
    src: './src/frontend.js',
    esbuild: feScriptEsBuild,
    option: {
      minify: __prod__,
      bundle: true,
      loader: {
        '.js': 'jsx'
      },
      outfile: 'blocks.build.frontend.js',
    },
  }
]

const styles = [
  {
    src: './src/scss/editor.s[ca]ss',
    distName: 'blocks.editor.build.css'
  },
  {
    src: './src/scss/style.s[ca]ss',
    distName: 'blocks.style.build.css'
  }
]

const _styles = () => {
  const task = styles.map((style) =>
    src(style.src)
      .pipe(
        sass({ outputStyle: 'compressed' }).on('error', sass.logError)
      )
      .pipe(postcss())
      .pipe(
        autoprefixer({
          browserlist: ['last 2 versions'],
          cascade: false
        })
      )
      .pipe(__prod__ ? cleanCSS({ compatibility: 'ie8' }) : noop())
      .pipe(concat(style.distName))
      .pipe(dest('./dist'))
  )

  return merge(task)
}

function _build() {
  const task = scripts.map(script =>
    src(script.src)
      .pipe(babel({
        presets: ['@babel/preset-env',
          [
            '@babel/preset-react',
            {
              development: !__prod__
            }
          ]
        ],
      }))
      .pipe(script.esbuild({
        ...script.option
      }))
      .pipe(dest('./dist'))
  )

  return merge(task)
}

function _clean(cb) {
  rimraf('./dist/**/*.*', cb)
}

function watchTask(cb) {
  watch('./src/**/*.s[ca]ss', _styles)
  watch('./src/**/*.(js|jsx)', _build)
  cb()
}

exports.default = series(_clean, _build, _styles, watchTask)
exports.build = series(_clean, parallel(_build, _styles))
