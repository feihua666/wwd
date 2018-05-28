const storageUtil = require('../../utils/storageUtil.js')
const httpUtil = require('../../utils/httpUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dict: null, // 待选择的
      tagSelected:[], //已选择的
      tagSelf:null,    //自定义的
      addOrUpdate:null,
      type:null,
      id:null,
      isUpdateChange:false //标记是否有修改
  },
    checkboxChange: function (e) {
        this.setData({
            isUpdateChange:true
        })
        //选中的数组
        let value = e.detail.value
        if(value.length > 5){
            wx.showToast({
                title: '最多选择5个',
                icon: 'none'
            })
            return
        }
        this.setData({
            tagSelected: value
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.setData({
            type: options.type,
            isUpdateChange:false
    })
    let id = options.id
    if (!!id){
        self.setData({
            addOrUpdate : 'update'
        })
    }else{
        self.setData({
            addOrUpdate : 'add'
        })
    }
    //加载字典
        let content = storageUtil.getStorageDict(self.data.type)
        self.setData({
            dict: content
        })
        // 加载标签
        httpUtil.get('/wwd/user/current/tag/' + self.data.type,{
            success: res => {
                let _content = res.data.data.content
                let selected = []
                if (_content.content){
                    selected = _content.content.split(',')
                }
                self.setData({
                    tagSelf: _content.selfContent,
                    tagSelected:selected
                })
            }
        })
  },
  // 保存
    save:function(success){
        let self = this
        let arrayStr = ''
        for (let i = 0; i < self.data.tagSelected.length; i++) {
            arrayStr += self.data.tagSelected[i]
            if (i < self.data.tagSelected.length - 1) {
                arrayStr += ','
            }
        }
        let data = {
            content: arrayStr,
            selfContent: self.data.tagSelf
        }
        if (self.data.addOrUpdate == 'add'){
            httpUtil.post('/wwd/user/current/tag/' + self.data.type, {
                data:data,
                success: success
            })
        } else if (self.data.addOrUpdate == 'update') {
            if (self.data.isUpdateChange){
                httpUtil.put('/wwd/user/current/tag/' + self.data.type, {
                    data: data,
                    success: success
                })
            }
        }
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
      let pages = getCurrentPages() //获取页面栈
      let currpage = pages[pages.length - 1] //当前页面
        let prevPage = pages[pages.length - 2] //上一个页面（父页面）
        //判断是否更改，如果没有更新，不再调用
    let self = this
      this.save(function(){
          if (self.data.isUpdateChange){
              prevPage.loadTags()
          }
      })
  }

})