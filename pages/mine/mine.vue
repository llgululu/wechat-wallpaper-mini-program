<template>
	<view>
		<view class="touxiang_bg">
			<view style="padding-top: 50rpx;">
				<image @click="showTos" class="touxiang" :src="imageurl">
				</image>
			</view>
			<view><u--text @click="showTos" color="white" :text="username" align="center"></u--text></view>
		</view>
		<view class="mine_botton_group">
			<u-cell-group>
				<u-cell title="我的积分" url="/pages/mine/mycount" :label="jifenlabel" value="去获得" :isLink="true">
					<u-icon slot="icon" size="20" name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=3b073b6be3a9fd56d5c936ad942a0aae"></u-icon>
				</u-cell>
				<u-cell title="使用说明" @click="showT" :isLink="true">
					<u-icon slot="icon" size="20" name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=86542ddb9a316a2cd75fa79524461ff5"></u-icon>
				</u-cell>
				<u-cell title="在线客服" @click="showT" :isLink="true">
					<u-icon slot="icon" size="20" name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=fa137fd4dd66c905e0a2e75e90c2ea71"></u-icon>
				</u-cell>
				<u-cell title="关于我们" url="/pages/mine/about" :isLink="true">
					<u-icon slot="icon" size="20" name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=ee8fe7bd643af037bc574d14d35f2423"></u-icon>
				</u-cell>
			</u-cell-group>
		</view>
		<view>
			<u-popup :show="show" :round="10" mode="center" @close="close" @open="open">
				<view class="popup-solt">
					<view class="popup-solt-avatar">
						<button class="popup-solt-avatar-image" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
							<image class="touxiang" :src="avatarUrl"></image>
						</button>
					</view>
					<view class="popup-solt-nickname">
						<u--input placeholder="请输入昵称" border="surround" :value="nickname" inputAlign="center"
							type="nickname" @blur="bindblur" @input="bindinput"></u--input>
					</view>
					<view class="baocun">
						<u-button throttleTime="1200" @click="edit" type="warning" text="保存修改"></u-button>
					</view>
				</view>
			</u-popup>
		</view>
		<view v-if="isShowAd=='1'" class="adview">
			<ad :unit-id="ad_id"></ad>
		</view>
	</view>
</template>

<script>
	var App = require("@/common.js");
	export default {
		data() {
			return {
				ad_id: '',
				isShowAd: "0",
				jifenlabel: '当前剩余:9999',
				imageurl: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=7d913b1a31f6cf66d71bebde97d1bd30',
				show: false,
				username: '用户',
				avatarUrl: '',
				nickname: ''
			};
		},
		mounted() {
			let _this = this;
			_this.setUserInfo();
			uni.getStorage({
				key: "setting",
				success: (res) => {
					if (res.data.seStatus === "1") {
						this.isShowAd = "1";
						this.ad_id = res.data.seBanner;
					}
				}
			})
		},
		methods: {
			showT(){
				uni.showToast({
					title: "还在开发中...",
				})
			},
			setUserInfo() {
				uni.getStorage({
					key: 'userinfo',
					success: (res) => {
						this.imageurl = res.data.uAvatarurl;
						this.username = res.data.uName;
						this.jifenlabel = '当前剩余:' + res.data.uCount;
						this.close();
					},
					fail() {
						uni.showToast({
							icon: "error",
							title: "出问题了！",
						})
					}
				})
			},
			async updateImage(uId, tempFilePath) {
				const updateRes = await App._updateFile({
					url: '/updateUserAvatar',
					filePath: tempFilePath,
					fileName: 'image',
					formData: {
						'name': this.nickname,
						'id': uId,
					}
				});
				let data = JSON.parse(updateRes.data)
				if (data["code"] === 200) {
					uni.setStorageSync("userinfo", data["data"]["userinfo"]);
					this.setUserInfo();
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器出现问题咯！",
					})
				}
			},
			edit() {
				if (this.nickname == "") {
					uni.showToast({
						icon: "error",
						title: "名称不能为空！",
					})
				} else {
					uni.getStorage({
						key: "userinfo",
						success: (res) => {
							uni.downloadFile({
								url: this.avatarUrl, //仅为示例，并非真实的资源
								success: (res1) => {
									if (res1.statusCode === 200) {
										console.log('下载成功');
										this.updateImage(res.data.uId, res1.tempFilePath);
									}
								}
							});

						},
						fail() {
							uni.showToast({
								icon: "error",
								title: "未登录！",
							})
						}
					})


				}
			},
			open() {
				this.avatarUrl = this.imageurl;
				this.nickname = this.username;
			},
			showTos() {
				this.show = true
			},
			close() {
				this.show = false
			},
			bindblur(e) {
				this.nickname = e; // 获取微信昵称
			},
			bindinput(e) {
				this.nickName = e; //这里要注意如果只用blur方法的话用户在输入玩昵称后直接点击保存按钮，会出现修改不成功的情况。
			},
			onChooseavatar(e) {
				this.avatarUrl = e.detail.avatarUrl;
			}

		}
	};
</script>

<style lang="scss">
	.touxiang_bg {
		height: 263rpx;
		background-image: url('https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=e548d394abb6328a0b3a2e4fdbed40cc');
		background-repeat: no-repeat;
		background-size: cover;
	}

	.touxiang {
		border-radius: 50%;
		display: block;
		margin: 0 auto;
		width: 120rpx;
		height: 120rpx;
	}

	.mine_botton_group {
		margin-top: 25rpx;
		padding: 25rpx 18rpx;
	}

	.popup-solt {
		width: 600rpx;
		height: 450rpx;
	}

	.popup-solt-avatar {
		margin-top: 80rpx;

	}

	.popup-solt-avatar-image {
		padding-bottom: 55rpx;
	}

	.popup-solt-avatar-image::after {
		border: none;
	}

	.baocun {
		margin-top: 40rpx;
	}
</style>