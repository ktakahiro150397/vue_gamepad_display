const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    devServer: {
      hot: true
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'net.yanelmo.gamepad_input_display',
        win: {
          target: 'portable',
          icon: './src/icon.ico'
        }
      }
    }
  }
})
