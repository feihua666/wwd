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
module.exports = {
    getDictsByType: getDictsByType
}