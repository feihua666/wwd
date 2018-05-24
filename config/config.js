const host = 'https://h.xhlang.com'
module.exports = {
    host: host,
    cookieKey:'cookieKey',
    file: {
        // 文件上传地址
        uploadUrl: host + '/upload/file',
        // 文件下载地址
        downloadUrl: host + '/file'
    },
    dict:'gender,married_status,constellation_type,blood_type,education_level,has_car_status,has_hourse_status,looks_type,'
    +'shape_status,smoking_status,drinking_status,nature_type,hobby_type,food_type,movie_type,trip_type,sport_type'
}