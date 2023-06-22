<template>
	<view class="container">
		<view>
			<u-icon label="分享得积分" labelColor="#fa3534" labelPos="right" labelSize="35rpx" size="35rpx"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=26093e179b64fb10b6a186336d3283ef"></u-icon>
			<view class="neibu">
				<u-button throttleTime="1200" @click="shareJiangli" type="success" :plain="true" openType="share"
					:text="text2"></u-button>
			</view>
		</view>
		<view>
			<u-icon label="签到得积分" labelColor="#fa3534" labelPos="right" labelSize="35rpx" size="35rpx"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=26093e179b64fb10b6a186336d3283ef"></u-icon>
			<view class="neibu">
				<u-button @click="getUserCount(2)" throttleTime="1200" type="success" :disabled="isdisabled"
					:plain="true" :text="text1"></u-button>
			</view>
		</view>
		<view>
			<u-icon label="积分兑换码" labelColor="#fa3534" labelPos="right" labelSize="35rpx" size="35rpx"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=26093e179b64fb10b6a186336d3283ef"></u-icon>
			<view class="neibu">
				<u-code-input @change="change" @finish="finish"></u-code-input>
				<view class="neibu00">
					<u-button @click="submission" throttleTime="1200" type="success" :plain="true" text="确认"></u-button>
				</view>

			</view>
		</view>
		<view>
			<u-icon label="说明" labelPos="right" labelSize="35rpx" size="35rpx" name="more-circle"></u-icon>
			<view class="neibu">
				<u--text
					text="1. 积分说明:积分是本小程序下载壁纸时的消耗品,一张壁纸下载消耗1积分,首次使用本小程序的新用户可获得30积分,积分获取可通过本页面的3种方法获取.获得积分可能因为网络会延期到账,可刷新页面或者重新进入小程序查看."></u--text>
				<u--text text="2. 分享得积分,一天可以多次分享,但一天只有分享第一次时可获得3积分."></u--text>
				<u--text text="3. 签到得积分,一天只能签到一次,签到成功可获得2积分."></u--text>
				<u--text text="4. 兑换码兑换积分,一天可以多次兑换,兑换成功可获得兑换码所对应的积分.兑换码的获取可通过客服或者活动获取."></u--text>
			</view>
		</view>
		<view v-if="isShowAd=='1'">
			<ad :unit-id="ad_id" ad-type="video" ad-theme="white"></ad>
		</view>
		<u-modal @confirm="showAd" @cancel="ordinarySignIn" @close="show = false" :closeOnClickOverlay="true"
			:showCancelButton="true" confirmText="观看" cancelText="不了,谢谢" :show="show" :title="title"
			:content='content'></u-modal>
	</view>
</template>

<script>
	let videoAd = null;
	var App = require("@/common.js");
	export default {
		data() {
			return {
				ad_id: '',
				isShowAd: "0",
				show: false,
				title: '重要提示',
				content: '点击观看，观看广告可获得3倍积分。点击不了谢谢，只可获得一倍积分。是否观看广告获得3倍奖励？',
				isdisabled: false,
				text1: '签到',
				text2: '分享到微信',
				duihuanma: '',
				temp: 0,
			}
		},
		methods: {
			async addUserCount(score, openid) {
				const res = await App._getRequest({
					url: '/addUserCount?score=' + score + '&openid=' + openid,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					uni.showToast({
						icon: "success",
						title: "新增积分" + score,
					})
					uni.setStorageSync("userinfo", res.data["data"]["userinfo"])
					uni.setStorageSync("share", res.data["data"]["share_setting"])
					this.setButton();
				}
			},
			async availableCode(code, openid) {
				const res = await App._getRequest({
					url: '/availableCode?code=' + code + '&openid=' + openid,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					uni.setStorageSync("userinfo", res.data["data"]["userinfo"])
				} else {
					uni.showToast({
						icon: "error",
						title: res.data["msg"],
					})
				}
			},
			submission() {
				if (this.duihuanma.length == 6) {
					uni.getStorage({
						key: "share",
						success: (res) => {
							this.availableCode(this.duihuanma, res.data.sOpenid)
						}
					})
				} else {
					uni.showToast({
						icon: "error",
						title: "兑换码不满6位",
					})
				}
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
			shareJiangli() {
				let _this = this;
				uni.getStorage({
					key: "share",
					success: (res) => {
						_this.addUserCount(3, res.data.sOpenid)
					},
					fail() {
						uni.showToast({
							icon: "error",
							title: "用户未登录",
						})
					}
				})
			},
			ordinarySignIn() {
				uni.getStorage({
					key: "share",
					success: (res) => {
						this.show = false;
						this.addUserCount(2, res.data.sOpenid)
					}
				})
			},
			getUserCount() {
				let _this = this;
				uni.getStorage({
					key: "setting",
					success: (res) => {
						if (res.data.seStatus === "1") {
							_this.show = true;
						} else {
							uni.getStorage({
								key: "share",
								success: (res) => {
									_this.addUserCount(2, res.data.sOpenid)
								}
							})
						}
					}
				});

			},
			setButton() {
				uni.getStorage({
					key: "share",
					success: (res) => {
						if (res.data.sIsSign === "1") {
							this.text1 = "已签到";
							this.isdisabled = true;
						}
						if (res.data.sIsShare === "1") {
							this.text2 = "分享到微信（已分享）";
						}
					}
				});

			},
			change(e) {
				this.duihuanma = e;
			},
			finish(e) {
				this.duihuanma = e;
			},
		},
		mounted() {
			uni.getStorage({
				key: "setting",
				success: (res) => {
					if (res.data.seStatus === "1") {
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
									uni.getStorage({
										key: "share",
										success: (res1) => {
											this.show = false;
											this.addUserCount(6, res1.data.sOpenid)
										},
										fail() {
											uni.showToast({
												icon: "error",
												title: "用户未登录",
											})
										}
									})
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
			this.setButton();
		}
	}
</script>

<style>
	.container {
		padding: 20rpx 20rpx;
	}

	.neibu {
		padding: 30rpx 35rpx;
	}

	.neibu00 {
		margin-top: 20rpx;
	}
</style>