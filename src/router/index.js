import Vue from 'vue'
import VueRouter from 'vue-router'
import {auth} from '@/lib/auth'

import NotFound from '@/pages/404.vue'
import forbidden from '@/pages/403.vue'
import redirect from '@/pages/302.vue'
import Login from '@/pages/login.vue'
//司机信息管理
import DriverInfo from '@/pages/driver/driver.vue'
// 乘客信息管理
import Passenger from '@/pages/passenger/passenger.vue'
//司机接单信息
import DriverOperate from '@/pages/driverOperate/driverOperate.vue'
// 待审核列表
import Audit from '@/pages/audit/audit.vue'
// 手动添加修改司机
import AppendDriver from '@/pages/appendDriver/appendDriver.vue'
//设置优惠券
import SetCoupons from '@/pages/coupons/setCoupons.vue'
//优惠券列表
import CouponsList from '@/pages/coupons/CouponsList.vue'
// 发送优惠券
import SendCoupons from '@/pages/coupons/sendCoupons.vue'
//发送记录
import CouponsGrant from '@/pages/coupons/couponGrant.vue'

//@系统参数-参数配置
import sysOption from '@/pages/sysSetting/sysOption.vue'
//添加或修改系统参数明细
import addSysDetail from '@/pages/sysSetting/addSysDetail.vue'
//订单列表
import orderList from '@/pages/order/orderList.vue'
//角色权限管理
import sysRole from '@/pages/sysManager/role/role.vue'
//菜单管理
import menuManager from '@/pages/sysManager/menuManager/menuManager.vue'
//系统用户管理
import sysUserList from '@/pages/sysManager/sysUserManager/sysUserList.vue'
//版本更新
import version from '@/pages/version/version.vue'
//反馈
import complaints from '@/pages/complaints/complaints.vue'
//投诉
import complaint2 from '@/pages/complain2/complain2.vue'
//一键报警
import callPolice from '@/pages/callPolice/callPolice.vue'
//提现管理
import withdrawal from '@/pages/withdrawal/withdrawal.vue'
//司机流水管理
import capital from '@/pages/capital/capital.vue'
// 司机流水列表
import capitalList from '@/pages/capital/capitalList.vue'
//平台流水管理
import platformCapital from '@/pages/capital/platformCapital.vue'
//乘客流水管理
import pasCapital from '@/pages/capital/pasCapital.vue'
//获取调查问卷列表
import questionNaire from '@/pages/questionNaire/questionNaire.vue'
//ROI
import ROI from '@/pages/ROI/roi.vue'
//补贴列表
import subsidy from '@/pages/subsidy/subsidy.vue'
// 出行参数
import tripSetting from '@/pages/tripSetting/tripSetting.vue'

