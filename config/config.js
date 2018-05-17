const host = 'http://localhost:8080'
module.exports = {
    host: host,
    cookieKey:'cookieKey',
    file: {
        // 文件上传地址
        uploadUrl: host + '/upload/file',
        // 文件下载地址
        downloadUrl: host + '/file'
    }
}