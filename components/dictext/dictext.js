const storageUtil = require('../../utils/storageUtil.js')
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
  attached: function () {
      let self = this
      let dict = storageUtil.getStorageDict(self.properties.dictType)

      if (self.properties.value) {
          for (let i = 0; i < dict.length; i++) {
              if (self.properties.value == dict[i].value) {
                  self.setData({
                      'name': dict[i].name
                  })
                  break
              }
          }
      }
  }
})
