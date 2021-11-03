const fs = require('fs-extra')
const path = require('path')
const browserSync = require('browser-sync')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.dev')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const php = require('@pqml/node-php-server')
const { Tail } = require('tail')
const sh = require('kool-shell/namespaced')('__kirbywebpack')
const LOGPATH = path.join(process.cwd(), 'php-error.log')

const isMacOS = (require('os').platform() === 'darwin')

const bs = browserSync.create()

let isWebpackInit, isPhpInit
let compiler
let hotMiddleware, devMiddleware, proxyAddr, phpServer

const WWW = path.join(__dirname, '..', 'www')

phpInit()

function phpInit () {
  sh.log()
  sh.step(1, 3, 'Starting a php server...')

  const args = [
    '-d', 'upload_max_filesize=100M',
    '-d', 'post_max_size=500M',
    '-d', 'short_open_tag=On',
    // Enable custom php router to handle routes with dots in it, this is needed
    // to use content representations
    path.join(WWW, 'kirby', 'router.php'),
    '-d', `error_log="${LOGPATH}"`
  ]

  phpServer = php({
    // The alias/path to the php binary. OSX has PHP available natively.
    // You have to edit this to have the devServer working on Windows.
    // Use the proxy opt if you can't use / don't want to use a built-in php serv.
    bin: 'php',
    // Host used by the php built-in server. Only used when proxy is false.
    // Default is localhost.
    // On Mac, the default will be [::1] (IPv6 equivalent of localhost)
    // See: http://php.net/manual/en/features.commandline.webserver.php#120449
    // You might need to change config/config.localhost.php into config.[YOURHOST].php
    // In order for kirby-webpack to continue working with your host
    host: 'localhost',
    root: WWW,
    verbose: true,
    promptBinary: true,
    args
  })

  phpServer.on('start', ({ host, port }) => {
    if (isPhpInit) return
    // php server can't be reach through localhost, we have to use [::1]
    sh.log('PHP Server started on ' + host + ':' + port + '\n')

    if (isMacOS && host === 'localhost') {
      sh.warn('\nOn MacOS / OSX, Node can\'t reach PHP built-in server through localhost.\nProxying [::1]:' + port + ' instead.')
      host = '[::1]'
    }

    proxyAddr = host + ':' + port
    isPhpInit = true
    webpackInit()
  })

  phpServer.start()
}

function webpackInit () {
  sh.log()
  sh.step(2, 3, 'Running the webpack compiler...')

  compiler = webpack(webpackConfig)
  hotMiddleware = webpackHotMiddleware(compiler)
  devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: {
      colors: true,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })
  compiler.hooks.done.tap('kirbywebpack-done', () => {
    // Init the browserSync server once a first build is ready
    if (isWebpackInit) return
    isWebpackInit = true
    process.nextTick(browserSyncInit)
  })
}

function browserSyncInit () {
  sh.log()
  sh.step(3, 3, 'Starting the browser-sync server...')

  const middlewares = [devMiddleware, hotMiddleware]

  // Add a custom event for change in the www/content folder
  // to enable livereload on the site but disable it on panel to avoid reload
  // when editing the content.
  bs.use({
    plugin () {},
    hooks: {
      'client:js': fs.readFileSync(
        path.join(__dirname, 'utils', 'browsersync-update-content.js'),
        'utf-8'
      )
    }
  })

  const BROWSERSYNC_OPTIONS = {
    port: 8080,
    proxy: {
      target: proxyAddr,
      middleware: middlewares,
      proxyReq: [(proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-For', 'webpack')
        proxyReq.setHeader('X-Forwarded-Host', req.headers.host)
        proxyReq.setHeader('X-Forwarded-Proto', BROWSERSYNC_OPTIONS.https ? 'https' : 'http')
      }]
    },
    https: false,
    open: false,
    reloadOnRestart: true,
    notify: false,
    files: [path.join(WWW, '**/*')],
    watchOptions: {
      ignoreInitial: true,
      ignored: [
        path.join(WWW, '**/*.log'),
        path.join(WWW, 'content'),
        path.join(WWW, 'content', '**/*'),
        path.join(WWW, 'media'),
        path.join(WWW, 'site', 'accounts', '**/*'),
        path.join(WWW, 'site', 'cache'),
        path.join(WWW, 'site', 'cache', '**/*'),
        path.join(WWW, 'site', 'logs'),
        path.join(WWW, 'site', 'sessions'),
        path.join(WWW, 'thumbs', '**/*')
      ]
    }
  }

  bs.init(
    BROWSERSYNC_OPTIONS,
    (error, instance) => {
      if (error) throw error
      // custom event for change in the www/content folder
      bs.watch(path.join(WWW, 'content', '**/*'), {
        ignored: '**/.lock'
      }).on('change', (file) => {
        instance.io.sockets.emit('kirby:contentupdate', { file: file })
      })
      ready()
    })
}

function ready () {
  process.nextTick(() => {
    sh.log()
    sh.success('kirby-webpack server is up and running\n')
    logPhpError()
  })
}

function logPhpError () {
  Promise.resolve()
    .then(() => fs.remove(LOGPATH))
    .then(() => fs.ensureFile(LOGPATH))
    .then(() => {
      const tail = new Tail(LOGPATH, {
        useWatchFile: true,
        fsWatchOptions: { interval: 300 }
      })
      tail.on('line', (data) => {
        if (/^\[[a-zA-Z0-9: -]+\] .+/g.test(data)) {
          data = data.toString('utf8').split(']')
          const date = sh.colors.gray(data.shift() + ']')
          data = date + data.join(']')
        }
        sh.log(sh.colors.red('[PHP]') + data)
      })
      tail.on('error', err => sh.error(err))
    })
    .catch(err => {
      sh.error(err)
    })
}
