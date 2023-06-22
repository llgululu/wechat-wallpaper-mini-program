module.exports = {
    onLoad() {
        // 设置默认的转发参数
        uni.$u.mpShare = {
            title: 'll壁纸助手', // 默认为小程序名称
            path: '/pages/tabbar', // 默认为当前页面路径
            imageUrl: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=946bb666cae850e22668ebc0065bca23' // 默认为当前页面的截图
        }
    },
    onShareAppMessage() {
        return uni.$u.mpShare
    }
}
