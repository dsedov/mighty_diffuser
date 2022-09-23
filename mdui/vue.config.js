const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: '/static/',
  outputDir: path.resolve(__dirname, '../mdapp/static/'),
  filenameHashing: false,
  runtimeCompiler: true,
  devServer: {
    devMiddleware: {
      writeToDisk: true, 
    }
  },
})
