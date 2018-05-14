const httpUtil = require('../../utils/httpUtil.js')

//获取应用实例
const app = getApp()

Page({
  data: {
        listData: [],
        listPic:[],
        searchForm:{
            pageNo:1
        },
        userInfo: {},
        loadMoreShow:false,
        profileInfoBoxShow: false
  },
  toggleProfileInfoBox:function(){
      this.setData({
          profileInfoBoxShow:!this.data.profileInfoBoxShow
      })
  },
  //事件处理函数
  bindViewTap: function () {

  },

  loadData: function(pageNo,complete){
      let self = this
      httpUtil.get('/wwd/users', {
          data: {
              pageable: true,
              pageNo: pageNo,
              includePic: true,
              gender:'female'
          },
          success: function (response) {

              if (complete && typeof complete == 'function') {
                  complete()
              }

              let content = response.data.data.content
              let listPic = response.data.data.pic
              if (content && content.length > 0){
                  if (pageNo > 1) {
                      self.data.listData.push.apply(self.data.listData, content)
                      self.data.listPic.push.apply(self.data.listPic, listPic)
                      self.setData({
                          listData: self.data.listData,
                          listPic: self.data.listPic
                      })
                  } else {
                      self.setData({
                          listData: content,
                          listPic: listPic
                      })
                  }
                  self.setData({
                      loadMoreShow: false,
                      'searchForm.pageNo': response.data.data.page.pageNo
                  })
              }else{

                self.setData({
                    loadMoreShow: true
                })

              }

          }
      })
  },
  //下拉刷新
  onPullDownRefresh: function () {

      this.loadData(1, wx.stopPullDownRefresh)
  },
  onReachBottom: function(){
      
      let self = this
      if (self.data.loadMoreShow){
          return
      }
      self.setData({
          loadMoreShow: true
      })
      console.log("show")
      this.loadData(this.data.searchForm.pageNo + 1)
  },
  onLoad: function () {

      this.loadData(1)
  }
})
