<template>
  <div>
    <Header></Header>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-loading="loading"
          :timestamp="blog.created"
          placement="top"
          v-for="blog in blogs"
        >
          <el-card class="blogform">
            <h2>
              <router-link
                :to="{ name: 'BlogDetail', params: { blogId: blog.id } }"
              >
                <!-- 跳转到博客详情 -->
                <el-link type="danger"
                  ><p class="linkfont">{{ blog.title }}</p></el-link
                >
              </router-link>
            </h2>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 分页组件 -->
    <el-pagination
      class="h-page"
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="page"
    >
    </el-pagination>
  </div>
</template>

<script>
import Header from "../components/Header"; //引入以后以标签形式<Header>使用
export default {
  name: "Blogs.vue",
  components: { Header },

  data() {
    return {
      blogs: {},
      currentPage: 1, // 当前页码
      total: 0, // 数据总数
      pageSize: 5, // 单页长度
      loading: true,
    };
  },
  methods: {
    page(currentPage) {
      // 请求获取博客数据
      const that = this;

      this.$axios({
        method: "get",
        url: "/blog/list?currentPage=" + currentPage,
      }).then((res) => {
        // console.log(res);
        if (res) {
          // console.log(res.data.data.records);
          that.blogs = res.data.data.records;
          for (let i = 0; i < that.blogs.length; i++) {
            // console.log(that.blogs[i].description.length);
            if (that.blogs[i].description.length > 50) {
              that.blogs[i].description =
                that.blogs[i].description.slice(0, 50) + "...";
            }
          }
          that.currentPage = res.data.data.current;
          that.total = res.data.data.total;
          that.pageSize = res.data.data.size;
          that.loading = false;
        }
      });
    },
  },
  created() {
    this.page(1); // 页面加载时就请求数据，默认参数为第一页
  },
};
</script>

<style>
.linkfont {
  font-size: larger;
}

.blogform {
  /* background-image: url(../static/img/blog2.jpg); */
  background-image: url(https://blog-hananoq.oss-cn-hangzhou.aliyuncs.com/bg/blog2.jpg);
  width: 90%;
}

.h-page {
  margin: 0 auto;
  text-align: center;
}
.el-pagination{
  /* margin-bottom: 60px; */
}
</style>