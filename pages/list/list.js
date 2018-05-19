const httpUtil = require('../../utils/httpUtil.js')

//获取应用实例
const app = getApp()

Page({
    data: {
        appConfig: getApp().globalData.config,
        listData: [],
        pageData: [],
        searchForm: {
            pageNo: 1,
            pageNum: 0
        },
        userInfo: {},
        loadMoreShow: false,
        profileInfoBoxShow: false
    },
    toggleProfileInfoBox: function () {
        this.setData({
            profileInfoBoxShow: !this.data.profileInfoBoxShow
        })
    },
    isPullDownRefresh: function () {
        //是否下拉刷新
        return this.data.searchForm.pageNo < this.data.searchForm.pageNum ? true : false
    },

    loadData: function (pageNo, complete) {
        let self = this
        httpUtil.get('/wwd/users', {
            data: {
                pageable: true,
                pageNo: pageNo,
                includePic: true,
                gender: ''
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
        this.loadData(1)
    }
})
