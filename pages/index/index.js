const httpUtil = require('../../utils/httpUtil.js')
const config = require('../../config/config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let self = this
      //获取当前登录用户信息

    httpUtil.get('/base/user/current',{
        success:function(res){
            let status = res.statusCode
            wx.redirectTo({
                url: '/pages/list/list'
            })
        },
        fail:function(res){
            let status = res.statusCode
            if (status == 401) {
                // 如果没有登录，自动登录
                wx.showLoading({
                    title: '登录中...'
                })
                // 
                // 调用登录接口，获取 code
                wx.login({
                    success: loginRes => {
                        let code = loginRes.code
                        let param = {}
                        param.loginType = 'WX_MINIPROGRAM'
                        param.type = "wwd"
                        param.code = code
                        param.action = 'login'
                        httpUtil.post('/login', {
                            data: param,
                            success: function (res) {
                                var content = res.data.token;
                                app.globalData.token = content.token;
                                wx.setStorageSync(config.cookieKey, res.header["Set-Cookie"])
                                wx.hideLoading()
                                // 自动登录成功，跳转到列表页面
                                wx.redirectTo({
                                    url:'/pages/list/list'
                                })
                            },
                            fail:function(res){
                                // 登录不成功，说明没有绑定邀请码和用户微信登录
                                wx.redirectTo({
                                    url: '/pages/login/login'
                                })
                            }
                        })
                    }
                })
            }else{
                // 正在登录中，直接跳转到列表页面
                wx.redirectTo({
                    url: '/pages/list/list'
                })
            }
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