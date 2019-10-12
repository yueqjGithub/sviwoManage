import Vue from 'vue'
import App from '@/components/app.vue'
import router from '@/router'
import store from '@/store'
import '@/events'
// import Promise from 'promise'
// antd
import { Upload,Avatar,Icon,Drawer,Popconfirm } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
//elementui
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//mixin
import myMixin from '@/api/myMixin.js'
import '@/lib/plugs'
import $ from 'jquery'
axios.defaults.withCredentials = true
import axios from 'axios'
Vue.prototype.$axios= axios
// 封装axios post 请求
Vue.use(Upload)
Vue.use(Avatar)
Vue.use(Icon)
Vue.use(Drawer)
Vue.use(Popconfirm)
Vue.use(Element)

window.Promise = Promise;
//翻页组件混入，@-全局页码集 pageBean，关键属性allPage
Vue.mixin(myMixin)

const app = new Vue({
    el:'#app',
    components:{App},
    template:'<App/>',
    router,
    store,
    data:function () {
        return {
            message:'Hello world'
        }
    }
});

router.beforeEach(function (to, from, next) {
    let url  =to.fullPath;
    return next();
});

export default app




