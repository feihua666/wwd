const dictUtil = require('../../utils/dicUtil.js')
const httpUtil = require('../../utils/httpUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:null,
    dict:null
  },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let type = options.type
    //加载字典
    dictUtil.getDictsByType(type, function (response) {
        let content = response.data.data.content
        self.setData({
            dict:content
        })
    })
  },
  // 保存
    save:function(){

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
  
  },

})