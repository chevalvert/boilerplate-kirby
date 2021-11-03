const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const root = path.resolve(__dirname, '..')

for (const entry in common.entry) {
  common.entry[entry] = [
    ...common.entry[entry],
    'webpack-hot-middleware/client?reload=true'
  ]
}

module.exports = merge(common, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
              singleton: true // avoid CSS Flashing
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: { path: path.resolve(root, 'config', 'postcss.config.js') },
              sourceMap: true
            }
          },
          {
            loader: 'resolve-url-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
        include: path.join(root, 'src')
      },
      {
        test: /\.(svg|png|jpg|gif|ttf|otf|woff|woff2|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },

  mode: 'development',
  devtool: 'eval-source-map'
})
