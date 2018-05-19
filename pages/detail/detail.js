const httpUtil = require('../../utils/httpUtil.js')
Page({
    data:{
        appConfig: getApp().globalData.config,
        picUrls:[],
        wwdUser:{},
        userArea:{},
        constellations:[],
        educations:[]
    },
    imagePreview: function(e){
        let self = this
        let src = e.currentTarget.dataset.src
        let urls = []
        for (let i =0;i< self.data.picUrls.length;i++){
            urls.push(self.data.picUrls[i].picOriginUrl)
        }
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: urls // 需要预览的图片http链接列表
      })
    },
    onLoad: function (options) {
        let self = this
        let wwdUserId = options.wwdUserId

        httpUtil.get('/wwd/user/'+ wwdUserId +'/pic',{
            success:response => {
                let content = response.data.data.content
                if (content) {
                  let _content = []
                  for (let i = 0; i < content.length; i++) {
                    let item = {}
                    for (let key in content[i]) {
                      item[key] = content[i][key]
                    }
                    item.picOriginUrl = item.picOriginUrl.replace(/\\/g, '/')
                    item.picThumbUrl = item.picThumbUrl.replace(/\\/g, '/')
                    _content.push(item)
                  }
                  self.setData({
                    picUrls: _content
                  })
                }
            }
        })
     
        httpUtil.get('/wwd/user/' + wwdUserId, {
          success: response => {
            let content = response.data.data.content
            self.setData({
              wwdUser: content
            })
          }
        })

        httpUtil.get('/wwd/user/current/area', {
          success: response => {
            let content = response.data.data.content
            self.setData({
              userArea: content
            })
          }
        })

        //学历
        wx.getStorage({
          key: 'wwd_dic_education_level',
          success: function (res) {
            console.log(res.data)
            self.setData({
              educations: res.data
            })
          },
          fail: function () {
            dicUtil.getDictsByType('education_level', function (res) {
              let educations = res.data.data.content
              self.setData({
                educations: educations
              })
              wx.setStorage({
                key: "wwd_dic_education_level",
                data: educations
              })
            })
          }
        })
        //星座
        wx.getStorage({
          key: 'wwd_dic_constellation_type',
          success: function (res) {
            console.log(res.data)
            self.setData({
              constellations: res.data
            })
          },
          fail: function () {
            dicUtil.getDictsByType('constellation_type', function (res) {
              let constellations = res.data.data.content
              self.setData({
                constellations: constellations
              })
              wx.setStorage({
                key: "wwd_dic_constellation_type",
                data: constellations
              })
            })
          }
        })
    }
})