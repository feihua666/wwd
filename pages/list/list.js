const httpUtil = require('../../utils/httpUtil.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    appConfig: app.globalData.config,
    userInfo: app.globalData.userInfo,
    ageRange: [],
    homeArea: [], //["16e00c91fb3611e794174439c4325934", "194b5a34fb3611e794174439c4325934", "19798ea6fb3611e794174439c4325934"]
    nowArea: [],
    ageMultiIndex: [4,16],
    listData: [],
    searchForm: {
      pageNo: 1,
      pageNum: 0
    },
    loadMoreShow: true,
    noMoreDataShow:false,
    education: '',
    gender: '',
    keyword: '',
    searchType: '' // pulldown,pullup,cancelSearch,confirmSearch
  },
  bindFilterToggle: function (e) {
    wx.navigateTo({
      url: '../filter/filter',
    })
  },
  loadData: function (pageNo, searchtype) {
    //加载数据
    let self = this
    self.setData({
        loadMoreShow: true,
        noMoreDataShow: false
    })
    httpUtil.get('/wwd/users', {
      data: {
        pageable: true,
        pageNo: pageNo,
        includePic: true,
        gender: self.data.gender,     //性别
        ageRange: self.data.ageRange, //年龄
        homeArea: self.data.homeArea, //家乡
        nowArea: self.data.nowArea,    //现地址
        education: self.data.education, //学历
        keyword: self.data.keyword   //关键字
      },
      success: function (response) {
        let content = response.data.data.content
        if (content && content.length > 0) {
          if (pageNo > 1) {
            self.data.listData.push.apply(self.data.listData, content)
            self.setData({
              listData: self.data.listData
            })
          } else {
            self.setData({
              listData: content
            })
          }
          self.setData({
            loadMoreShow: false,
            'searchForm.pageNo': response.data.data.page.pageNo,
            'searchForm.pageNum': response.data.data.page.pageNum
          })
        } else {
          self.setData({
            loadMoreShow: false,
            noMoreDataShow:true
          })
        }
        wx.stopPullDownRefresh();
      },
      fail: function () {
        if (searchtype == 'pullup') {
          self.setData({
            loadMoreShow: false
          })
        }
        if (searchtype == 'confirmSearch') {
          wx.showToast({
            title: '无匹配数据',
            icon: 'none'
          })
        }
        wx.stopPullDownRefresh();
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.loadData(1, 'pulldown')
  },
  onReachBottom: function () {
    let self = this
    if (self.data.loadMoreShow) {
      return
    }
    self.setData({
      loadMoreShow: true,
    })
    this.loadData(this.data.searchForm.pageNo + 1, 'pullup')
  },
  onLoad: function () {
    let self = this
    self.setData({
        userInfo: app.globalData.userInfo
    })
    //加载页面列表
    this.loadData(1)
  },
  onShow: function () {
    if (this.data.searchtype == 'confirmSearch') {
      this.loadData(1, this.data.searchtype)
      this.setData({
        searchtype: ""
      })
    }
  },
  onUnload: function () {
   
  }
})
