// components/mypicker/mypicker.js
const dictUtil = require('../../utils/dicUtil.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      //字典类型
      dictType:String,
      value: {
          type: String
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index:'',
    range: [],
    name:'',
    rangeValue:'value',
    rangeKey:'name'
  },

  /**
   * 组件的方法列表
   */
  methods: {
      _propertyChange: function (newVal, oldVal) {
      },
      bindChange:function(e){
          this.setData({
              'index': e.detail.value
          })
          this.setData({
              value: this.data.range[this.data.index][this.data.rangeValue],
              name: this.data.range[this.data.index][this.data.rangeKey]
          })
          var myEventDetail = { value: this.properties.value, name: this.data.name} // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          this.triggerEvent('change', myEventDetail, myEventOption)
      }
  },
  ready:function(){
      let self = this
      dictUtil.getDictsByType(self.properties.dictType, function (response) {
          let content = response.data.data.content
          self.setData({
              "range": content
          })


          if (self.data.range) {
              for (let i = 0; i < self.data.range.length; i++) {
                  if (self.properties.value == self.data.range[i].value) {
                      self.setData({
                          'index': i
                      })
                      break
                  }
              }
          }
          if (self.data.index !== ''){
              self.setData({
                  name: self.data.range[self.data.index][self.data.rangeKey]
              })
          }

      })

  }
})
