const httpUtil = require('../../utils/httpUtil.js')
const storageUtil = require('../../utils/storageUtil.js')
const ageArray = []

for (let i = 16; i <= 80; i++) {
  ageArray.push(i)
}

Page({
  data: {
    ageMultiIndex: [4, 15],
    ageMultiArray: [ageArray, ageArray],
    ageRange: [],
    homeArea: [],
    nowArea: [],
    inputShowed: false,
    searchbarResultShowed: true,
    keyword: '',
    education: '',
    gender: '',
    localKeywords: [],
    keywordIndex: null
  },
  showInput: function (e) {
    //显示输入框
    this.setData({
      inputShowed: true
    });
  },
  searchTap: function (e) {
    //搜索
    wx.navigateBack()
  },
  clearInput: function (e) {
    //清除搜索框内容
    this.setData({
      keyword: ""
    });
  },
  inputChange: function (e) {
    //绑定搜索框内容
    let searchbarResultShowed = true
    if (this.data.localKeywords.length > 0) {
      searchbarResultShowed = false
    }
    this.setData({
      keyword: e.detail.value, searchbarResultShowed: searchbarResultShowed
    })
  },
  inputBindfocus: function (e) {
    //搜索框聚焦处理
    if (this.data.localKeywords.length > 0) {
      this.setData({ searchbarResultShowed: false })
    }
  },
  chooseKeyword: function (e) {
    //选择历史关键字
    let self = this
    self.setData({ searchbarResultShowed: !self.data.searchbarResultShowed, keyword: self.data.localKeywords[e.currentTarget.id], keywordIndex: e.currentTarget.id })
  },
  searchbarResultToggle: function (e) {
    //隐藏关键字历史搜索记录
    this.setData({ searchbarResultShowed: !this.data.searchbarResultShowed })
  },
  clearSearchbarResult: function (e) {
    //清除关键字历史搜索记录
    try {
      storageUtil.remove('localKeywords')
      this.setData({ searchbarResultShowed: !this.data.searchbarResultShowed, localKeywords: [] })
    } catch (e) {
      // Do something when catch error
    }
  },
  filterLabTap: function (e) {
    //重置选择项
    let self = this
    let id = e.currentTarget.id
    switch (id) {
      case 'gender':
        self.setData({
          gender: ''
        });
        break;
      case 'age':
        self.setData({
          ageRange: []
        });
        break;
      case 'education':
        self.setData({
          education: ''
        });
        break;
      case 'nowArea':
        self.setData({
          nowArea: []
        });
        break;
      case 'homeArea':
        self.setData({
          homeArea: []
        });
        break;
    }
  },
  bindGenderChange: function (e) {
    //性别
    let gender = this.data.gender == e.detail.value ? '' : e.detail.value;

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
    //学历
    let education = this.data.education == e.detail.value ? '' : e.detail.value;

    this.setData({
      education: education
    });
  },
  bindNowPickerChange: function (e) {
    //目前所在城市
    this.setData({
      nowArea: e.detail.value
    })
  },
  bindHomePickerChange: function (e) {
    //籍贯
    this.setData({
      homeArea: e.detail.value
    })
  }
  ,
  onLoad: function () {
    //加载数据
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    this.loadData(this, prevPage, false)
  },
  onUnload: function () {
    //返回设置数据
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    this.loadData(prevPage, this, true)
  },
  loadData: function (t, r, isSearch) {
    //加载数据
    let self = this
    t.setData({
      profileInfoBoxShow: false,
      searchtype: 'confirmSearch',
      gender: r.data.gender,     //性别
      ageRange: r.data.ageRange, //年龄
      homeArea: r.data.homeArea, //家乡
      nowArea: r.data.nowArea,    //现地址
      education: r.data.education, //学历
      keyword: r.data.keyword   //关键字  
    })
    //设置关键字缓存
    if (isSearch && self.data.keyword) {
      let localKeywords = self.data.localKeywords
      if (self.data.keywordIndex) {
        localKeywords.splice(self.data.keywordIndex, 1);
      }
      if (localKeywords.length > 7) {
        localKeywords.shift(self.data.keyword)
      } else {
        localKeywords.unshift(self.data.keyword)
      }
      //
      try {
        storageUtil.storage('localKeywords', localKeywords)
      } catch (e) {
        console.log(e)
      }
    }
    //获取关键字缓存
    else if (!isSearch) {
      try {
        let value = storageUtil.storage('localKeywords')
        if (value) {
          console.log(value)
          self.setData({ localKeywords: value })
        }
      } catch (e) {
        // Do something when catch error
      }
    }
  }
})