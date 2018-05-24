const areaUtil = require('../../utils/areaUtil.js')
const storageUtil = require('../../utils/storageUtil.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      value:{
          type: Array,
          value:[],
          observer:function(newValue,oldValue){
              let self = this
                  // 还没有初始化
                self.selectByValue(newValue)
          }
      },
      defaultvalue:{
        type: Array,
        value: ['请选择', '', '']
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      index: [0,0,0],
      range: [[],[],[]],
      name: [],
      rangeValue: 'id',
      rangeKey: 'name'
  },

  /**
   * 组件的方法列表
   */
  methods: {
      loadProvince:function(success){
          let self = this
          let proviceStorage = storageUtil.storage('province')
          if (proviceStorage){
              self.data.range[0] = proviceStorage
              self.setData({
                  range: self.data.range
              })
              if (success) {
                  success(proviceStorage[0].id)
              }
              return
          }
          //加载省
          areaUtil.getAreas({
              type: 'province',
              t: new Date().getTime()
          }, function (r) {
              let content = r.data.data.content
              //把省放入缓存
              storageUtil.storage('province', content)
              self.data.range[0] = content
              self.setData({
                  range: self.data.range
              })
              if (success){
                  success(content[0].id)
              }
          })
      },
      loadCity: function (parentId, success){
          let self = this
          //检查缓存
          let cityStorage = storageUtil.storage('city' + parentId)
          if (cityStorage) {
              self.data.range[1] = cityStorage
              self.setData({
                  range: self.data.range
              })
              if (success) {
                  success(cityStorage[0].id)
              }
              return
          }

          //加载市
          areaUtil.getAreas({
              type: 'city',
              parentId: parentId,
              t: new Date().getTime()
          }, function (r) {
              let content = r.data.data.content
                //保存在缓存
              storageUtil.storage('city' + parentId,content)

              self.data.range[1] = content
              self.setData({
                  range: self.data.range
              })
              if (success) {
                  success(content[0].id)
              }
          })
      },
      loadDistrict: function (parentId, success){
          let self = this

          //检查缓存
          let districtStorage = storageUtil.storage('district' + parentId)
          if (districtStorage) {
              self.data.range[2] = districtStorage
              self.setData({
                  range: self.data.range
              })
              if (success) {
                  success(districtStorage[0].id)
              }
              return
          }

          //加载区
          areaUtil.getAreas({
              type: 'district',
              parentId: parentId,
              t: new Date().getTime()
          }, function (r) {
              let content = r.data.data.content

            //缓存住
              storageUtil.storage('district' + parentId, content)

              self.data.range[2] = content
              self.setData({
                  range: self.data.range
              })
              if (success) {
                  success(content[0].id)
              }
          })
      },
      bindChange:function(e){
          let self = this
          let index = e.detail.value
          this.setData({
              'index': e.detail.value
          })
          //this.setValue()
          var myEventDetail = {
              value:[
                  self.data.range[0][self.data.index[0]][self.data.rangeValue],
                  self.data.range[1][self.data.index[1]][self.data.rangeValue],
                  self.data.range[2][self.data.index[2]][self.data.rangeValue]
              ]
             } // detail对象，提供给事件监听函数
          var myEventOption = { } // 触发事件的选项
          this.triggerEvent('change', myEventDetail, myEventOption)
      },
      bindColumnChange:function(e){
          let self = this
          let column = e.detail.column
          let valueIndex = e.detail.value
          let parentId = null
          switch(column){
              //省变
              case 0:
                  parentId = self.data.range[0][valueIndex].id
                  if (parentId){
                      self.loadCity(parentId, function (parentId) {
                          self.loadDistrict(parentId)
                      })
                  }
                break;
                //市变
              case 1:
                  parentId = self.data.range[1][valueIndex].id
                  if (parentId) {
                      self.loadDistrict(parentId)
                  }
                 
                  break;
                  //区变
              case 2:
                  parentId = self.data.range[2][valueIndex].id
                  break;
          }
      },
      setIndexByValue:function(value){
          let self = this
          if (self.data.range) {
              // 省
              for (let i = 0; i < self.data.range[0].length; i++) {
                  if (value[0] == self.data.range[0][i][self.data.rangeValue]) {
                      self.data.index[0] = i
                      self.setData({
                          'index': self.data.index
                      })
                      break
                  }
              }
              // 市
              for (let i = 0; i < self.data.range[1].length; i++) {
                  if (value[1] == self.data.range[1][i][self.data.rangeValue]) {
                      self.data.index[1] = i
                      self.setData({
                          'index': self.data.index
                      })
                      break
                  }
              }
              // 区
              for (let i = 0; i < self.data.range[2].length; i++) {
                  if (value[2] == self.data.range[2][i][self.data.rangeValue]) {
                      self.data.index[2] = i
                      self.setData({
                          'index': self.data.index
                      })
                      break
                  }
              }
          }
      },
      setNameByValue:function(value){
          let self = this
          //设置显示值
          if (value.length != 0 && value[0] && value[1] && value[2]) {
              self.setData({
                  name: [
                      self.data.range[0][self.data.index[0]][self.data.rangeKey],
                      self.data.range[1][self.data.index[1]][self.data.rangeKey],
                      self.data.range[2][self.data.index[2]][self.data.rangeKey]
                  ]
              })
          }

      },
      selectByValue:function(value){
        let self = this
        if (value && value.length==0) {
          self.setData({
            'name': ''
          })
        }
          this.initRange(value, function () {
              if (value.length > 0 && self.data.range[0].length > 0) {
                  self.setIndexByValue(value)
                  self.setNameByValue(value)
              }

          })
      },
      initRange:function(value,callback){
          let self = this
          this.loadProvince(function (parentId) {
              if (value[0]) {
                  parentId = value[0]
              }
              self.loadCity(parentId, function (parentId) {
                  if (value[1]) {
                      parentId = value[1]
                  }
                  self.loadDistrict(parentId, function () {
                      callback()
                  })
              })
          })
      }
  },

  attached: function () {
      let self = this
      
  }
})
