const httpUtil = require('../../utils/httpUtil.js')
const dicUtil = require('../../utils/dicUtil.js')
//获取应用实例
const app = getApp()

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
        listData: [],
        searchForm: {
            pageNo: 1,
            pageNum: 0
        },
        userInfo: {},
        loadMoreShow: false,
        profileInfoBoxShow: false
        , isFilterExpanded: false
        , currentGender: ''
        , genders: []
        , educations: []
        , education: ''
        , gender: ''
        , keyword: ''
    },
    isPullDownRefresh: function () {
        //是否下拉刷新
        return this.data.searchForm.pageNo < this.data.searchForm.pageNum ? true : false
    }
    ,
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
    bindGenderChange: function (e) {
        //性别
        this.setData({
            gender: e.target.dataset.id
        })
    },
    bindEducationChange: function (e) {
        //学历
        this.setData({
            education: e.target.dataset.id
        })
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
    },
    bindFilterToggle: function (e) {
        //显示筛选
        this.setData({
            isFilterExpanded: !this.data.isFilterExpanded
        })
    },
    filterChanged: function (e) {
        //搜索
        this.setData({
            isFilterExpanded: false
        })

        this.loadData(1)
    },
    filterCancel: function (e) {
        //取消搜索
        //搜索
        this.setData({
            isFilterExpanded: !this.data.isFilterExpanded,
            gender: '',     //性别
            ageRange: '', //年龄
            homeArea: '', //家乡
            nowArea: '',    //现地址
            education: '', //学历
            keyword: ''   //关键字
        })
        this.loadData(1)
    }
    ,
    toggleProfileInfoBox: function (e) {
        //
        this.setData({
            profileInfoBoxShow: !this.data.profileInfoBoxShow
        })
    },
    loadData: function (pageNo, complete) {

        let self = this
        httpUtil.get('/wwd/users', {
            data: {
                pageable: true,
                pageNo: pageNo,
                includePic: true,
                gender: self.data.gender,     //性别
                ageRange: self.data.ageRange, //年龄
                homeArea: self.data.homeArea, //家乡
                nowArea: self.data.nowArea,    //现地址
                education: self.data.education, //学历
                keyword: ''   //关键字
            },
            success: function (response) {

                if (complete && typeof complete == 'function') {
                    complete()
                }

                let content = response.data.data.content
                if (content && content.length > 0) {
                    if (pageNo > 1) {
                        self.data.listData.push.apply(self.data.listData, content)
                        self.setData({
                            listData: self.data.listData
                        })
                    } else {
                        self.setData({
                            listData: content
                        })
                    }
                    self.setData({
                        loadMoreShow: false,
                        'searchForm.pageNo': response.data.data.page.pageNo,
                        'searchForm.pageNum': response.data.data.page.pageNum
                    })
                } else {
                    self.setData({
                        loadMoreShow: true
                    })
                }
            },
            fail: function () {
                wx.showModal({
                    title: '提示',
                    content: '暂时没有匹配的数据',
                })
            }
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        if (this.isPullDownRefresh()) {
            this.loadData(1, wx.stopPullDownRefresh)
        }
    },
    onReachBottom: function () {
        let self = this
        if (self.data.loadMoreShow) {
            return
        }

        if (this.isPullDownRefresh()) {
            self.setData({
                loadMoreShow: true
            })
            this.loadData(this.data.searchForm.pageNo + 1)
        }
    },
    onLoad: function () {
        let self = this
        //性别
        wx.getStorage({
            key: 'wwd_dic_gender',
            success: function (res) {
                self.setData({
                    genders: res.data
                })
            },
            fail: function () {
                dicUtil.getDictsByType('gender', function (res) {
                    let genders = res.data.data.content
                    self.setData({
                        genders: genders
                    })
                    wx.setStorage({
                        key: "wwd_dic_gender",
                        data: genders
                    })
                })
            }
        })
        //学历
        wx.getStorage({
            key: 'wwd_dic_education_level',
            success: function (res) {
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
        //加载页面列表
        this.loadData(1)
    }
})