import Api from '@/config/api'

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {keepAlive: false,layout:false},
    },
    // 司机信息
    {
        path: '/driverInfo',
        name: 'driverInfo',
        component: DriverInfo,
        alias:['/'],
        meta: {keepAlive: false,layout: true},
        beforeEnter:auth
    },
    //司机接单信息
    {
      path: '/driverOperate',
      name: 'driverOperate',
      component: DriverOperate,
      meta: {keepAlive: false,layout: true},
      beforeEnter: auth
    },
    //乘客信息
    {
        path: '/passenger',
        name: 'passenger',
        component: Passenger,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    // @审核功能
    //  待审核列表audit
    {
        path: '/audit',
        name: 'audit',
        component: Audit,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    //添加司机
    {
        path: '/appendDriver',
        name: 'appendDriver',
        component: AppendDriver,
        meta: {keepAlive: true, layout: true},
        beforeEnter: auth
    },
    // 设置优惠券
    // {
    //     path: '/setCoupons',
    //     name: 'setCoupons',
    //     component: SetCoupons,
    //     meta: {keepAlive: false, layout: true},
    //     beforeEnter: auth
    // },
    //优惠券列表
    {
        path: '/couponsList',
        name: 'couponsList',
        component: CouponsList,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    //发放记录
    {
        path: '/couponsGrant',
        name: 'couponsGrant',
        component: CouponsGrant,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    //发送券
    {
        path: '/sendCoupons',
        name: 'sendCoupons',
        component: SendCoupons,
        meta: {keepAlive: true, layout: true},
        beforeEnter: auth
    },
    //新配置系统参数
    {
        path: '/sysOption',
        name: 'sysOption',
        component: sysOption,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth,
    },
    //添加修改系统参数明细
    {
        path:'/addSysDetail',
        name:'addSysDetail',
        component: addSysDetail,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth,
    },
    // 订单列表
    {
        path: '/orderList',
        name: 'orderList',
        component: orderList,
        meta: {keepAlive: true, layout: true},
        beforeEnter: auth
    },
    //@系统管理-角色权限管理
    {
        path: '/sysRole',
        name: 'sysRole',
        component: sysRole,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    //@系统管理-菜单管理
    {
        path: '/menuManager',
        name: 'menuManager',
        component: menuManager,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    //@系统管理-系统用户u哥那里
    {
        path: '/sysUser',
        name: 'sysUser',
        component: sysUserList,
        meta: {keepAlive: false, layout: true},
        beforeEnter: auth
    },
    //@乘客版本更新
    {
        path: '/pasversion',
        name: 'pasversion',
        component: version,
        meta: {keepAlive: true,layout: true},
        beforeEnter:auth
    },
    //@司机版本更新
    {
      path: '/driversion',
      name: 'driversion',
      component: version,
      meta: {keepAlive: true,layout: true},
      beforeEnter:auth
    },
    //@用户投诉
    {
      path: '/complaints',
      name: 'complaints',
      component: complaints,
      meta: {keepAlive: true,layout: true},
      beforeEnter:auth
    },
    {
      path: '/complaint2',
      name: 'complaint2',
      component: complaint2,
      meta: {keepAlive: true,layout: true},
      beforeEnter: auth
    },
    //@一键报警
    {
      path: '/callPolice',
      name: 'callPolice',
      component: callPolice,
      meta: {keepAlive: true,layout: true},
      beforeEnter:auth
    },
    //@-提现管理
    {
      path: '/withdrawal',
      name: 'withdrawal',
      component: withdrawal,
      meta: {keepAlive: true,layout: true},
      beforeEnter:auth
    },
    //司机流水管理
    {
      path:'/capital',
      name:'capital',
      component:capital,
      meta:{keepAlive:true,layout:true},
      beforeEnter:auth
    },
    //平台流水管理
    {
      path:'/platformCapital',
      name:'platformCapital',
      component:platformCapital,
      meta:{keepAlive:true,layout:true},
      beforeEnter:auth
    },
    // 司机流水列表
    {
      path: '/capitalList',
      name: 'capitalList',
      component: capitalList,
      meta: {keepAlive: false, layout: true, breadHide: true},
      beforeEnter: auth
    },
    //乘客流水管理
    {
      path:'/pasCapital',
      name:'pasCapital',
      component:pasCapital,
      meta:{keepAlive:true,layout:true},
      beforeEnter:auth
    },
    //问卷调查列表questionNaire
    {
      path:'/questionNaire',
      name:'questionNaire',
      component:questionNaire,
      meta:{keepAlive:true,layout:true},
      beforeEnter:auth
    },
    //补贴列表
    {
      path:'/subsidy',
      name:'subsidy',
      component:subsidy,
      meta:{keepAlive:false,layout:true},
      beforeEnter:auth
    },
    //ROI
    {
      path:'/roi',
      name:'roi',
      component:ROI,
      meta:{keepAlive:false,layout:true},
      beforeEnter:auth
    },
    { // 出行参数配置
      path:'/tripSetting',
      name:'tripSetting',
      component:tripSetting,
      meta:{keepAlive:false,layout:true},
      beforeEnter:auth
    },
    {
        path: '/404',
        name: '404',
        component: NotFound,
        meta:{keepAlive: true,layout:false},
    },
    {
      path: '/403',
      name: '403',
      component: forbidden,
      meta:{keepAlive: true,layout:false},
    },
    {
      path: '/302',
      name: '302',
      component: redirect,
      meta:{keepAlive: true,layout:false},
    },
    {
        path: '*',
        redirect: {name: '404'}
    }
];


const router = new VueRouter({
    routes,
    mode: 'hash'
});

export default router
