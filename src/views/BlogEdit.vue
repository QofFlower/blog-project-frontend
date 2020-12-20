<template>
  <div>
    <Header></Header>
    <div class="h-content">
      <el-form
        :model="blogForm"
        :rules="rules"
        ref="blogForm"
        label-width="100px"
        class="demo-blogForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="blogForm.title"></el-input>
        </el-form-item>

        <el-form-item label="摘要" prop="description">
          <el-input type="textarea" v-model="blogForm.description"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="blogForm.content"></mavon-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('blogForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('blogForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header"; //引入以后以标签形式<Header>使用
export default {
  name: "BlogEdit.vue",
  components: { Header },
  data() {
    return {
      blogForm: {
        title: "",
        description: "",
        content: "",
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 3,
            max: 25,
            message: "长度在 3 到 25 个字符",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请输入摘要", trigger: "blur" },
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          // console.log("commit", this.blogForm);
          this.$axios({
            method: "post",
            url: "/blog/edit",
            data: that.blogForm,
          }).then((res) => {
            this.$alert(res.data.message, "编辑博客", {
              confirmButtonText: "确定",
              callback: (action) => {
                this.$message({
                  type: res.data.code === 200 ? "info" : "error",
                  message: res.data.message,
                });
              },
            });
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  created() {
    const blogId = this.$route.params.blogId;
    console.log(blogId);
    if (blogId) { 
      this.$axios(`/blog/detail/${blogId}`).then(({ data }) => {
        // console.log(data);
        const { title, description, content } = data.data;
        this.blogForm = { title, description, content };
      });
    }
    // console.log(this.blogForm);
  },
};
</script>

<style>
.h-content {
  width: 90%;
  margin: 0 auto;
  text-align: center;
}
</style>