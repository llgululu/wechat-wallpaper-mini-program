<template>
	<view>
		<u-navbar :placeholder=true :title="currTitle" :autoBack="true"></u-navbar>
		<view class="list_swiper">
			<u-swiper :current="swiperCurrent" height="400" @click="viewOnePicture" @change="onchage" :list="list3"
				previousMargin="50" nextMargin="50" :autoplay="false" imgMode="widthFix" indicator indicatorMode="dot"
				radius="5" bgColor="#ffffff"></u-swiper>
		</view>
		<view class="list_swiper_button_group">
			<view>
				<u-row gutter="10">
					<u-col span="4">
						<view><u-button throttleTime="1200" @click="clickButtonType('one')" icon="download"
								type="success" :plain="true" text="下载单张"></u-button></view>
					</u-col>
					<u-col span="4">
						<view><u-button throttleTime="1200" @click="viewOnePicture" icon="eye" type="primary"
								:plain="true" text="预览"></u-button></view>
					</u-col>
					<u-col span="4">
						<view><u-button throttleTime="1200" @click="clickButtonType('all')" icon="download"
								type="warning" :plain="true" text="下载全部"></u-button></view>
					</u-col>
				</u-row>
			</view>
			<view class="goup_2">
				<u-row gutter="10">
					<u-col span="3" offset="3">
						<view><u-button throttleTime="1000" :disabled="currentPage>0 ? false:true" @click="previous"
								type="info" :plain="true" text="上一组"></u-button></view>
					</u-col>
					<u-col span="3">
						<view><u-button throttleTime="1000" :disabled="hasmore=='true'? false:true" @click="next"
								type="info" :plain="true" text="下一组"></u-button></view>
					</u-col>
				</u-row>
			</view>
		</view>
		<view v-if="isShowAd=='1'">
			<ad :unit-id="ad_id" ad-type="video" ad-theme="white"></ad>
		</view>
		<view>
			<u-modal @cancel="downloadType" @confirm="showAd" @close="downloadshow=false" :showCancelButton="true"
				:show="downloadshow" :showConfirmButton="isDownloadStatus" :closeOnClickOverlay="true"
				confirmText="无消耗下载" cancelText="普通下载" :title="title" :content='content'></u-modal>
		</view>
		<u-loading-page :loading="isLoading"></u-loading-page>
	</view>
</template>

