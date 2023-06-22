<template>
	<view>
		<u-navbar leftIconColor="white" bgColor="#3c9cff" titleStyle="color:white" :placeholder=true title="预览"
			:autoBack="true">
		</u-navbar>
		<view class="preview">
			<image mode="widthFix" class="preview_image" :src="src"></image>
		</view>
		<view>
			<u-tabbar :fixed="true" :safeAreaInsetBottom="false" :placeholder="false">
				<u-tabbar-item @click="downOneShow = true" text="下载" icon="download"></u-tabbar-item>
			</u-tabbar>
		</view>
		<view>
			<u-modal @cancel="download1" @confirm="showAd" @close="downOneShow = false" :showCancelButton="true"
				:showConfirmButton="isDownloadStatus" :closeOnClickOverlay="true" confirmText="无消耗下载" cancelText="普通下载"
				:show="downOneShow" :title="title" :content='downOneContent'></u-modal>
		</view>
	</view>

</template>

<script>
	let videoAd = null;
	var App = require("@/common.js");
	export default {
		data() {
			return {
				downOneShow: false,
				isDownloadStatus: true,
				code: 403,
				title: '提示',
				downOneContent: '普通下载会消耗1积分。无消耗下载不会消耗积分。',
				src: 'http://up1.bdcdn.bizhiduoduo.com/wallpaper/wp-upload/20201114/db6d78982a1f4b9d0446ad1a7e804383.jpg'
			}
		},
		onLoad(option) {
			uni.getStorage({
				key: "url",
				success: (res) => {
					this.src = res.data;
					uni.removeStorage({
						key: "url"
					})
				}
			})
			uni.getStorage({
				key: "setting",
				success: (res) => {
					if (res.data.seStatus === "0") {
						this.isDownloadStatus = false;
						this.downOneContent = "下载图片会消耗1积分";
					} else {
						if (wx.createRewardedVideoAd) {
							videoAd = wx.createRewardedVideoAd({
								adUnitId: res.data.seIncentive
							})
							videoAd.onLoad(() => {
								console.log('onLoad event emit')
							})
							videoAd.onError((err) => {
								console.log('onError event emit', err)
							})
							videoAd.onClose((res) => { // 用户点击了【关闭广告】按钮
								if (res && res.isEnded) {
									uni.showToast({
										icon: "error",
										title: "已获得奖励",
									})
									this.downOneShow = false;
									this.downloadOnePicture();
								} else {
									uni.showToast({
										icon: "error",
										title: "未获得奖励",
									})
								}
							})
						}
					}
				}
			})
		},
		watch: {
			code(newVal, oldVal) {
				if (newVal == 200) {
					uni.hideLoading()
					uni.showToast({
						title: "已保存到相册",
						icon: "success",
						duration: 3000
					})
				}
			},
		},
		methods: {
			async downloadPicDeleteUserCount(num, openid) {
				const res = await App._getRequest({
					url: '/downloadPicDeleteUserCount?num=' + num + '&openid=' + openid,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.downOneShow = false;
					this.dow();
					uni.setStorageSync("userinfo", res.data["data"]["userinfo"])
				} else {
					uni.showToast({
						icon: "error",
						title: "网络错误",
					})
				}
			},
			download1() {
				uni.getStorage({
					key: "userinfo",
					success: (res1) => {
						this.downOneShow = false;
						if (res1.data.uCount < 1) {
							uni.showToast({
								icon: "error",
								title: "积分不足",
							})
						} else {
							uni.$u.throttle(() => this.downloadPicDeleteUserCount(1, res1.data.uOpenid), 1200)
						}
					},
					fail() {
						uni.showToast({
							icon: "error",
							title: "用户未登录",
						})
					}
				})
			},
			showAd() {
				videoAd.show().catch(() => {
					// 失败重试
					videoAd.load()
						.then(() => videoAd.show())
						.catch(err => {
							console.log(err)
							uni.showToast({
								icon: "error",
								title: "广告显示失败",
							})
						})
				})
			},
			dow() {
				this.code = 403
				uni.showLoading({
					title: "拼命下载中"
				})
				var msg = this.src
				// msg = encodeURIComponent(msg)
				this.download(msg, 0)
			},
			download(url, i) {
				uni.downloadFile({
					url: url, //图片地址
					success: (res) => {
						//图片保存到本地
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								if (i == 0) {
									this.code = 200
								}
							},
							fail: function(err) {
								if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err
									.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err
									.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
								) {
									// 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
									uni.showModal({
										title: '提示',
										content: '需要您授权保存相册',
										showCancel: false,
										success: modalSuccess => {
											uni.openSetting({
												success(settingdata) {
													console.log("settingdata",
														settingdata)
													if (settingdata
														.authSetting[
															'scope.writePhotosAlbum'
														]) {
														uni.showModal({
															title: '提示',
															content: '获取权限成功,再次点击图片即可保存',
															showCancel: false,
														})
													} else {
														uni.showModal({
															title: '提示',
															content: '获取权限失败，将无法保存到相册哦~',
															showCancel: false,
														})
													}
												},
												fail(failData) {
													console.log("failData",
														failData)
												},
												complete(finishData) {
													console.log("finishData",
														finishData)
												}
											})
										}
									})
								}
							}
						})
					}
				,fail(err){
					console.log(err)
				}
				})
			},
		}
	}
</script>

<style lang="scss">
	.preview {
		width: 100%;
	}

	.down_icon {
		position: fixed;
		bottom: 10rpx;
		left: 50%;
		z-index: 20;
		transform: translate(-50%, 0);
	}

	.preview_image {
		display: block;
		margin: 0 auto;
		height: 100%;
		width: 100%;
	}
</style>