const httpUtil = require('../../utils/httpUtil.js')
Page({
    data:{
        photoUrl:'',
        nickname:'',
        gender:'',
        inviteCode:""
    },
    setClipboard:function(){
        let self = this
        wx.setClipboardData({
            data: self.data.inviteCode,
            success: function (res) { 
                wx.showToast({
                    title: '复制成功'
                })
             }
        })
    },
    onReady:function(){
        let self = this
        //加载用户信息
        httpUtil.get('/base/user/current',{
            success:function(res){
                let content = res.data.data.content
                self.setData({
                    photoUrl: content.photo,
                    nickname: content.nickname,
                    gender: content.gender
                })
            }
        })
    }
})