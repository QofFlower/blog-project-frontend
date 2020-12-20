<template>
  <div>
	  <br><br><br>
    <el-container>
      <el-header>
        <img class="v-log" src="https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/pm3.jpg" alt="" />
      </el-header>
      <el-main class="mainform">
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userForm"
          label-width="100px"
          class="login-form"
        >
		<div style="margin: 70px;"></div>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="userForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('userForm')"
              >登录</el-button
            >
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button @click="resetForm('userForm')">重置</el-button>
            <router-link
              class="regisLink"
              type="warning"
              :to="{ name: 'Register' }"
              >没有账号？立即注册</router-link
            >
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
	<div>
		<br><br><br><br><br><br><br>
	</div>
  </div>
</template>

<script>
export default {
  name: "Login.vue",
  data() {
    return {
      userForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 30,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let param = new URLSearchParams(); // 用来解决前端传参后台获取为空的问题
          let client_info = this.$store.getters.getClientInfo;
          // console.log("client_info", client_info);

          param.append("username", this.userForm.username);
          param.append("password", this.userForm.password);
          param.append("grant_type", client_info.grant_type);
          param.append("client_id", client_info.client_id);
          param.append("client_secret", client_info.client_secret);
          param.append("scope", client_info.scope);

          this.$axios({
            method: "post",
            url: "/oauth/token",
            data: param,
          }).then(
            (res) => {
              if (res) {
                const access_token = res.data.access_token;

                this.$message({
                  message: "登录成功",
                  type: "success",
                });

                let userString = decodeURIComponent(
                  // 提取jwt中的用户信息部分
                  escape(window.atob(access_token.split(".")[1]))
                );

                let userInfo = JSON.parse(userString).user_name; // 解析Jwt获取用户信息
                
                // console.log("Login page", userInfo);
                that.$store.commit("SET_TOKEN", access_token); // 保存token
                that.$store.commit("SET_USERINFO", userInfo); // 保存用户信息

                // console.log("getter", that.$store.getters.getUser);
                that.$router.push("/"); // 页面跳转到首页
              }
            }
            // ,
            // (err) => {
            //   this.$message({
            //     message: "用户名或密码错误",
            //     type: "error",
            //   });
            // }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
.mainform{
	height:400px;
}

.el-header,
.el-footer {
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/hbg.jpg);
  /* background-image: url(../static/img/hbg.jpg); */
  color: #000066;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-image:url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/mbg.jpg);
  /* background-image:url(../static/img/mbg.jpg); */
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.v-log {
  height: 100%;

}
.login-form {
  max-width: 500px;
  margin: 0 auto; /* 居中 */
}
.regisLink {
  margin-left: 10px;
}
</style>