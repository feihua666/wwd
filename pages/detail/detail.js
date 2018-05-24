const httpUtil = require('../../utils/httpUtil.js')
Page({
    data:{
        appConfig: getApp().globalData.config,
        picUrls:[],
        wwdUser:{},
        userArea:{},
        buttonText:'加载中',
        buttonDisable:true,
        wwdUserId:''
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
    // 有意思按钮
    bindSubmitBtn:function(){
        let self = this
        // 发起对他有意思
        httpUtil.post('/wwd/user/current/enjoy/' + this.data.wwdUserId, {
            success: response => {
                self.setData({
                    buttonText: '已对 Ta 有意思',
                    buttonDisable: true
                })

            }
        })
    },
    onLoad: function (options) {
        let self = this
        let wwdUserId = options.wwdUserId
        self.setData({
            wwdUserId:wwdUserId
        })
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

        httpUtil.get('/wwd/user/' + wwdUserId +'/area', {
          success: response => {
            let content = response.data.data.content
            self.setData({
              userArea: content
            })
          }
        })
        // 查询我是否对他有意思
        httpUtil.get('/wwd/user/current/enjoy/' + wwdUserId, {
            success: response => {
                let content = response.data.data.content
                // 存在数据表示已有意思
                if (content){
                    self.setData({
                        buttonText: '已对 Ta 有意思',
                        buttonDisable: true
                    })
                }
                //不存在数据，可以点击有意思
                else{
                    self.setData({
                        buttonText: '有意思',
                        buttonDisable: false
                    })
                }
            },
            fail: res=>{
                // 不存在，可以点击有意思
                let status = res.statusCode
                if (status ==404 ){
                    self.setData({
                        buttonText: '有意思',
                        buttonDisable: false
                    })
                }
            }
        })
    }
})