const httpUtil = require('../../utils/httpUtil.js')
Page({
    data:{
        picUrls:[],
        wwdUser:{}
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
                self.setData({
                    picUrls: content
                })
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
    }
})