<template>
  <div id="backg">
    <Music></Music>
    <div id="app">
      <meta name="referrer" content="no-referrer" />
      <!-- 解决请求图片403问题 -->
      <div id="nav"></div>
      <router-view class="router-tag"/>
    </div>
  </div>
</template>

<script>
import Music from "./components/Music";
export default {
  components: {
    Music,
  },
};
</script>


<style>
#backg {
  background-size: cover;
  /* background-image: url(static/img/bg4.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/bg4.jpg);
}
#app {
  max-width: 960px;
  margin: 0 auto;
  background-size: cover;
  /* background-image: url(static/img/bg2.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/bg2.jpg);
}

.router-tag{
  margin-bottom: 60px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
