const httpUtil = require('../../../utils/httpUtil.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    listData: [],
    listPic: [],
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {

  },
  loadData: function (complete) {
    let self = this
    httpUtil.get('/wwd/myfriends', {
      data: {},
      success: function (response) {

        if (complete && typeof complete == 'function') {
          complete()
        }

        let content = response.data.data.content
        let listPic = response.data.data.pic
        self.setData({
          listData: content,
          listPic: listPic
        })
      }
    })
  },
  onLoad: function () {

    this.loadData()
  }
})
