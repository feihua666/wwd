const httpUtil = require('../../utils/httpUtil.js')
const storageUtil = require('../../utils/storageUtil.js')
const util = require('../../utils/util.js')
Page({
    data:{
        appConfig: getApp().globalData.config,
        photo:null,
        picUrls:[],
        wwdUser:{},
        userArea:{},
        buttonText:'加载中',
        buttonDisable:true,
        wwdUserId:'',
        wechatNumber:'',
        tag: {
            natureText: [],
            foodText: [],
            movieText: [],
            tripText: [],
            sportText: [],
            hobbyText: []
        }
    },
    setClipboard: function () {
        let self = this
        wx.setClipboardData({
            data: self.data.wechatNumber,
            success: function (res) {

            }
        })
    },
    imagePreview: function(e){
        let self = this
        let src = e.currentTarget.dataset.src
        let urls = []
        for (let i =0;i< self.data.picUrls.length;i++){
            urls.push(util.getFileUrl(self.data.picUrls[i].picOriginUrl))
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
    getTagTextByType: function (type, item, callback) {


        let content = storageUtil.getStorageDict(type)
        let _type = {}
        for (let j = 0; j < content.length; j++) {
            _type[content[j].value] = content[j].name
        }
        let _nature = []
        if (item.selfContent) {
            _nature.push(item.selfContent)
        }
        if (item.content) {
            let _dictItem = item.content.split(',')
            if (_dictItem) {
                for (let m = 0; m < _dictItem.length; m++) {
                    _nature.push(_type[_dictItem[m]])
                }
            }
        }
        callback(_nature)
    },
    loadTags: function (wwdUserId) {
        let self = this
        httpUtil.get('/wwd/user/' + wwdUserId +'/tags', {
            success: res => {
                let tagContent = res.data.data.content
                    for (let i = 0; i < tagContent.length; i++) {
                        let item = tagContent[i]
                        //性格
                        if (item.type == 'nature_type') {
                            self.getTagTextByType('nature_type', item, function (text) {
                                // 
                                self.setData({
                                    'tag.natureText': text
                                })
                            })
                        }
                        //爱好
                        if (item.type == 'hobby_type') {
                            self.getTagTextByType('hobby_type', item, function (text) {
                                // 
                                self.setData({
                                    'tag.hobbyText': text
                                })
                            })
                        }
                        //电影
                        if (item.type == 'movie_type') {
                            self.getTagTextByType('movie_type', item, function (text) {
                                // 
                                self.setData({
                                    'tag.movieText': text
                                })
                            })
                        }
                        //食物
                        if (item.type == 'food_type') {
                            self.getTagTextByType('food_type', item, function (text) {
                                // 
                                self.setData({
                                    'tag.foodText': text
                                })
                            })
                        }
                        //旅行
                        if (item.type == 'trip_type') {
                            self.getTagTextByType('trip_type', item, function (text) {
                                // 
                                self.setData({
                                    'tag.tripText': text
                                })
                            })
                        }
                        //运动
                        if (item.type == 'sport_type') {
                            self.getTagTextByType('sport_type', item, function (text) {
                                // 
                                self.setData({
                                    'tag.sportText': text
                                })
                            })
                        }
                    }


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
                wwdUser: content,
                photo: response.data.data.photo
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
        self.loadTags(wwdUserId)
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

        //微信号
        if ('true' == options.showWechatNumber){
            httpUtil.get('/wwd/user/' + wwdUserId + '/wechatNumber', {
                success: response => {
                    let content = response.data.data.content
                    self.setData({
                        wechatNumber: content.wechatNumber
                    })
                }
            })
        }
    }
})