// components/mypicker/mypicker.js
const storageUtil = require('../../utils/storageUtil.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //字典类型
    dictType: String,
    value: {
      type: String,
      observer: function (newVal, oldVal) {
        this.selectByValue(newVal)
      }
    },
    defaultvalue: {
      type: Array,
      value: ['请选择']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: '',
    range: [],
    // 选中显示的文本
    name: '',
    rangeValue: 'value',
    rangeKey: 'name'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //根据值选中
    selectByValue: function (value) {
      let self = this
      if (value == '') {
        self.setData({
          'name': '',
          'index': ''
        })
      }

      for (let i = 0; i < self.data.range.length; i++) {
        if (value == self.data.range[i].value) {
          if (i !== self.data.index) {
            self.setData({
              'index': i
            })
          }
          break
        }
      }
      if (self.data.index !== '') {
        self.setData({
          name: self.data.range[self.data.index][self.data.rangeKey]
        })
      }
    },
    bindChange: function (e) {
      this.setData({
        'index': e.detail.value
      })
      console.log(e)
      var myEventDetail = { value: this.data.range[this.data.index][this.data.rangeValue] } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('change', myEventDetail, myEventOption)
    }
  },

  attached: function () {

    this.setData({
      "range": storageUtil.getStorageDict(this.properties.dictType)
    })
    if ('gender' == this.properties.dictType){
        for (let i = 0; i < this.data.range.length;i++){
            if (this.data.range[i].value == 'unknown'){
                this.data.range.splice(i,1)
            }
        }
        this.setData({
            range:this.data.range
        })
    }

  },
  ready: function () {

  }
})
