import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

const entry = { main: './scripts/index.js' };

const output = {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist', process.env.NODE_ENV),
  publicPath: '/',
};

const plugins = {
  environments: {
    development: new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      API_STATS: 'http://localhost:3000/stats',
      START_DATE: 20090101,
      END_DATE: 20161231,
      DEBUG: true,
    }),
    staging: new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      API_STATS: 'https://apnic-api.synthmeat.com/stats',
      START_DATE: 20090101,
      END_DATE: 20161231,
      DEBUG: false,
    }),
    production: new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      API_STATS: 'https://apnic-api.synthmeat.com/stats',
      START_DATE: 20090101,
      END_DATE: 20161231,
      DEBUG: false,
    }),
  },
  clean: new CleanWebpackPlugin([`dist/${process.env.NODE_ENV}`], {
    verbose: true,
    dry: false,
  }),
  html: new HtmlWebpackPlugin({
    template: './templates/index.html',
    hash: true,
    inject: 'body',
  }),
  favicon: new FaviconsWebpackPlugin({
    logo: './images/favicon.png',
    inject: true,
    persistentCache: true,
    title: 'APNIC Stats',
  }),
  optimize: new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  uglify: new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  }),
};

const rules = [
  {
    test: /.js?$/,
    use: ['babel-loader'],
    exclude: [
      /node_modules/,
      /dist/,
    ],
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            autoprefixer({ browsers: ['> 5%', 'last 2 versions'] }),
          ],
        },
      },
    ],
    // exclude: /bootstrap/,
  },
  {
    test: /\.html$/,
    use: [{ loader: 'html-loader', options: { name: '[name].[ext]' } }],
  },
  {
    test: /\.png$/,
    use: [{ loader: 'url-loader', options: { limit: 100000 } }],
  },
  {
    test: /\.jpg$/,
    use: ['file-loader'],
  },
  {
    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } }],
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'application/octet-stream' } }],
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: ['file-loader'],
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [{ loader: 'url-loader', options: { limit: 10000, mimetype: 'image/svg+xml' } }],
  },
];

const configs = {
  development: {
    entry,
    output,
    plugins: [
      plugins.clean,
      plugins.html,
      plugins.favicon,
      plugins.environments.development,
    ],
    module: { rules },
  },
  staging: {
    entry,
    output,
    plugins: [
      plugins.clean,
      plugins.html,
      plugins.favicon,
      plugins.optimize,
      plugins.uglify,
      plugins.environments.staging,
    ],
    module: { rules },
  },
  production: {
    entry,
    output,
    plugins: [
      plugins.clean,
      plugins.html,
      plugins.favicon,
      plugins.optimize,
      plugins.uglify,
      plugins.environments.production,
    ],
    module: { rules },
  },
};

const active = () => {
  if (process.env.NODE_ENV === 'development') return configs.development;
  else if (process.env.NODE_ENV === 'staging') return configs.staging;
  else if (process.env.NODE_ENV === 'production') return configs.production;
  console.warn('Wrong NODE_ENV specified!');
  process.exit(1);
};

export default active;

