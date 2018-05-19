const httpUtil = require('../../utils/httpUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    listPic: [],
    status:'1'
  },
  bindTitleClick:function(e){
      let id = e.currentTarget.id
      this.setData({
        status:id
      })
      this.loadData()
  },
  loadData: function () {
    let self = this
    httpUtil.get('/wwd/user/current/enjoys/'+self.data.status, {
      data: {},
      success: function (response) {

        let content = response.data.data.content
        let listPic = response.data.data.pic
    
        self.setData({
          listData: content,
          listPic: listPic,
          isHidden: true
        })
      },
      fail: function (e) {
        self.setData({
            listData: [],
            listPic: [],
            isHidden: false
        })
      }
    })
  },
  onLoad: function () {

    this.loadData()
  }
})