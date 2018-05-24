const httpUtil = require('../../utils/httpUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appConfig: getApp().globalData.config,
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    listData1: [],
    listPic1: [],
    listData2: [],
    listPic2: [],
    listData3: [],
    listPic3: [],
  },
  tabClick:function(e){
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      })
      this.loadData()
  },
  loadData: function () {
    let self = this
    httpUtil.get('/wwd/user/current/enjoys/' + self.data.activeIndex, {
      data: {},
      success: function (response) {

        let content = response.data.data.content
        let listPic = response.data.data.pic
        if (self.data.activeIndex == "1"){
            self.setData({
                listData1: content,
                listPic1: listPic
            })
        } else if (self.data.activeIndex == "2") {
            self.setData({
                listData2: content,
                listPic2: listPic
            })
        }else {
            self.setData({
                listData3: content,
                listPic3: listPic
            })
        }
        self.setData({
          listData: content,
          listPic: listPic,
          isHidden: true
        })
      },
      fail: function (e) {
          if (self.data.activeIndex == "1") {
              self.setData({
                  listData1: [],
                  listPic1: []
              })
          } else if (self.data.activeIndex == "2") {
              self.setData({
                  listData2: [],
                  listPic2: []
              })
          } else {
              self.setData({
                  listData3: [],
                  listPic3: []
              })
          }
      }
    })
  },
  onLoad: function () {

    this.loadData()
  }
})