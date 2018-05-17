const httpUtil = require('../../../utils/httpUtil.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    listData: [],
    listPic: [],
    userInfo: {},
    isHidden: true
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '汪汪队',
      path: '/pages/index/index'
      // , imageUrl: '/resources/images/yy.jpg'
    }
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
        let isHidden = (content == null || content.length == 0) ? false : true
        self.setData({
          listData: content,
          listPic: listPic,
          isHidden: isHidden
        })
      }
    })
  },
  onLoad: function () {

    this.loadData()
  }
})
