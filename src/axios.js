import axios from 'axios'
import TRouter from './router'
import store from './store'
import Element from 'element-ui'

axios.defaults.baseURL = "http://39.106.228.114:8130"
// axios.defaults.baseURL = "http://localhost:8130"

// 请求的前置拦截
axios.interceptors.request.use(config => {
    let token = localStorage.getItem("access_token");
    // console.log("token: ", token);
    if (token && token !== '') {
        // console.log("有令牌啦！！！！");
        // 若已经有token则取出token放到header里实现资源访问
        config.headers.Authorization = "Bearer " + localStorage.getItem("access_token");
    }
    return config;
});

// 后置拦截
axios.interceptors.response.use(res => {
    return res;
}, err => {
    console.log(err);
    if (err.response.status === 401) { // 未登录
        // console.log("无妨");
        // console.log(TRouter.history.current.path);
        let currentPath = TRouter.history.current.path;

        store.commit("REMOVE_INFO"); // 清楚用户信息
        if (currentPath === "/login") { // 当前为登录页面时，提示的是用户名或密码错误
            Element.Message.error("用户名或密码错误", { duration: 3000 });
        } else {// 其他页面提示先进行登录
            Element.Message.warning("请先登录", { duration: 3000 });
            TRouter.push("/login");
        }
    } else {
        Element.Message.error(err.message, { duration: 3000 });
    }
})