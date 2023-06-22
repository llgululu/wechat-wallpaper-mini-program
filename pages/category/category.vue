<template>
	<view class="u-demo-block__content">
		<u-toast ref="uToast"></u-toast>
		<u-row customStyle="margin-bottom: 10px" align="top">
			<u-col span="3">
				<view class="bg-gray-left">
					<u-list height="100%" @scrolltolower="scrolltolower">
						<u-list-item v-for="(item, index) in indexList" :key="index">
							<u-cell @click="click1(index)" :style="choseCell==index ? 'background-color:white':''"
								:titleStyle="choseCell==index ? 'color:green':'color:black'" align="center"
								:title="item.name">
							</u-cell>
						</u-list-item>
					</u-list>
				</view>
			</u-col>
			<u-col span="9">
				<view class="little-category">
					<u-list height="100%" @scrolltolower="scrolltolower">
						<u-list-item v-for="(item, index) in little_list" :key="index">
							<u-row gutter="10 ">
								<u-col v-for="(it, ind) in item" :key="ind" span="4" align="center">
									<view @click="click2(3*index+ind)" class="little-category-piclist">
										<u--image :lazy-load="true" shape="square" radius="15rpx" width="150rpx"
											height="150rpx" :src="it.pic">
											<template v-slot:loading>
												<u-loading-icon color="red"></u-loading-icon>
											</template>
										</u--image>
										<u--text align="center" :text="it.name"></u--text>
									</view>
								</u-col>
							</u-row>
						</u-list-item>
					</u-list>

				</view>
			</u-col>
		</u-row>
		<u-loading-page :loading="isLoading"></u-loading-page>
	</view>
</template>

<script>
	var App = require("@/common.js");
	export default {
		data() {
			return {
				isLoading: true,
				show: true,
				choseCell: 0,
				indexList: [{
					id: 9999,
					name: ''
				}],
				little_list: [
					[{
						id: 1077,
						classId: 9999,
						name: "",
						pic: ""
					}],
				]
			}
		},
		mounted() {
			var _this = this;
			_this.getCategory().then(_this.getChildCategory(_this.indexList[_this.choseCell].id).then(setTimeout(
				function() {
					_this.isLoading = false
				}, 1200)));
		},
		methods: {
			async getCategory() {
				const res = await App._getRequest({
					url: '/getCategory',
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.indexList = res.data["data"]["category"];
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器出现问题咯！",
					})
				}
			},
			async getChildCategory(categoryId) {
				const res = await App._getRequest({
					url: '/getChildCategory?categoryId=' + categoryId,
					method: 'GET'
				});
				if (res.data["code"] === 200) {
					this.little_list = res.data["data"]["childCategory"];
				} else {
					uni.showToast({
						icon: "error",
						title: "服务器出现问题咯！",
					})
				}
			},
			click1(index) {
				if(index!==this.choseCell){
					this.choseCell = index;
					this.getChildCategory(this.indexList[this.choseCell].id)
				}
			},
			click2(index) {
				uni.navigateTo({
					url: `/pages/category/category_info?index=${index}&title=${this.indexList[this.choseCell].name}&classId=${this.indexList[this.choseCell].id}`,
					animationType: 'pop-in',
					animationDuration: 300
				})
			},
			scrolltolower() {
				this.showToast()
			},
			showToast() {
				this.$refs.uToast.show({
					message: "已经到底了！",
					type: "default",
					position: "center",
				})
			}

		},
	}
</script>
<style lang="scss">
	.bg-gray-left {
		background-color: #f3f4f6;
	}

	.little-category {
		padding: 12rpx 12rpx;
	}

	.little-category-piclist {
		margin: 8rpx 0;
	}
</style>