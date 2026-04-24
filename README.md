> <font style="color:rgb(31, 35, 40);">欢迎各位大佬</font><font style="color:rgb(31, 35, 40);">🏀</font><font style="color:rgb(31, 35, 40);">前来指导交流</font><font style="color:rgb(31, 35, 40);">🚀</font><font style="color:rgb(31, 35, 40);">，不要忘记动动发财的小手给作者点个</font><font style="color:rgb(31, 35, 40);">⭐</font><font style="color:rgb(31, 35, 40);">️喔~</font>
>
> 📢 <font style="color:rgb(89, 99, 110);">作者邮箱：</font>[<font style="color:rgb(9, 105, 218);">litaosheng2001@163.com</font>](mailto:litaosheng2001@163.com)
>
> [🔔 语雀版README](#%20%E3%80%8AExpoGluestackZhouse%20README%E3%80%8B)
>
> -------------------------------------------------------
>
> ⏰ App（目前只支持Android）仓库：[https://github.com/LTS2001/expo-gluestack-zhouse](https://github.com/LTS2001/expo-gluestack-zhouse)
>
> 🔗 后端服务仓库：[https://github.com/LTS2001/house-server](https://github.com/LTS2001/house-server)
>

# 1. 🚀 环境配置与运行
> node环境：v22.19.0。建议不低于v22
>

## 1.1 🎯 环境变量
###  JS/ReactNative环境变量
在 `.env.dev` `.env.prod` 两个环境变量文件中配置好符合自己项目情况的变量

`.env.dev` 文件填写开发环境的变量

```plain
APP_ENV=dev

# 后端服务地址
APP_SERVER_API_ROOT=https://litaosheng.top

# WebSocket的后端服务地址
APP_SERVER_SOCKET_ROOT=wss://litaosheng.top:6003

# 静态文件存放的地址
APP_SERVER_IMAGE_ROOT=https://litaosheng.top:10000/static


# 开发的时候，若两端（租客端和房东端）处于同一局域网内，则不需要填写下面的APP_WEBRTC_*字段
# turn服务器的ip
APP_WEBRTC_TURN_SERVER_IP=

# turn服务的用户名
APP_WEBRTC_TURN_USERNAME=

# turn服务的验证
APP_WEBRTC_TURN_CREDENTIAL=
```

`.env.prod` 文件填写生产环境（打包）的变量

```plain
APP_ENV=prod

# 后端服务地址
APP_SERVER_API_ROOT=https://litaosheng.top

# WebSocket的后端服务地址
APP_SERVER_SOCKET_ROOT=wss://litaosheng.top:6003

# 静态文件存放的地址
APP_SERVER_IMAGE_ROOT=https://litaosheng.top:10000/static


# turn服务器的ip
APP_WEBRTC_TURN_SERVER_IP=****

# turn服务的用户名
APP_WEBRTC_TURN_USERNAME=****

# turn服务的验证
APP_WEBRTC_TURN_CREDENTIAL=****
```

配置好上面的文件之后运行 `npm run gen:env` 命令，生成 `env.d.ts` 文件

> 也可以使用新建 `.env.local` 文件作为本地开发环境的变量，变量字段与上面的相同。**若存在 `.env.local` 则在dev环境下优先使用。**
>

### Android环境变量
1. 生成 `debug.keystore` 和 `release.keystore` 两个密钥文件，并放置于 `/android/app` 目录下
2. 新建文件 `gradle.dev.properties` 和 `gradle.prod.properties` 两个环境变量文件，并放置于  `/android` 目录下

```plain
android
  | app
    | src
    | - build.gradle
    | - debug.keystore	# 新建
    | - release.keystore	# 新建
  | gradle
  | - settings.gradle
  | - gradle.properties
  | - gradle.dev.properties 	# 新建
  | - gradle.prod.properties	# 新建
```

3. `gradle.dev.properties` 文件填写开发环境的变量

```plain
# 开发时要使用的keystore名字
SIGNING_STORE_FILE=debug.keystore

# keystore的密码
SIGNING_STORE_PASSWORD=****

# keystore中key的名字
SIGNING_KEY_ALIAS=****

# keystore中key的密码
SIGNING_KEY_PASSWORD=****
```

4. `gradle.prod.properties` 文件填写生产环境（打包）的变量

```plain
# 时要使用的keystore名字
SIGNING_STORE_FILE=release.keystore

# keystore的密码
SIGNING_STORE_PASSWORD=****

# keystore中key的名字
SIGNING_KEY_ALIAS=****

# keystore中key的密码
SIGNING_KEY_PASSWORD=****
```

## 1.2 🚩 项目运行
```plain
{
  "scripts": {
    # 执行脚本，生成env.d.ts
    "gen:env": "node scripts/generate-env-types.js",

    # 安装依赖成功后自动执行的命令
    "postinstall": "npm run gen:env",

    # 运行命令"android:dev"之前自动执行的命令
    "preandroid:dev": "npm run gen:env",

    # 运行项目，读取dev环境变量文件
    "android:dev": "cross-env APP_ENV=dev npx expo run:android",

    # 运行项目，读取prod环境变量文件
    "android:prod": "cross-env APP_ENV=prod npx expo run:android",

    # 打包项目为apk文件，读取prod环境变量文件
    "android:build:apk": "cd android && ./gradlew assembleRelease -PAPP_ENV=prod",

    # 打包项目为aab文件，读取prod环境变量文件
    "android:build:aab": "cd android && ./gradlew bundleRelease -PAPP_ENV=prod"
  },
}
```

> 1. 运行项目：`npm run android:dev`或者`npm run android:prod`
> 2. 打包项目：`npm run android:build:apk`或者`npm run android:build:aab`
>

# 2. 💥 功能
## 2.1 📕 房东
### 房屋增删改查
<img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764669347650-0ae92fed-f03b-44ac-b1fa-2a2ca626992e.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764669849195-a50dcd1d-aec6-4edd-ba18-9aecd6fde8af.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764669592818-20428194-bf68-4a61-abf0-190fd7beb51f.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764669666955-3234e4c6-a14e-4c86-9215-08081487b309.jpeg" style="width:200px;" />

### 管理个人信息
<img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670058155-530abb9e-f8f0-49f1-acad-928bfcf550b7.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670067798-55069115-0c5f-42a7-ab88-2bd23fb5fe7e.jpeg" style="width:200px;" />

### 与租客的实时信息回复以及视频通话
<img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670147118-6895a024-9f99-48d4-8b31-808dfc2ef797.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670164826-11987614-e897-4e0a-b347-3bc093e786ad.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670280420-a06a9fb1-efe2-4bc7-bd59-9c12bb0fd167.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670218457-005fd9cc-706f-4fc1-80a2-3e495ea5e790.jpeg" style="width:200px;" />

### 处理租客的租赁申请，房屋维修申请
<img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670386274-12b155e6-73f2-4e57-92ee-968c6ea2bd95.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670444389-72794b56-554f-448a-a796-4e4926ad117a.jpeg" style="width:200px;" />

## 2.2 📖 租客
### 与房东的实时信息回复以及视频通话
### 查看租房以及房屋租赁
<img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670709400-a371dd30-9abc-45fe-9796-e086e479fe09.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670733526-216f8ce2-d2bc-4472-af7a-3ee96ca8a1f1.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670748161-037f1ae9-2f05-49b0-a59d-41bd2832f580.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670758604-fe7f61a6-d7e3-494c-8a2c-a3f17b21868f.jpeg" style="width:200px;" />

### 查看个人信息、报修记录、收藏记录、租房历史
<img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670801529-16c38ec5-3a7d-4a36-8edd-a5f26b0231ea.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670815966-e93c5a1d-6ef9-409e-be67-581506bd84fb.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670832741-18778351-09ad-49f4-8d1a-cf9b9fa29007.jpeg" style="width:200px;" /> <img src="https://cdn.nlark.com/yuque/0/2025/jpeg/40739798/1764670861860-2790e25e-9213-41b6-800b-36fa3905f07a.jpeg" style="width:200px;" />

#  3. 🔍 技术栈
## 3.1 📗 前端
+ React Native 0.79.x
+ React 19.x
+ Expo 53.x
+ Mobx 6.x
+ Nativewind 4.1.x
+ Tailwindcss 3.4.x
+ Axios 1.9.x
+ Gluestack UI
+ React Native Webrtc 124.x
+ WebSocket

## 3.2 📘 后端
+ Midway
+ MySQL
+ TypeORM

