const path = require('path')
const webpack = require('webpack')
const root = path.join(__dirname, '..')

// Add here all templates to bundle
const TEMPLATES = [
  'common.js'
]

const entry = { 'assets/builds/bundle.css': [path.join(root, 'src', 'index.scss')] }
for (const template of TEMPLATES) entry['assets/builds/' + template] = [path.join(root, 'src', 'templates', template)]

module.exports = {
  entry,

  output: {
    publicPath: '/',
    path: path.join(root, 'www'),
    filename: '[name]',
    chunkFilename: '[name].[id].chunk.js'
  },

  resolve: {
    alias: {
      utils: path.join(root, 'src', 'utils')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: path.join(root, 'src')
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'ifdef-loader',
        options: { DEVELOPMENT: process.env.NODE_ENV !== 'production' }
      },
      {
        test: /\.svg$/i,
        use: 'raw-loader'
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      h: [path.join(root, 'src', 'utils', 'jsx'), 'h']
    })
  ]
}
