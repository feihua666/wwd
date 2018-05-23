const httpUtil = require('../../utils/httpUtil.js')
const dictUtil = require('../../utils/dictUtil.js')
const config = require('../../config/config.js')
const storageUtil = require('../../utils/storageUtil.js')
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
      //获取当前登录用户信息,并保证自动登录

    httpUtil.get('/base/user/current',{
        success:function(res){
            // 成功跳转到列表页面
            wx.redirectTo({
                url: '/pages/list/list'
            })
        },
        fail: res => {
            // 不成功
            // 如果是用户未登录
            let status = res.statusCode
            if (status == 401 && 'E401_100002' == res.data.code) {
                // 尝试登录
                httpUtil.login({
                    data: {
                        action: 'login'
                    },
                    success: function (res) {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'none'
                        })
                        // 登录成功跳转到列表页面
                        // 先加载字典信息等缓存数据
                        dictUtil.getDictsByType(app.globalData.config.dict,function(res){
                            let content = res.data.data.content
                            storageUtil.setStorageDict(content)
                            wx.redirectTo({
                                url: '/pages/list/list'
                            })
                        })

                    },
                    fail: function (res) {
                        //登录失败，绑定邀请码
                        wx.redirectTo({
                            url: '/pages/login/login'
                        })
                    }
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