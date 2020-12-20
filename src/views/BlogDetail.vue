<template>
  <div>
    <Header></Header>
    <div class="h-blog">
      <h2>{{ blog.title }}</h2>
      <el-link icon="el-icon-edit" v-if="isOwnBlog"
        ><router-link :to="{ name: 'BlogEdit', params: { blogId: blog.id } }">
          <el-link type="warning">编辑</el-link>
        </router-link>
      </el-link>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header"; //引入以后以标签形式<Header>使用
import "github-markdown-css"; // 添加样式markdown-body
export default {
  name: "BlogDetail.vue",
  components: { Header },
  data() {
    return {
      blog: {
        id: "",
        title: "标题",
        content: "内容",
        userId: "",
      },
      isOwnBlog: false,
    };
  },
  created() {
    const blogId = this.$route.params.blogId;
    console.log(blogId);
    let that = this;
    this.$axios(`/blog/detail/${blogId}`).then(({ data }) => {
      // console.log(data);
      const { id, userId, title, content } = data.data;
      that.blog = { id, userId, title, content };

      let MardownIt = require("markdown-it");
      let m_content = new MardownIt().render(this.blog.content); // 对content进行markdown格式渲染
      this.blog.content = m_content;

      let json = sessionStorage.getItem("userInfo");
      // console.log(json);
      if (json !== '""') {
        that.isOwnBlog = that.blog.userId === JSON.parse(json).id;
      }
      // console.log("blog", that.blog);
    });
  },

  methods: {},
};
</script>

<style>
.h-blog {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 700px;
  padding: 20px 15px;
}
</style>