<script>
	var App = require("@/common.js");
	let videoAd = null;
	export default {
		data() {
			return {
				ad_id:'',
				isShowAd: "0",
				isDownloadStatus: true,
				downloadshow: false,
				content: '普通下载会消耗1积分。无消耗下载不会消耗积分。',
				type: 'one',
				title: '提示',
				isLoading: true,
				currTitle: "搜索结果",
				userinput: "",
				code: 403,
				image: 1,
				currentPage: 0,
				hasmore: "false",
				swiperCurrent: 0,
				list3: [
					''
				],
				url_list: [
					''
				],
			}
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
			image(newVal, oldVal) {
				if (newVal - 1 < this.url_list.length && newVal != 1) {
					uni.showLoading({
						title: "下载第" + this.image + "/" + this.url_list.length + "张"
					})
					var msg = this.url_list[newVal - 1]
					// msg = encodeURIComponent(msg)
					this.download(msg, 1)
				} else {
					uni.hideLoading()
					this.image = 1
					uni.showToast({
						title: "已全部保存",
						icon: "success",
						duration: 3000
					})
				}
			}
		},
		methods: {
			async downloadPicDeleteUserCount(num, openid) {
				const res = await App._getRequest({
					url: '/downloadPicDeleteUserCount?num=' + num + '&openid=' + openid,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.downloadshow = false;
					uni.setStorageSync("userinfo", res.data["data"]["userinfo"])
					if (this.type === "one") {
						this.dow();
					} else {
						this.dows()
					}

				} else {
					uni.showToast({
						icon: "error",
						title: "网络错误",
					})
				}
			},
			clickButtonType(type) {
				this.type = type;
				uni.getStorage({
					key: "setting",
					success: (res) => {
						if (res.data.seStatus === "1") {
							if (type == "one") {
								this.content = '普通下载会消耗1积分。无消耗下载不会消耗积分。'
							} else {
								this.content = '普通下载会消耗' + this.list3.length + '积分。无消耗下载不会消耗积分。'
							}
							this.isDownloadStatus = true;
						} else {
							if (type == "one") {
								this.content = '下载会消耗1积分。'
							} else {
								this.content = '下载会消耗' + this.list3.length + '积分。'
							}
							this.isDownloadStatus = false;
						}
					}
				})
				this.downloadshow = true;
			},
			downloadType() {
				uni.getStorage({
					key: "userinfo",
					success: (res1) => {
						if (this.type === "one") {
							if (res1.data.uCount < 1) {
								uni.showToast({
									icon: "error",
									title: "积分不足",
								})
							} else {
								uni.$u.throttle(() => this.downloadPicDeleteUserCount(1, res1.data.uOpenid),
									1200)
							}
						} else {
							if (res1.data.uCount < this.list3.length) {
								uni.showToast({
									icon: "error",
									title: "积分不足",
								})
							} else {
								uni.$u.throttle(() => this.downloadPicDeleteUserCount(this.list3.length, res1
									.data.uOpenid), 1200)
							}
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
			async getSearchResult(page, input) {
				const res = await App._getRequest({
					url: '/getSearchResult?pageNumber=' + page + '&input=' + input,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.list3 = res.data["data"]["thumb"];
					this.url_list = res.data["data"]["url"];
					this.hasmore = res.data["data"]["hasmore"];
					// console.log(this.url_list)
					console.log(this.hasmore)
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器出现问题咯！",
					})
				}
			},
			onchage(e) {
				this.swiperCurrent = e.current;
			},
			viewOnePicture() {
				uni.setStorage({
					key: 'url',
					data: this.url_list[this.swiperCurrent]
				});
				uni.navigateTo({
					url: `/pages/preview/preview`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			},

			previous() {
				if (this.currentPage >= 1) {
					this.currentPage = this.currentPage - 1;
					this.getSearchResult(this.currentPage, this.userinput)
					this.swiperCurrent = 0;
				}
				console.log(this.currentPage);
			},
			next() {
				if (this.hasmore) {
					this.currentPage = this.currentPage + 1;
					this.getSearchResult(this.currentPage, this.userinput)
					this.swiperCurrent = 0;
				}
				console.log(this.currentPage);
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
				var msg = this.url_list[this.swiperCurrent]
				// msg = encodeURIComponent(msg)
				this.download(msg, 0)
			},
			dows() {
				this.code = 403
				uni.showLoading({
					title: "下载第" + this.image + "/" + this.url_list.length + "张"
				})
				var msg = this.url_list[0]
				// msg = encodeURIComponent(msg)
				this.download(msg, 1)
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
								} else {
									this.image = this.image + 1
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
				})
			},
		},
		onLoad(option) {
			var _this = this;
			if (Object.keys(option).length != 0) {
				_this.userinput = option.user_input;
				if (option.user_input.length > 4) {
					this.currTitle = option.user_input.substring(0, 4) + "-搜索结果";
				} else {
					this.currTitle = option.user_input + "-搜索结果";
				}
				_this.getSearchResult(_this.currentPage, option.user_input).then(setTimeout(function() {
					_this.isLoading = false
				}, 1200));
			}
			uni.getStorage({
				key: "setting",
				success: (res) => {
					if (res.data.seStatus !== "0") {
						this.isShowAd = "1";
						this.ad_id = res.data.seVideo;
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
									_this.downloadshow = false;
									if (_this.type === "one") {
										_this.dow();
									} else {
										_this.dows()
									}
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
		}
	}
</script>

<style lang="scss">
	.list_swiper {
		margin-top: 30rpx;
	}

	.list_swiper_button_group {
		padding: 35rpx 30rpx;
	}

	.goup_2 {
		margin-top: 25rpx;
	}
</style>