<template>
  <div class="h-header">
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="item in 6" :key="item"> </el-carousel-item>
    </el-carousel>
    <h3 v-show="hasLogin" style="font-family: sans-serif; color: #880000">
      欢迎来到{{ user.username }}的博客
    </h3>
    <div class="block">
      <el-avatar filt="none" :size="100" :src="user.avatar"></el-avatar>
      <div>
        <i class="el-icon-user-solid"></i
        ><span style="font-family: sans-serif; color: #664422">{{
          user.username
        }}</span>
      </div>
    </div>

    <div class="divider">
      <el-link type="primary" href="/">首页</el-link>
      <el-divider direction="vertical"></el-divider>
      <el-link type="success" href="/blog/add" :disabled="!hasLogin"
        >发表博客</el-link
      >
      <el-divider direction="vertical"></el-divider>
      <span v-show="!hasLogin">
        <el-link type="warning" href="/login">登陆</el-link>
      </span>
      <span v-show="hasLogin">
        <el-link type="danger" @click="logout">退出</el-link>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "请先登录",
        avatar:
          "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      },
      hasLogin: false,
    };
  },
  methods: {
    logout() {
      // 用户注销
      this.$store.commit("REMOVE_INFO"); // 清楚用户信息
      this.$message({
        message: "注销成功",
        type: "info",
      });
      this.$router.push("/login"); // 跳转到登录页面
    },
  },

  created() {
    let json = sessionStorage.getItem("userInfo");
    // console.log("the json", json.length);
    if (json && json.length !== 0 && json !== '""') {
      let userInfo = JSON.parse(json);
      this.user.username = userInfo.username;
      this.user.avatar = userInfo.avatar;
      this.hasLogin = true;
      // console.log("user", this.user);
    }
  },
};
</script>

<style>
.h-header {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.divider {
  margin: 10px 0;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(3n) {
  /* background-image: url(../static/img/pm.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/carousel/pm.jpg);
  background-size: cover;
}

.el-carousel__item:nth-child(3n + 1) {
  /* background-image: url(../static/img/pm2.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/carousel/pm2.jpg);
  background-size: cover;
}

.el-carousel__item:nth-child(3n + 2) {
  /* background-image: url(../static/img/pm4.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/carousel/pm4.jpg);
  background-size: cover;
}
</style>
