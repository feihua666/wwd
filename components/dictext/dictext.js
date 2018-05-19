const dictUtil = require('../../utils/dicUtil.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:null,
    dictType: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    name:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  ready: function () {
      let self = this
      dictUtil.getDictsByType(self.properties.dictType, function (response) {
          let content = response.data.data.content
          if (self.properties.value) {
              for (let i = 0; i < content.length; i++) {
                  if (self.properties.value == content[i].value) {
                      self.setData({
                          'name': content[i].name
                      })
                      break
                  }
              }
          }

      })

  }
})
