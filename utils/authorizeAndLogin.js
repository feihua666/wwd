const config = require('../config/config.js')
const app = getApp()
//登录授权，获取用户信息
const login = function () {

    // 调用登录接口，获取 code
    wx.login({
        success: loginRes => {
            // 获取用户信息
            wx.getSetting({
                success: setRes => {
                    if (!setRes.authSetting['scope.userInfo']) {
                        // 授权访问  
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success: () => {
                                getUserInfo(loginRes.code)
                            },
                            fail: (p) => {
                                console.log('authorizefail')
                                wx.showModal({
                                    title: '提示',
                                    content: '需要授权登录之后才能操作，是否授权？',
                                    success: function (res) {
                                        if (res.confirm) {
                                            getUserInfo(loginRes.code)
                                        } else if (res.cancel) {
                                            wx.showToast({
                                                title: '您取消了授权设置，如果想开启授权请重新设置',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        getUserInfo(loginRes.code)
                    }
                }
            })
        }
    })
}
const getUserInfo = function (code) {
    //获取用户信息  
    wx.getUserInfo({
        lang: "zh_CN",
        success: function (userRes) {
            let param = {}
            param.code = code
            param.nickname = userRes.userInfo.nickName
            param.photo = userRes.userInfo.avatarUrl
            let gender = userRes.userInfo.gender
            if (gender == '1') {
                param.gender = 'male'
            } else if (gender == '2') {
                param.gender = 'female'
            } else {
                param.gender = 'unknown'
            }
            app.globalData.userInfo = userRes.userInfo
            doLogin(param)
        },
        fail: () => {
            wx.openSetting({
                success: openRes => {
                    if (openRes.authSetting["scope.userInfo"] == true) {
                        getUserInfo(code)
                    }
                }
            })
        }
    })
}
const doLogin = function (param) {
    wx.request({
        url: config.host + '/login',
        data: {
            loginType: 'WX_MINIPROGRAM',
            code: param.code,
            type: "wwd",
            nickname: param.nickname,
            photo: param.photo,
            gender: param.gender
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "accept": "application/json"
        },
        method:'POST',
        //服务端的回掉  
        success: function (response) {
            var content = response.data.token;
            app.globalData.token = content.token;
            wx.setStorageSync(config.cookieKey, response.header["Set-Cookie"])
        }
    }) 
}

module.exports = {
    login: login
}