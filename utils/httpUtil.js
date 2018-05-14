const config = require('../config/config.js')
const cookieKey = 'cookiekey'

const request = function (url, data, success, fail, header, method) {
    let _url = url
    if(_url.indexOf('http') !== 0){
        _url = config.host + url
    }

    header.cookie = wx.getStorageSync(config.cookieKey)//读取cookie
    wx.request({
        url: _url, 
        data: data,
        header: header,
        method: method,
        success: function (res) {
            let status = res.statusCode
            if (status >= 200 && status < 300) {
                if (success && typeof success == 'function') {
                    success(res)
                }

            } else {
                if (fail && typeof fail == 'function') {
                    fail(res)
                }
            }
        }
    })
}
// 封装网络请求
const _get = function(url,options){
    let header = {
        "accept": "application/json"
    }
    request(url, options.data, options.success, options.fail, header,'GET')
}
const _post = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    request(url, options.data, options.success, options.fail, header, 'POST')
}
const _put = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    request(url, options.data, options.success, options.fail, header, 'PUT')
}
const _delete = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    request(url, options.data, options.success, options.fail, header, 'DELETE')
}

module.exports = {
    get: _get,
    post: _post,
    put: _put,
    delete: _delete
}