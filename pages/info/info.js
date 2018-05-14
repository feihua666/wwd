// pages/info/info.js
const dictUtil = require('../../utils/dicUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      picData:[
          {
              id:1,
              url:'http://pic-cdn.bixinapp.com/boardPic/183efc5fca9c4e40a9f8059cdb0005aaVMN5yQp7_origin.jpg'
          },
          {
              id: 2,
              url: 'http://pic-cdn.bixinapp.com/boardPic/183efc5fca9c4e40a9f8059cdb0005aaVMN5yQp7_origin.jpg'
          }, {
              id: 3,
              url: 'http://tmp/wx66be83d17ee00f28.o6zAJs7QzCZAR0E-P9Eq….p3WAOWTGZ4Uz54d5283ba0cce138bbaf64d09357a706.png'
          }
      ],
      areaData:{
          nowProvinceId:'',
          nowProvinceName:'',
          nowCityId:'',
          nowCityName:'',
          nowDistrictId:'',
          nowDistrictName:'',

          homeProvinceId: '',
          homeProvinceName: '',
          homeCityId: '',
          homeCityName: '',
          homeDistrictId: '',
          homeDistrictName: '',
      },
      wwdUser:{
          name:"飞华",
          gender:'male',
          birthday:'',
          constellation:'',
          college:'',
          major:'',
          education:'',
          profession:'',
          height:'',
          weight:'',
          Looks:'',
          shape:'',
          smoking:'',
          drinking:'',
      },
      dict:{}
  
    }, 
  bindGenderPickerChange: function (e) {
      console.log(e.detail)
      this.setData({
          'wwdUser.gender': e.detail.value
      })
  }, 
  bindBirthdayPickerChange: function (e) {
      this.setData({
          'wwdUser.birthday': e.detail.value
      })
  },
  bindConstellationPickerChange: function (e) {
      this.setData({
          'wwdUser.constellation': e.detail.value
      })
  }, 
  bindEducationPickerChange: function(e) {
      this.setData({
          'wwdUser.education': e.detail.value
      })
  }, 
  bindLooksPickerChange: function(e) {
      this.setData({
          'wwdUser.looks': e.detail.value
      })
  },
  bindShapePickerChange: function (e) {
        this.setData({
            'wwdUser.shape': e.detail.value
        })
    },
  bindSmokingPickerChange: function (e) {
      this.setData({
          'wwdUser.smoking': e.detail.value
      })
  },
  bindDrinkingPickerChange: function (e) {
      this.setData({
          'wwdUser.drinking': e.detail.value
      })
  },
  bindNowPickerChange:function(e){
      let value = e.detail.value
  },
  // 选择照片并上传
  chooseImage: function (event) {
      let picId = event.currentTarget.dataset.picId;
      console.log(picId)
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              console.log(tempFilePaths)
          }
      })
  },
  //删除照片
  deleteImage:function(event){
      let picId = event.currentTarget.dataset.picId;
      let picData = this.data.picData
      for(let i = 0;i < picData.length;i++){
          if(picData[i].id == picId){
              picData.splice(i,1);
          }
      }
      this.setData({
          picData:picData
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let self = this;
    
  }
})