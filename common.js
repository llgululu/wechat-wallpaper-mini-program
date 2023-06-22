module.exports = {
	BASE_URL: 'https://你的域名/wallpaper',
	header: {
		'content-type': 'application/json;charset=utf-8'
	},
	savePosterPath(url) {
		uni.showLoading({
			title: '正在保存图片...'
		});
		//获取用户的当前设置。获取相册权限
		uni.getSetting({
			success: (res) => {
				//如果没有相册权限
				if (!res.authSetting["scope.writePhotosAlbum"]) {
					//向用户发起授权请求
					uni.authorize({
						scope: "scope.writePhotosAlbum",
						success: () => {
							//授权成功保存图片到系统相册
							uni.saveImageToPhotosAlbum({
								//图片路径，不支持网络图片路径
								filePath: url,
								success: (res) => {
									uni.hideLoading();
									return uni.showToast({
										title: "保存成功！",
									});
								},
								fail: (res) => {
									console.log(res.errMsg);
									return uni.showToast({
										title: res.errMsg,
									});
								},
								complete: (res) => {
									uni.hideLoading();
								},
							});
						},
						//授权失败
						fail: () => {
							uni.hideLoading();
							uni.showModal({
								title: "您已拒绝获取相册权限",
								content: "是否进入权限管理，调整授权？",
								success: (res) => {
									if (res.confirm) {
										//调起客户端小程序设置界面，返回用户设置的操作结果。（重新让用户授权）
										uni.openSetting({
											success: (res) => {
												console.log(res
													.authSetting
													);
											},
										});
									} else if (res.cancel) {
										return uni.showToast({
											title: "已取消！",
										});
									}
								},
							});
						},
					});
				} else {
					//如果已有相册权限，直接保存图片到系统相册
					uni.saveImageToPhotosAlbum({
						filePath: url,
						success: (res) => {
							uni.hideLoading();
							return uni.showToast({
								title: "保存成功！",
							});
						},
						fail: (res) => {
							uni.hideLoading();
							console.log(res.errMsg);
							return uni.showToast({
								title: res.errMsg,
							});
						},
						//无论成功失败都走的回调
						complete: (res) => {
							uni.hideLoading();
						},
					});
				}
			},
			fail: (res) => {},
		});
	},
	_getRequest(option) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: this.BASE_URL + option.url,
				method: option.method || 'GET',
				header: this.header,
				data: option.data,
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err.errMsg)
				}
			})
		})
	},
	_updateFile(option) {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: this.BASE_URL + option.url,
				filePath: option.filePath,
				name: option.fileName,
				header: this.header,
				formData: option.formData,
				success(res) {
					resolve(res)
				},
				fail(res) {
					reject(res)
				}
			});
		})
	}
}