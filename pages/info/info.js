// pages/info/info.js
const dictUtil = require('../../utils/dicUtil.js')
const httpUtil = require('../../utils/httpUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      appConfig: getApp().globalData.config,
      submitBtnDisable:false,
      picData:[
      ],
      areaData:{
          nowIds:[],
          nowNames: [],
          homeIds:[],
          homeNames: []
      },
      wwdUser:{
          name:"",
          gender:null,
          birthDay:null,
          constellation:'',
          college:'',
          major:'',
          education:'',
          profession:'',
          height:null,
          weight:null,
          looks:'',
          shape:'',
          smoking:'',
          drinking:null,
          description:null,
          wechatNumber:null,
          cardNo:null,
          standard:null
      },
      tag:{
          natureText:[],
          nature:{},
          foodText:[],
          food: {},
          movieText:[],
          movie: {},
          tripText:[],
          trip: {},
          sportText:[],
          sport: {},
          hobbyText:[],
          hobby: {}
      }
  
    }, 
  imagePreview: function (e) {
      let self = this
      let src = e.currentTarget.dataset.src
      if(src){
          wx.previewImage({
              current: src, // 当前显示图片的http链接
              urls: [src]
          })
      }

  },
  // 反向数据绑定
  reverseBindWwdUserValue:function(event){
      let attrName = event.currentTarget.dataset.attrName
      let value = event.detail.value
      this.data.wwdUser[attrName] = value
      this.setData({
          'wwdUser': this.data.wwdUser
      })
  },
  bindNowPickerChange:function(e){
      let value = e.detail.value
      let name = e.detail.name
      this.setData({
          'areaData.nowIds': value,
          'areaData.nowNames': name ? name : []
      })
  },
  bindHomePickerChange: function (e) {
      let value = e.detail.value
      let name = e.detail.name
      this.setData({
          'areaData.homeIds': value,
          'areaData.homeNames': name ? name : []
      })
  },
  // 选择照片并上传
  chooseImage: function (event) {
      let self = this
      let picId = event.currentTarget.dataset.picId
      let type = event.currentTarget.dataset.type
      let seq = event.currentTarget.dataset.seq
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              httpUtil.uploadFile('/upload/file',{
                  filePath: tempFilePaths[0],
                  data:{
                      path:'wwd/miniprogram/ablum'
                  },
                  success:res => {
                      var data = JSON.parse(res.data);
                      let content = data.data.content
                      // 更新图片
                      httpUtil.post('/wwd/user/current/pic',{
                        data:{
                            url:content.path,
                            type:type,
                            sequence:seq
                        },
                        success:res => {
                            // 添加完成
                            self.loadPicData()
                        }
                      })
                  }
              })
          }
      })
  },
  //删除照片
  deleteImage:function(event){
      let self = this
      let picId = event.currentTarget.dataset.picId;
      let picData = this.data.picData
      httpUtil.delete('/wwd/user/current/pic/' + picId,{
          success:res => {
              self.loadPicData()
          }
      })

  },
  loadPicData:function(){
      let self = this;
      //加载图片
      httpUtil.get('/wwd/user/current/pic', {
          data: { orderby: 'sequence' },
          success: res => {
              let content = res.data.data.content
              if (content){
                let _content = []
                for(let i = 0;i<content.length;i++){
                    let item = {}
                    for(let key in content[i]){
                        item[key] = content[i][key]
                    }
                    item.picOriginUrl = item.picOriginUrl.replace(/\\/g, '/')
                    item.picThumbUrl = item.picThumbUrl.replace(/\\/g, '/')
                    _content.push(item)
                }
                  self.setData({
                      picData: _content
                  })
              }

          }
      })
  },
  getTagTextByType:function(type,item,callback){

      dictUtil.getDictsByType(type, function (response) {
          let content = response.data.data.content
          let type = {}
          for (let j = 0; j < content.length; j++) {
              type[content[j].value] = content[j].name
          }
          let _nature = []
          if (item.selfContent) {
              _nature.push(item.selfContent)
          }
          if (item.content) {
              let _dictItem = item.content.split(',')
              if (_dictItem) {
                  for (let m = 0; m < _dictItem.length; m++) {
                      _nature.push(type[_dictItem[m]])
                  }
              }

          }
          callback(_nature)
          
      })
  },
  loadTags:function(){
      let self = this
      httpUtil.get('/wwd/user/current/tags', {
          success: res => {
              let tagContent = res.data.data.content
              if (tagContent) {
                  for (let i = 0; i < tagContent.length; i++) {
                      let item = tagContent[i]
                      //性格
                      if (item.type == 'nature_type') {
                          self.getTagTextByType('nature_type',item,function(text){
                            // 
                            self.setData({
                                'tag.natureText': text,
                                'tag.nature': item
                            })
                        })
                      }
                      //爱好
                      if (item.type == 'hobby_type') {
                          self.getTagTextByType('hobby_type', item, function (text) {
                              // 
                              self.setData({
                                  'tag.hobbyText': text,
                                  'tag.hobby': item
                              })
                          })
                      }
                      //电影
                      if (item.type == 'movie_type') {
                          self.getTagTextByType('movie_type', item, function (text) {
                              // 
                              self.setData({
                                  'tag.movieText': text,
                                  'tag.movie': item
                              })
                          })
                      }
                      //食物
                      if (item.type == 'food_type') {
                          self.getTagTextByType('food_type', item, function (text) {
                              // 
                              self.setData({
                                  'tag.foodText': text,
                                  'tag.food': item
                              })
                          })
                      }
                      //旅行
                      if (item.type == 'trip_type') {
                          self.getTagTextByType('trip_type', item, function (text) {
                              // 
                              self.setData({
                                  'tag.tripText': text,
                                  'tag.trip': item
                              })
                          })
                      }
                      //运动
                      if (item.type == 'sport_type') {
                          self.getTagTextByType('sport_type', item, function (text) {
                              // 
                              self.setData({
                                  'tag.sportText': text,
                                  'tag.sport': item
                              })
                          })
                      }
                  }

              }

          }
      })
  },
  completeSubmitBtn: function () {
      let self = this
      let data = this.data.wwdUser
      data.nowAreaIds = this.data.areaData.nowIds
      data.nowAreaNames = this.data.areaData.nowNames
      data.homeAreaIds = this.data.areaData.homeIds
      data.homeAreaNames = this.data.areaData.homeNames
      
      httpUtil.put('/wwd/user/current', {
          data: data,
          success: function (res) {
              wx.showToast({
                  title: '保存成功',
                  icon:'none'
              })
              self.setData({
                  submitBtnDisable: true
              })
          }
      })
  },
  onShow: function () {
      this.loadTags()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let self = this
    self.setData({
        submitBtnDisable:false
    })
      self.loadPicData()
    // 加载区域
      httpUtil.get('/wwd/user/current/area', {
          success: res => {
              let content = res.data.data.content
              if (content) {
                  let nowIds = [];
                  nowIds[0] = content.nowProvinceId
                  nowIds[1] = content.nowCityId
                  nowIds[2] = content.nowDistrictId
                  let homeIds = []
                  homeIds[0] = content.homeProvinceId
                  homeIds[1] = content.homeCityId
                  homeIds[2] = content.homeDistrictId
                  self.setData({
                      'areaData.nowIds': nowIds,
                      'areaData.homeIds': homeIds
                  })
              }
          }
      })
      // 加载用户信息

      httpUtil.get('/wwd/user/current', {
          success: res => {
              let content = res.data.data.content
              self.setData({
                  'wwdUser.name':       content.name,
                  'wwdUser.gender':       content.gender,
                  'wwdUser.birthDay': content.birthDay ? content.birthDay.substring(0, 10) : content.birthDay,
                  'wwdUser.constellation': content.constellation,
                  'wwdUser.college': content.college,
                  'wwdUser.major': content.major,
                  'wwdUser.education': content.education,
                  'wwdUser.profession': content.profession,
                  'wwdUser.height': content.height,
                  'wwdUser.weight': content.weight,
                  'wwdUser.looks': content.looks,
                  'wwdUser.shape': content.shape,
                  'wwdUser.smoking': content.smoking,
                  'wwdUser.drinking': content.drinking,
                  'wwdUser.description': content.description,
                  'wwdUser.wechatNumber': content.wechatNumber,
                  'wwdUser.cardNo': content.cardNo,
                  'wwdUser.standard': content.standard
              })
          }
      })

  }
})