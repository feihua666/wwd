//app.js
const config = require('./config/config.js')
App({
  onLaunch: function () {
      this.globalData.config = config
  },
  globalData: {
    userInfo: null,
    token:null,
    dict:{},
    config:null
  }
})