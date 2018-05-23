const httpUtil = require('../../utils/httpUtil.js')
const ageArray = []

for (let i = 16; i <= 80; i++) {
  ageArray.push(i)
}

Page({
  data: {
    ageMultiIndex: [4, 15],
    ageMultiArray: [ageArray, ageArray],
    ageRange: [],
    homeArea: [], //["16e00c91fb3611e794174439c4325934", "194b5a34fb3611e794174439c4325934", "19798ea6fb3611e794174439c4325934"]
    nowArea: [],
    inputShowed: false,
    keyword: '',
    educations: [],
    education: '',
    gender: '',
    genders: [{ value: '', name: '全部' }, { value: 'male', name: '男' }, { value: 'female', name: '女' }]
  },
  loadData:function(t,r){

    t.setData({
      profileInfoBoxShow: false,
      searchtype: 'confirmSearch',
      gender: r.data.gender,     //性别
      ageRange: r.data.ageRange, //年龄
      homeArea: r.data.homeArea, //家乡
      nowArea: r.data.nowArea,    //现地址
      educations: r.data.educations, //学历
      education: r.data.education, //学历
      keyword: r.data.keyword   //关键字  
    })
  
  },
  showInput: function (e) {
    this.setData({
      inputShowed: true
    });
  },
  searchTap: function (e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    this.loadData(prevPage,this)
    wx.navigateBack()
  },
  clearInput: function (e) {
    this.setData({
      keyword: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  bindGenderChange: function (e) {
    let gender = this.data.gender == e.currentTarget.dataset.id ? '' : e.currentTarget.dataset.id;
    //性别
    this.setData({
      gender: gender
    })
  },
  bindMultiAgeChange: function (e) {
    //年龄
    let min = e.detail.value[0] <= e.detail.value[1] ? e.detail.value[0] : e.detail.value[1]
    let max = e.detail.value[0] >= e.detail.value[1] ? e.detail.value[0] : e.detail.value[1]
    let ageMultiArray = this.data.ageMultiArray
    let date = new Date();
    let fullyear = date.getFullYear();
    let ageMultiIndex = [min, max]
    let minDate = (fullyear - ageMultiArray[0][min]) + '-12-29';
    let maxDate = (fullyear - ageMultiArray[1][max]) + '-01-01';
    let ageRange = [maxDate, minDate]

    this.setData({
      ageMultiIndex: ageMultiIndex,
      ageRange: ageRange
    })
  },
  bindEducationChange: function (e) {
    let education = this.data.education == e.currentTarget.dataset.id ? '' : e.currentTarget.dataset.id;
    //学历
    this.setData({
      education: education
    });
  },
  onLoad: function () {
    //加载数据
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    this.loadData(this, prevPage)
    let self = this
  },
  onUnload: function () {
    //返回设置数据
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    this.loadData(prevPage, this)
  }
});