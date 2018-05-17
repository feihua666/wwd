const app = getApp()
const httpUtil = require('./httpUtil.js')

const getDictsByType = function (dictType,success) {
    httpUtil.get('/base/dicts/' + dictType,{
        data:{
            orderby: 'sequence'
        },
        success:success
    })
}
const getDictsByTypeForPage = function (dictType, success) {
    httpUtil.get('/base/dicts/' + dictType, {
        data: {
            orderby: 'sequence',
            pageable:true,
            pageNo:1,
            pageSize:5
        },
        success: success
    })
}
module.exports = {
    getDictsByType: getDictsByType,
    getDictsByTypeForPage: getDictsByTypeForPage
}