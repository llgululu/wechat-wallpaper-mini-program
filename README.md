# 微信壁纸小程序uniapp

### 介绍
这是一个用uniapp 写的微信壁纸小程序，ui框架采用uview，支持流量主banner广告、激励视频广告、视频广告。

小程序用积分限制用户无限制下载，用户可以通过看激励广告直接无消耗下载壁纸。

用户可通过签到、分享小程序和积分兑换码获得积分，其中签到时，看激励广告可以获得3倍积分。

小程序配备登录功能，将用户名和图片名存入数据库，将用户头像存入azure云储存中，不占用服务器空间。

图片展示不全，请见我的 gitee： https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program

小程序展示如下：

<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/%E5%8F%96%E5%A3%81%E7%BA%B8.jpg" width="200" height="200" alt="小程序码"/>

### 页面展示
页面依次为首页、分类、搜索、我的 4个主页面 

<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105323.jpg"  height="450" alt="首页"/>
<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105415.jpg" height="450" alt="分类"/>
<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105400.jpg" height="450" alt="搜索"/>
<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105332.jpg" height="450" alt="我的"/>


页面依次为预览单张图片、分类展示、搜索结果展示、签到分享得积分 四个子页面

<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105748.jpg" height="450" alt="预览"/>
<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105818.jpg" height="450" alt="分类展示图片"/>
<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105803.jpg" height="450" alt="搜索结果"/>
<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/IMG_20230622_105738.jpg" height="450" alt="签到分享"/>

### 小程序端安装和发布教程

1.  将本代码下载下来，用HBuildX打开，修改common.js 文件中的BASE_URL，改为你自己的域名。
2.  manifest.json文件中微信小程序配置Appid改为你自己的。
3.  发行到微信开发者工具，点击发布即可。

### 后端获取和接口

1.  后端采用spring boot和mybatis-plus，没有后台页面展示，有能力者可自行写（我修改都是直接去数据库改，所以不想写后台管理系统了）。
2.  因为壁纸API接口是我采集用别人的所以不方便展示，后端代码也没有git到本仓库，如需要后台代码和数据库，可扫描下方我的公众号二维码，发送关键字‘壁纸小程序后台源码’，即可获得（免费白嫖）。
3.  后端代码接口都有注释，代码写得很臭，有能力者自行修改，需要代搭建请公众号私信（代搭建）。
4.  关于后台储存用户头像的Azure云储存，这个需要自己去注册申请（Azure学生不收费，可白嫖），如果有其他云储存可自行修改。

公众号二维码：

<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/qrcode_for_gh_8ae253c75106_258.jpg" width="200" height="200" alt="公众号二维码"/>

我的其他小程序，望君看看：

<img src="https://gitee.com/Gulu_Lv/universal-watermark-removal/raw/master/gh_2a0a366062cd_430.jpg" width="200" height="200" alt="小程序码"/>

### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
