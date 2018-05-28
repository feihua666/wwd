const httpUtil = require('../../../utils/httpUtil.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    appConfig: getApp().globalData.config,
    listData: [],
    listPic: []
  },
  navigate:function(e){
      let isverified = e.currentTarget.dataset.isverified
      let showInList = e.currentTarget.dataset.showInList
      if ('Y' == showInList && isverified == 'Y'){
          wx.navigateTo({
              url: '/pages/detail/detail?wwdUserId=' + e.currentTarget.id
          })
      }
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
