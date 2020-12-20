const OSS = require('ali-oss')

export function client(data) {
    // 后端提供数据
    return new OSS({
        region: data.endpoint, // *****.aliyuncs.com
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        bucket: data.bucket,
        endpoint: data.endpoint,
        secure: true
    })
}
