const httpUtil = require('../../../utils/httpUtil.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    appConfig: getApp().globalData.config,
    listData: [],
    listPic: []
  },
  loadData: function (complete) {
    let self = this
    httpUtil.get('/wwd/myfriends', {
      data: {},
      success: function (response) {

        let content = response.data.data.content
        let listPic = response.data.data.pic
        self.setData({
          listData: content,
          listPic: listPic
        })
      },
      fail: function (e) {
          self.setData({
              listData: [],
              listPic: []
          })
      }
    })
  },
  onLoad: function () {
    this.loadData()
  }
})
