<!-- 直接把index里的东西覆盖，看看效果吧 -->
<template>
	<view>

		<view>
			<u-swiper height="200" keyName="carUrl" imgMode="scaleToFill" :list="list1" @change="e => current = e.current"
				:autoplay="false">
				<view slot="indicator" class="indicator">
					<view class="indicator__dot" v-for="(item, index) in list1" :key="index"
						:class="[index === current && 'indicator__dot--active']">
					</view>
				</view>
			</u-swiper>
		</view>
		<view>
			<u-notice-bar :text="text1"></u-notice-bar>
		</view>
		<view class="home_title">
			<u-icon label="热门壁纸" labelColor="#fa3534" labelPos="right" labelSize="35rpx" size="35rpx"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=26093e179b64fb10b6a186336d3283ef"></u-icon>
		</view>
		<view class="bizhi_row" v-for="(item, index) in hot_list" :key="secondKey('hot',index)">
			<u-row gutter="4">
				<u-col span="4" v-for="(it, ind) in item" :key="ind">
					<view @click="viewOnePicture('hot',index,ind)">
						<u--image :lazy-load="true" radius="15rpx" width="100%" :src="it.thumb">
							<template v-slot:loading>
								<u-loading-icon color="#3c9cff"></u-loading-icon>
							</template>
						</u--image>
					</view>
				</u-col>
			</u-row>
		</view>
		<view v-if="isShowAd=='1'" class="adview">
			<ad :unit-id="ad_id"></ad>
		</view>
		<view class="home_title">
			<u-icon label="最新壁纸" labelColor="#2979ff" labelPos="right" labelSize="35rpx" size="35rpx"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=5c0f3638f64bfc31c89999cd6e527e6e"></u-icon>
		</view>
		<view class="bizhi_row" v-for="(item, index) in new_list" :key="secondKey('new',index)">
			<u-row justify="space-between" gutter="4">
				<u-col span="4" v-for="(it, ind) in item" :key="ind">
					<view @click="viewOnePicture('new',index,ind)">
						<u--image :lazy-load="true" radius="15rpx" width="100%" :src="it.thumb">
							<template v-slot:loading>
								<u-loading-icon color="#3c9cff"></u-loading-icon>
							</template>
						</u--image>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-loading-page :loading="isLoading"></u-loading-page>
	</view>


</template>

<script>
	var App = require("@/common.js");
	export default {
		data() {
			return {
				ad_id: '',
				isShowAd: "0",
				isLoading: true,
				text1: '一个好用的壁纸小程序',
				current: 0,
				list1: [{
					carId:1,
					carUrl:'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=95c4a598343a9a89f11fe0ca4ac1a9e4',
				}
					
				],
				hot_list: [
					[{
							thumb: '',
							url: ''
						},
						{
							thumb: '',
							url: ''
						},
						{
							thumb: '',
							url: ''
						},
					]
				],
				new_list: [
					[{
							thumb: '',
							url: ''
						},
						{
							thumb: '',
							url: ''
						},
						{
							thumb: '',
							url: ''
						},
					]
				],
			}
		},
		mounted() {
			var _this = this;
			_this.getData().then(_this.setNoticeBar()).then(setTimeout(function() {
				_this.isLoading = false;
			}, 1200));
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
			setNoticeBar() {
				uni.getStorage({
					key: "setting",
					success: (res) => {
						this.text1 = res.data.seNotice;
					}
				})
			},
			async getData() {
				const res = await App._getRequest({
					url: '/getHomeWallpaperList',
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.hot_list = res.data["data"]["hot"];
					this.new_list = res.data["data"]["new"];
					if(res.data["data"]["carousel"]!==null){
						this.list1 = res.data["data"]["carousel"];
					}
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器出现问题咯！",
					})
				}
			},
			secondKey(first, second) {
				return `${first}_${second}`
			},
			viewOnePicture(kind, index0, index1) {
				var list;
				if (kind == 'hot') {
					list = this.hot_list;
				} else if (kind == 'new') {
					list = this.new_list;
				}
				uni.setStorage({
					key: 'url',
					data: list[index0][index1].url
				});
				uni.navigateTo({
					url: `/pages/preview/preview`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			}
		}
	}
</script>

<style lang="scss">
	.adview {
		width: 100%;
	}

	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			height: 6px;
			width: 6px;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 0 5px;
			transition: background-color 0.3s;

			&--active {
				background-color: #ffffff;
			}
		}
	}



	.home_title {
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		padding: 15rpx;
	}

	.bizhi_row {
		padding-left: 8rpx;
		padding-right: 8rpx;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}
</style>