<template>
	<view>
		<view class="userHome">
			<view class="margin-top-lg">
				<text>Hi! 欢迎使用LL壁纸小程序！</text>
			</view>

			<view class="margin-top">
				<text><text style="margin-left: 40rpx;"></text>这个小程序我拿来练手的，写得不是很好，借鉴了很多小程序代码，但是这个小程序永久免费使用。</text>
			</view>
		</view>
		<view v-if="isShowAd=='1'">
			<ad :unit-id="ad_id" ad-type="video" ad-theme="white"></ad>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				ad_id:'',
				isShowAd: "0",
			}
		},
		onLoad() {
			uni.getStorage({
				key: "setting",
				success: (res) => {
					if (res.data.seStatus === "1") {
						this.isShowAd = "1";
						this.ad_id = res.data.seVideo;
					} 
				}
			})
		},

		methods: {

		}
	}
</script>

<style>
	page {
		background-color: #F1F1F1;
	}

	.userHome {
		background-color: #FFFFFF;
		margin: 50rpx;
		padding: 50rpx;
		border-radius: 10rpx;
	}

	text {
		color: #7C7C7C;
	}
</style>