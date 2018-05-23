const storageDictKey = 'storageDictKey'

// 设置或获取缓存
const storage = function(key,data){
    // 如果存在数据，则是设置
    if(data){
        wx.setStorageSync(key, data)
    }
    //不存在数据，则是获取
    else{
        return wx.getStorageSync(key)
    }
}
//获取全局字典
const getStorageDict = function (type) {
    
    if (type){
        return storage(storageDictKey)[type]
    }else{
        return storage(storageDictKey)
    }

}
const setStorageDict = function (data,type) {
    if (type){
        storage(storageDictKey)[type] = data
    }else{
        storage(storageDictKey, data)
    }

}
// 清除
const clear = function(){
    wx.clearStorageSync()
}
module.exports = {
    storage: storage,
    getStorageDict: getStorageDict,
    setStorageDict: setStorageDict,
    clear: clear
}