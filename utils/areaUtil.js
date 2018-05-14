const app = getApp()
const httpUtil = require('./httpUtil.js')

const getAreas = function (data, success) {
    httpUtil.get('/base/areas/', {
        data: data,
        success: success
    })
}
const getAreaById = function (id, success) {
    httpUtil.get('/base/area/' + id, {
        data: data,
        success: success
    })
}
module.exports = {
    getAreas: getAreas,
    getAreaById: getAreaById
}