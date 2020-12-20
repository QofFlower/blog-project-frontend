import router from './router';
import Element from 'element-ui'

// 路由前置拦截
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限

        const token = localStorage.getItem("access_token")
        // console.log("------------" + token)

        if (!token) { // 判断当前的token是否存在 ； 登录存入的token
            Element.Message.warning("请先登录", { duration: 3000 });
            next({
                path: '/login'
            })
        } else {
            next(); // 有token放行
        }
    } else {
        next();
    }
})