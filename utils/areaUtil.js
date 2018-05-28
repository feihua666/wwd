const app = getApp()
const httpUtil = require('./httpUtil.js')

const getAreas = function (data, success,fail) {
    let _data = data
    if (_data){
    }else{
        _data = {
        }
    }
    _data.orderby = 'sequence'
    _data.orderable = true
    httpUtil.get('/base/areas', {
        data: _data,
        success: success,
        fail: fail
    })
}
const getAreaById = function (id, success) {

    httpUtil.get('/base/area/' + id, {
        data:{
            t:new Date().getTime()
        },
        success: success
    })
}
module.exports = {
    getAreas: getAreas,
    getAreaById: getAreaById
}