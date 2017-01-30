module.exports = {
  entry: __dirname + '/../',
  output: {
    path: __dirname,
    filename: 'diyai.js',
    libraryTarget: 'this',
    library: 'Diyai'
  },
  externals: {}
};
