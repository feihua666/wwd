const areaUtil = require('../../utils/areaUtil.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      value:{
          type: Array,
          value:[]
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

          //加载省
          areaUtil.getAreas({
              type: 'province'
          }, function (r) {
              let content = r.data.data.content
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
          //加载市
          areaUtil.getAreas({
              type: 'city',
              parentId: parentId
          }, function (r) {
              let content = r.data.data.content
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
          //加载区
          areaUtil.getAreas({
              type: 'district',
              parentId: parentId
          }, function (r) {
              let content = r.data.data.content
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
          let index = e.detail.value
          this.setData({
              'index': e.detail.value
          })
          this.setData({
              value: [
                  this.data.range[0][this.data.index[0]][this.data.rangeValue],
                  this.data.range[1][this.data.index[1]][this.data.rangeValue],
                  this.data.range[2][this.data.index[2]][this.data.rangeValue]
              ],
              name: [
                  this.data.range[0][this.data.index[0]][this.data.rangeKey],
                  this.data.range[1][this.data.index[1]][this.data.rangeKey],
                  this.data.range[2][this.data.index[2]][this.data.rangeKey]
              ]
          })
          var myEventDetail = { value: this.properties.value } // detail对象，提供给事件监听函数
          var myEventOption = { name: this.data.name } // 触发事件的选项
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
      }
  },
  ready: function () {
      let self = this
      this.loadProvince(function (parentId){
          if (self.properties.value[0]){
              parentId = self.properties.value[0]
          }
          self.loadCity(parentId,function(parentId){
              if (self.properties.value[1]) {
                  parentId = self.properties.value[1]
              }
              self.loadDistrict(parentId,function(){

                  if (self.data.range) {
                      // 省
                      for (let i = 0; i < self.data.range[0].length; i++) {
                          if (self.properties.value[0] == self.data.range[0][i][self.data.rangeValue]) {
                              self.data.index[0] = i
                              self.setData({
                                  'index': self.data.index
                              })
                              break
                          }
                      }
                      // 市
                      for (let i = 0; i < self.data.range[1].length; i++) {
                          if (self.properties.value[1] == self.data.range[1][i][self.data.rangeValue]) {
                              self.data.index[1] = i
                              self.setData({
                                  'index': self.data.index
                              })
                              break
                          }
                      }
                      // 区
                      for (let i = 0; i < self.data.range[2].length; i++) {
                          if (self.properties.value[2] == self.data.range[2][i][self.data.rangeValue]) {
                              self.data.index[2] = i
                              self.setData({
                                  'index': self.data.index
                              })
                              break
                          }
                      }
                  }
                  if (self.properties.value && self.properties.value.length>0){
                      self.bindChange({
                          detail: {
                              value: self.data.index
                          }
                      })
                  }

              })
          })
      })

  }
})
