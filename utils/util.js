const app = getApp()
const getFileUrl = function (path, downloadUrl) {
    if (path) {
        if (path.indexOf('http') == 0) {
            return path
        } else {
            return app.globalData.config.file.downloadUrl + path
        }
    }
    return ''

}
module.exports = {
    getFileUrl: getFileUrl
}