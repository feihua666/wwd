const app = getApp()
const isArray = function(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    } else {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
}  
const request = function (url, data, success, fail, header, method) {
    let _url = url
    if(_url.indexOf('http') !== 0){
        _url = app.globalData.config.host + url
    }

    if (!header.cookie){
        header.cookie = wx.getStorageSync(app.globalData.config.cookieKey)//读取cookie
    }
    let _data = null
    //如果是个对象，把对象为空的不提交，因为encodeURIComponent 会把null转为null字符串
    if (data && (typeof data != 'string' && !isArray(data)) && 'application/x-www-form-urlencoded' == header['Content-Type']){
        _data = {}
        for(let key in data){
            if (data[key] != null){
                _data[key] = data[key]
            }
        }
    }else{
        _data = data
    }
    wx.request({
        url: _url, 
        data: _data,
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
    if (!options){
        options = {}
    }else{
        if (options.data){
            for(let key in options.data){
                if (isArray(options.data[key])){
                    let arrayStr = ''
                    for (let i = 0; i < options.data[key].length;i++){
                        arrayStr += options.data[key][i]
                        if (i < options.data[key].length-1){
                            arrayStr += ','
                        }
                    }
                    options.data[key] = arrayStr
                }
            }
        }
    }
    if (options.header) {
        for (let key in options.header) {
            header[key] = options.header[key]
        }
    }
    request(url, options.data, options.success, options.fail, header,'GET')
}
const _post = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    if (!options) {
        options = {}
    }
    if (options.header){
        for (let key in options.header){
            header[key] = options.header[key]
        }
    }
    request(url, options.data, options.success, options.fail, header, 'POST')
}
const _put = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    if (!options) {
        options = {}
    }
    if (options.header) {
        for (let key in options.header) {
            header[key] = options.header[key]
        }
    }
    request(url, options.data, options.success, options.fail, header, 'PUT')
}
const _delete = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    if (!options) {
        options = {}
    }
    if (options.header) {
        for (let key in options.header) {
            header[key] = options.header[key]
        }
    }
    request(url, options.data, options.success, options.fail, header, 'DELETE')
}
const _uploadFile = function(url,options){
    let _url = url
    if (_url.indexOf('http') !== 0) {
        _url = app.globalData.config.host + url
    }
    let header = {
        "accept": "application/json",
        cookie : wx.getStorageSync(app.globalData.config.cookieKey)//读取cookie
    }

    wx.uploadFile({
        url: _url, 
        filePath: options.filePath,
        name: 'file',
        header: header,
        formData: options.data,
        success: function (res) {
            let status = res.statusCode
            if (status >= 200 && status < 300) {
                if (options.success && typeof options.success == 'function') {
                    options.success(res)
                }

            } else {
                if (options.fail && typeof options.fail == 'function') {
                    options.fail(res)
                }
            }
        }
    })
}
const _login = function(options){
    wx.showLoading({
        title: '登录中...'
    })
    // 调用登录接口，获取 code
    wx.login({
        success: loginRes => {
            let code = loginRes.code
            options.data.loginType = 'WX_MINIPROGRAM'
            options.data.type = "wwd"
            options.data.code = code
            _post('/login', {
                data: options.data,
                header:{
                    cookie:{}
                },
                success: function (res) {
                    var content = res.data.token;
                    app.globalData.token = content.token;
                    wx.setStorageSync(app.globalData.config.cookieKey, res.header["Set-Cookie"])
                    wx.hideLoading()
                    if (typeof options.success == 'function'){
                        options.success(res)
                    }
                },
                fail: function (res) {
                    wx.hideLoading()
                    if (typeof options.fail == 'function') {
                        options.fail(res)
                    }
                }
            })
        }
    })
}
module.exports = {
    get: _get,
    post: _post,
    put: _put,
    delete: _delete,
    uploadFile: _uploadFile,
    login:_login
}