<template>
  <div>
    <el-container>
      <el-header>
        <img class="v-log" src="https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/pm3.jpg"/>
      </el-header>
      <el-main>
        <div>
          <el-upload
            action=""
            :http-request="Upload"
            :data="Aliyun"
            :multiple="false"
            :show-file-list="true"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="1"
          >
            <!-- <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" /> -->
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>

        <!-- <img width="20%" :src="dialogImageUrl" alt="" /> -->

        <el-form
          :model="userForm"
          :rules="rules"
          ref="userForm"
          label-width="100px"
          class="login-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="userForm.password"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPass">
            <el-input type="password" v-model="secondPass"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('userForm')"
              >立即注册</el-button
            >
            <el-button @click="resetForm('userForm')">重置</el-button>
            <router-link
              class="regisLink"
              type="warning"
              :to="{ name: 'Login' }"
              >已有账号？前往登录</router-link
            >
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { client } from "../alioss";
export default {
  name: "Register.vue",
  data() {
    let confirmPassValid = (rule, v, callback) => {
      // 确认两次密码是否一致
      let value = this.secondPass;
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.userForm.password) {
        callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };

    let checkEmail = (rule, value, callback) => {
      // 校验邮箱格式
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };

    return {
      userForm: { // 提交的用户信息
        username: "",
        password: "",
        avatar: "",
        email: "",
      },
      dialogImageUrl: "", // 图片放大路径
      dialogVisible: false,
      Aliyun: {}, // 存签名信息
      progress: 0, // 进度条
      imgUrl: [], // 存上传后的图片url，
      secondPass: "",
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
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        confirmPass: [
          { required: true, validator: confirmPassValid, trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 提交用户数据进行注册
        let that = this;
        this.$axios({
          method: "post",
          url: "/oauth/register",
          data: that.userForm,
        }).then((res) => {
          // console.log(res.data);
          if (res.data.code === 200) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            that.$router.push("/login"); // 跳转到登录页面
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取阿里云数据
    async getAliyun() {
      this.$axios.get("/blog/oss").then(({ data }) => {
        this.Aliyun = data.data;
      });
    },
    // 上传图片
    Upload(file) {
      const that = this;
      // 判断扩展名
      const tmpcnt = file.file.name.lastIndexOf(".");
      const exname = file.file.name.substring(tmpcnt + 1);
      const names = ["jpg", "jpeg", "png"];
      if (names.indexOf(exname) < 0) {
        this.$message.error("不支持的格式!");
        return;
      }
      if (file.size > 1024 * 1024 * 3) {
        this.$message.error("图片大小最大1M");
        return;
      }
      async function multipartUpload() {
        // const fileName = that.name + file.file.uid
        const fileName = "avatar/" + Date.now() + "-" + file.file.name;
        // fileName = aliyunConfig.objectName+'/'+Date.now()+'-'+file.name //所要上传的文件名拼接 (test/)
        // 定义唯一的文件名，打印出来的uid其实就是时间戳
        // client 是第一步中的 client
        client(that.Aliyun)
          .put(fileName, file.file, {
            progress: function (p) {
              // 获取进度条的值
              // console.log(p);
              that.progress = p * 100;
            },
          })
          .then((result) => {
            // 下面是如果对返回结果再进行处理，根据项目需要
            // that.imgUrl = 'http://' + result.bucket + '.' + that.Aliyun.endpoint + '/' + result.name
            // console.log("result", result);
            that.dialogImageUrl = result.url;
            that.userForm.avatar = result.url;
            that.imgUrl.push({
              name: file.file.name,
              url: result.url,
            });
            // console.log("imgUrl", that.imgUrl);
          })
          .catch((err) => {
            console.log("err:", err);
          });
      }
      multipartUpload();
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除图片
    handleRemove(file, fileList) {
      // console.log(file)
      for (var i in this.imgUrl) {
        if (this.imgUrl[i].name === file.name) {
          this.imgUrl.splice(i, 1);
        }
      }
    },
  },

  created() {
    this.getAliyun();
  },
};
</script>

<style>
.el-header,
.el-footer {
  /* background-image: url(../static/img/hbg.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/hbg.jpg);
  color: royalblue;
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
  /* background-image:url(../static/img/mbg.jpg); */
  background-image:url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/mbg.jpg);
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.regisLink {
  margin-left: 10px;
}
</style>