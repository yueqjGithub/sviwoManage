
const modules = [
    {
        name: '用户管理',
        //有子栏目的，父栏目无专属组件，需要跳转到子路由对应组件的，将link设置为要跳转到的子路由的link属性
        link:  'driverInfo',
        enable: true,
        child: [
            {
                name:'司机信息',
                link:'driverInfo',
                enable:true
            },
            {
                name:'乘客信息',
                link:'passenger',
                enable:true
            }
        ]
    },
    // 审核
    {
        name: '审核管理',
        //有子栏目的，父栏目无专属组件，需要跳转到子路由对应组件的，将link设置为要跳转到的子路由的link属性
        link:  'audit',
        enable: true,
        child: [
            {
                name:'待审核司机',
                link:'audit',
                enable:true
            },
            {
                name:'添加司机',
                link:'appendDriver',
                enable:true
            }
        ]
    },
    //优惠券管理
    {
        name: '优惠券管理',
        //有子栏目的，父栏目无专属组件，需要跳转到子路由对应组件的，将link设置为要跳转到的子路由的link属性
        link:  'setCoupons',
        enable: true,
        child: [
            {
                name:'优惠券列表',
                link:'couponsList',
                enable:true
            },
            {
                name:'添加优惠券',
                link:'setCoupons',
                enable:true
            },
            {
                name:'发放记录',
                link:'couponsGrant',
                enable:true
            }
        ]
    },

    {
        name:'系统参数',
        link: 'sysOption',
        enable:true,
        child:[
            {
                name:'参数配置',
                link:'sysOption',
                enable:true
            }
        ]
    },
    //订单管理
    {
        name:'订单管理',
        link: 'orderList',
        enable:true,
        child:[
            {
                name:'订单列表',
                link:'orderList',
                enable:true
            }
        ]
    },
    {
        name:'系统管理',
        link: 'sysRole',
        enable:true,
        child:[
            {
                name:'角色权限管理',
                link:'sysRole',
                enable:true
            },
            {
                name: '菜单管理',
                link:  'menuManager',
                enable: true
            },
            {
                name:'系统用户管理',
                link:'sysUser',
                enable:true
            }
        ]
    },
    {
        name:'版本更新',
        link:'version',
        enable:true,
        child:[
            {
                name:'版本记录',
                link:'version',
                enable:true
            }
        ]
    },
    {
      name:'报警投诉',
      link:'complaints',
      enable:true,
      child:[
        {
          name:'用户投诉',
          link:'complaints',
          enable:true
        }
      ]
    },
];

export default modules
