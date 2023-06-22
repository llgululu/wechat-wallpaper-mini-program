<template>
	<view class="search">
		<view>
			<u-search bgColor="#F2F2F2" @custom="custom" :showAction="true" actionText="搜索" @search="search"
				:animation="true">
			</u-search>
		</view>

		<view class="reci_list">
			<u-list height="100%">
				<u-list-item v-for="(item,index) in reci_list" :key="index">
					<u-row gutter="10">
						<u-col span="1">
							<view class="reci_list_one"><u--text color="#B1BABF" :text="item.id1"></u--text></view>
						</u-col>
						<u-col span="5">
							<view @click="reci_search(item.name1)" class="reci_list_one"><u--text
									:text="item.name1"></u--text></view>
						</u-col>
						<u-col span="1">
							<view class="reci_list_one"><u--text color="#B1BABF" :text="item.id2"></u--text></view>
						</u-col>
						<u-col span="5">
							<view @click="reci_search(item.name2)" class="reci_list_one"><u--text
									:text="item.name2"></u--text></view>
						</u-col>
					</u-row>
				</u-list-item>
			</u-list>
		</view>
		<view v-if="isShowAd=='1'" class="adview">
			<ad :unit-id="ad_id"></ad>
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
				reci_list: [{
					id1: "",
					name1: "",
					id2: "",
					name2: ""
				}]
			}
		},
		methods: {
			reci_search(name) {
				this.goToSearchResult(name);
			},
			search(e) {
				this.goToSearchResult(e);
			},
			custom(e) {
				this.goToSearchResult(e);
			},
			goToSearchResult(user_input) {
				if (user_input != '') {
					uni.navigateTo({
						url: `/pages/search/searchResults?user_input=${user_input}`,
						animationType: 'pop-in',
						animationDuration: 300
					})
				} else {
					uni.$u.toast('输入为空！');
				}

			},
			async getHotKeyWord() {
				const res = await App._getRequest({
					url: '/getHotKeyWord',
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.reci_list = res.data["data"]["list"];
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器出现问题咯！",
					})
				}
			},
		},
		mounted() {
			var _this = this;
			_this.getHotKeyWord().then(setTimeout(function() {
				_this.isLoading = false
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
		}
	}
</script>

<style lang="scss">
	.search {
		padding-top: 10rpx;
	}

	.reci_list {
		padding: 25rpx 25rpx;
	}

	.reci_list_one {
		margin: 8rpx 0;
	}
</style>