//app.js
const config = require('./config/config.js')
App({
  onLaunch: function () {
      this.globalData.config = config
      //检测用户登录情况，
      //加载全局数据
  },
  globalData: {
    userInfo: null,
    token:null,
    dict:{},
    area:{},
    config:null
  }
})