const httpUtil = require('../../utils/httpUtil.js')
const config = require('../../config/config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //邀请码
      inviteCode:''
  },
  bindInviteCodeInput:function(e){
    this.setData({
        inviteCode:e.detail.value
    })
  },
  doLogin(param){
      param.loginType = 'WX_MINIPROGRAM'
      param.type = "wwd"
      param.action = 'addAndLogin'
      httpUtil.post('/login',{
          data:param,
          success:function(res){
              var content = res.data.token;
              app.globalData.token = content.token;
              wx.setStorageSync(config.cookieKey, res.header["Set-Cookie"])

              //登录完成，跳转到列表页面
              wx.redirectTo({
                  url: '/pages/list/list'
              })
          },
          fail:function(res){
              wx.showToast({
                  title: '登录失败，邀请码不正确',
                  icon: 'none'
              })
          }
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
            // 调用登录接口，获取 code
            wx.login({
                success: loginRes => {
                    let code = loginRes.code

                    let param = {}
                    param.code = code
                    param.nickname = userInfo.nickName
                    param.photo = userInfo.avatarUrl
                    let gender = userInfo.gender
                    if (gender == '1') {
                        param.gender = 'male'
                    } else if (gender == '2') {
                        param.gender = 'female'
                    } else {
                        param.gender = 'unknown'
                    }

                    self.doLogin(param)
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