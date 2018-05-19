const httpUtil = require('../../utils/httpUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInList:false,
    isverified:false
  },

    setShowInList:function(e){
        let self = this
        let value = e.detail.value
        self.setData({
            showInList: value
        })
        if (!this.data.isverified) {
            wx.showToast({
                title: '先完善资料才能开启哦'
            })
            self.setData({
                showInList: false
            })
            return
        }
        httpUtil.put('/wwd//user/current/showinlist',{
            data: {
                showInList: self.data.showInList == true ? 'Y' : 'N'
            },
            fail: res =>{
                let status = res.statusCode
                if (status == 409 && self.data.showInList){
                    wx.showToast({
                        title: '先完善资料才能开启哦'
                    })
                    self.setData({
                        showInList: false
                    })
                }
            }
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let self = this
      httpUtil.get('/wwd/user/current',{
          success: res => {
              let content = res.data.data.content
              self.setData({
                  showInList: content.showInList == 'Y'?true:false,
                  isverified: content.isverified == 'Y' ? true : false
              })
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})