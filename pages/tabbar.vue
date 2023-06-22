<template>
	<view>
		<view>
			<home v-if="PageCur=='0'" ref="home"></home>
			<category v-if="PageCur=='1'" ref="category"></category>
			<search v-if="PageCur=='2'" ref="search"></search>
			<mine v-if="PageCur=='3'" ref="mine"></mine>
		</view>
		<view class="tabbar">
			<u-tabbar :value="PageCur" @change="change1"  :fixed="true" :placeholder="true" :safeAreaInsetBottom="false">
				<u-tabbar-item text="首页" icon="home"></u-tabbar-item>
				<u-tabbar-item text="分类" icon="tags"></u-tabbar-item>
				<u-tabbar-item text="搜索" icon="search"></u-tabbar-item>
				<u-tabbar-item text="我的" icon="account"></u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	var App = require("@/common.js");
	import home from "@/pages/index/index.vue"; //首页
	import category from "@/pages/category/category.vue"; //首页
	import search from "@/pages/search/search.vue"; //搜索页
	import mine from "@/pages/mine/mine.vue"; //搜索页
	export default {
		components: {
			home,
			category,
			search,
			mine
		},

		data() {
			return {
				PageCur: 0,
				map1: [
					"首页",
					"分类",
					"搜索",
					"我的"
				],
			}
		},
		mounted() {
			let _this = this;
			_this.wxlogin();
		},
		methods: {
			change1(name) {
				this.PageCur = name;
				uni.setNavigationBarTitle({
					title: this.map1[name]
				});
			},
			async userLogin(code) {
				const res = await App._getRequest({
					url: '/getSettingAndUserInfo?code=' + code,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					uni.setStorageSync("userinfo",res.data["data"]["userinfo"])
					uni.setStorageSync("setting",res.data["data"]["setting"])
					uni.setStorageSync("share",res.data["data"]["share_setting"])
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器问题",
					})
					uni.clearStorageSync();
				}
			},
			wxlogin() {
				let _this = this;
				wx.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (logincode) => {
						_this.userLogin(logincode.code)
					},
					fail(err) {
						uni.showToast({
							icon: "error",
							title: err.errMsg,
						})
					}
				})
			}
		},
	}
</script>

<style>
</style>