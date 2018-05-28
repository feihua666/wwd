const httpUtil = require('../../utils/httpUtil.js')
const dictUtil = require('../../utils/dictUtil.js')
const storageUtil = require('../../utils/storageUtil.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //邀请码
      inviteCode:'',
      disableBtn:false
  },
  bindInviteCodeInput:function(e){
    this.setData({
        inviteCode:e.detail.value
    })
  },
    bindgetuserinfo:function(userinfoRes){
        let self = this
        // 同意获取用户信息
        if (userinfoRes.detail.errMsg == 'getUserInfo:ok'){
            let userInfo = userinfoRes.detail.userInfo
            // 判断有没有填写邀请码
            if (self.data.inviteCode == '' || self.data.inviteCode == null) {
                wx.showToast({
                    title: '请输入邀请码',
                    icon: 'none'
                })
                return
            }
            let param = {}
            param.nickname = userInfo.nickName
            param.photo = userInfo.avatarUrl
            param.inviteCode = self.data.inviteCode
            let gender = userInfo.gender
            if (gender == '1') {
                param.gender = 'male'
            } else if (gender == '2') {
                param.gender = 'female'
            } else {
                param.gender = 'unknown'
            }
            param.action = 'addAndLogin'
            self.setData({
                disableBtn:true
            })
            httpUtil.login({
                data:param,
                success:res => {
                    wx.showLoading({
                        title: '跳转中...'
                    })
                    //再获取一次用户信息
                    if (!app.globalData.userInfo) {
                        httpUtil.get('/base/user/current', {
                            success: res => {
                                app.globalData.userInfo = res.data.data.content
                            }
                        })
                    }
                    // 登录成功跳转到列表页面
                    // 先加载字典信息等缓存数据
                    dictUtil.getDictsByType(app.globalData.config.dict, function (res) {
                        let content = res.data.data.content
                        storageUtil.setStorageDict(content)
                        wx.hideLoading()
                        wx.redirectTo({
                            url: '/pages/list/list'
                        })
                    })
                },
                fail: res => {
                    wx.showToast({
                        title: '登录失败，邀请码不正确',
                        icon: 'none'
                    })
                    self.setData({
                        disableBtn: false
                    })
                }
            })
        }
        //不同意获取用户信息
        else{
            wx.showToast({
                title: '取消了会不能使用哦',
                icon: 'none',
                duration: 2000
            })
        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }
})