// const host = "http://192.168.0.189:8904";
// const host = "http://47.92.201.124:8904"
// const host = "http://47.105.163.123:8904";
//pro
// const host = "http://admin.sviwo.com";
// const host = "http://admin.sviwo.ltd";
//dev-123
const host = "http://admin.sviwo.ltd";
// const host = "http://192.168.0.194:8904"
// const host = "http://47.92.27.44:8904"
// const host = "http://192.168.0.189:8904"
//图片前缀--打包到正式服时，切换到pro-sviwo-oss
const imgUrl='http://test-sviwo-oss.oss-cn-beijing.aliyuncs.com/'
// const imgUrl='http://pro-sviwo-oss.oss-cn-beijing.aliyuncs.com/'

module.exports= {
  imgOrigin: imgUrl,
  login: host + '/admin/login',
  // getCarInfo: host+'/admin/getCarInfo',
  logout:host + '/admin/logout',
  //获取验证码
  vercode: host + '/admin/sysUser/vercode',
  // maintenance: host+ '/admin/maintenance',
  // 11.22 司机信息查询接口
  //根据用户获取菜单
  getMenuByloginUser:host+'/admin/menu/getMenuByloginUser',
  //获取司机信息
  driverInfo: host + '/admin/driver/getDriver',
  //修改司机头像
  updateHeadPortrait:host + '/admin/driver/updateHeadPortrait',
  //修改司机信息/admin/driver/updateDriver
  updateDriver:host+'/admin/driver/updateDriver',
  // 导出司机信息
  exportDriverList: host + '/admin/driver/exportDriverList',
  // 乘客信息查询接口
  passengerInfo: host + '/admin/passenger/getPassenger',
  //根据乘客手机号获取乘客Id
  getPassengerIdByAppUserName:host+'/admin/passenger/getPassengerIdByAppUserName',
  // 冻结乘客接口
  frozenPassenger: host + '/admin/passenger/frozenPassenger',
  //封禁司机
  freezeDriver: host + '/admin/driver/freezeDriver',
  //解冻司机
  unFreezeDriver: host + '/admin/driver/unFreezeDriver',
  //获取司机二维码
  driverQRCode:host + '/admin/driver/driverQRCode',
  // 根据司机信息获得车辆信息
  getCar: host + '/admin/car/getCar',
  //获取待审核司机列表
  auditingDriverList: host + '/admin/driver/auditDriverList',
  // 审核通过
  auditingDriver: host + '/admin/driver/auditDriver',
  // 审核不通过
  auditDriverFail: host + '/admin/driver/auditDriverFail',
  //手动上传司机信息
  saveDriver: host + '/admin/driver/saveDriver',
  //头像图片上传地址接口
  uploadImage: host + '/admin/sys/uploadImage',
  //上传APK
  uploadFile: host + '/admin/sys/uploadFile',
  //获取优惠券列表
  getCouponTem: host + '/admin/coupon/getCouponTem',
  //获取运价列表
  getPriceList: host + '/admin/getPriceList',
  //添加或修改优惠券
  addOrUpdateCoupTem: host + '/admin/coupon/addOrUpdateCoupTem',
  //删除优惠券模板
  deleteCouponTem: host + '/admin/coupon/deleteCouponTem',
  //获取发放记录
  getCouponGrant: host + '/admin/coupon/getCouponGrant',
  //查看优惠券接收者
  queryRecipient: host + '/admin/coupon/queryRecipient',
  //发送优惠券
  couponGrant: host + '/admin/coupon/couponGrant',
  //撤回优惠券
  withdrawCoupon: host + '/admin/coupon/withdrawCoupon',
  //获取系统参数类型列表
  getDicType: host + '/admin/dic/getDicType',
  //修改或添加参数类型
  addOrUpdateDicType: host + '/admin/dic/addOrUpdateDicType',
  //获取参数明细列表
  getDicDetail: host + '/admin/dic/getDicDetail',
  //修改或添加参数明细
  addOrUpdateDicDetail: host + '/admin/dic/addOrUpdateDicDetail',
  //获取订单列表
  getOrder: host + '/admin/order/getOrder',
  // 导出订单数据
  exportOrder: host + '/admin/order/exportOrder',
  // 订单统计数据
  statisticalTitleData: host + '/admin/order/statisticalTitleData',
  //获取订单统计金额
  sumOrderPrice: host + '/admin/order/sumOrderPrice',
  //统计订单数量
  countOrderNumber: host + '/admin/order/countOrderNumber',
  //关闭订单
  updateOrder:host+'/admin/order/closeOrder',
  // 实付金额明细
  dctualAmountDetail: host + '/admin/order/dctualAmountDetail',
  // 司机收入明细
  driverIncomeDetail: host + '/admin/order/driverIncomeDetail',
  //获取角色列表
  getRole: host + '/admin/role/getRole',
  //获取权限列表
  getPermission: host + '/admin/permission/getPermission',
  //添加权限到角色
  saveRolePermission: host + '/admin/role/saveRolePermission',
  //根据角色Id获取已有权限
  findPermisIdByRoleId:host+'/admin/role/findPermisIdByRoleId',
  // 添加或者修改角色
  saveOrUpdateRole:host+'/admin/role/saveOrUpdateRole',
  //删除角色
  deleteRole:host+'/admin/role/deleteRole',
  //添加或修改权限
  saveOrUpdatePermis:host+'/admin/permission/saveOrUpdatePermis',
  //删除权限
  deletePermission:host+'/admin/permission/deletePermission',
  //获取菜单树
  getMenu:host + '/admin/menu/getMenuTree',
  //获取单个菜单
  oneMenuInfo:host+'/admin/menu/getMenu',
  //删除菜单
  removeMenu:host+'/admin/menu/delete',
  //添加或修改菜单
  saveOrUpdateMenu:host+'/admin/menu/saveOrUpdateMenu',
  //获取系统用户列表
  getUser: host + '/admin/sysUser/getUser',
  //添加或修改系统用户
  saveOrUpdate:host + '/admin/sysUser/saveOrUpdate',
  //删除系统用户
  deleteUser:host + '/admin/sysUser/delete',
  //系统用户名查重
  validateUsername:host + '/admin/sysUser/validateUsername',
  //根据用户ID获取角色
  findRoleIdBySysUserId:host + '/admin/sysUser/findRoleIdBySysUserId',
  //给用户添加角色
  giveUserRole:host + '/admin/sysUser/saveRolePermission',
  //司机版本记录
  queryDriverVersion:host+'/admin/appVersion/queryDriverVersion',
  // 乘客版本记录
  queryPassengerVersion: host + '/admin/appVersion/queryPassengerVersion',
  // 验证是否可添加新版本
  inspectVersionUpdateTime: host + '/admin/appVersion/inspectVersionUpdateTime',
  //添加或修改版本信息
  saveOrUpdateVersion:host + '/admin/appVersion/saveOrUpdate',
  //获取安卓渠道
  findChannel:host + '/admin/appVersion/findChannel',
  // 获取当前出行参数
  getAreaConfig:host + '/admin/areaParam/getAreaConfig',
  // 修改出行参数
  saveOrUpdateAreaParam:host + '/admin/areaParam/saveOrUpdateAreaParam',
  //获取用户反馈列表
  getFeedback:host+ '/admin/feedback/getFeedback',
  //处理反馈
  handingFeedback:host + '/admin/feedback/handingFeedback',
  //获取用户投诉
  queryComplaint:host + '/admin/complaint/queryComplaint',
  //处理投诉
  handleComplaint:host + '/admin/complaint/handleComplaint',
  //关联菜单与权限
  menuBindingPerm:host+ '/admin/permission/menuBindingPerm',
// 根据菜单id获取资源id
  findPermIdByMenuId:host+'/admin/permission/findPermIdByMenuId',
  //乘客报警列表
  getAlarm:host+'/admin/alarm/getAlarm',
//处理报警
  handingAlarm:host+'/admin/alarm/handingAlarm',
//提现记录列表
  withdrawRecord:host+'/admin/driver/withdrawRecord',
  //提现记录导出
  withdrawExcel: host + '/admin/driver/withdrawExcel',
  // 提现表头统计
  withdrawTitleData: host + '/admin/driver/withdrawTitleData',
  // 审核提现通过
  withdrawAuditAdopt: host + '/admin/driver/withdrawAuditAdopt',
  // 审核提现不通过
  withdrawAuditNotPass: host + '/admin/driver/withdrawAuditNotPass',
//获取提现详情
  withdrawDetail:host+'/admin/withdraw/withdrawDetail',
//审核提现
  withdrawAudit:host+'/admin/withdraw/withdrawAudit',
//司机确认打款成功
  confirmWithdrawSuccess:host+'/admin/withdraw/confirmWithdrawSuccess',
//设置司机收款码
  uploadPaymentCode:host+'/admin/driver/uploadPaymentCode',
  //获取平台流水
  queryPlatformAccFlow:host+'/admin/accountFlow/queryAccountFlow',
  // 平台流水统计
  accountFlowTitle: host + '/admin/accountFlow/accountFlowTitle',
  //导出平台流水
  exportPlatformAccFlow:host+'/admin/accountFlow/exportAccountFlow',
  //获取司机流水列表
  queryDrvAccFlow:host+'/admin/driver/queryDrvAccFlow',
  //导出司机流水
  exportDrvAccFlow: host + '/admin/driver/exportDrvAccFlow',
  //获取乘客流水列表
  queryPsgAccFlow:host+'/admin/passenger/queryPsgAccFlow',
  //导出乘客流水
  exportPsgAccFlow:host+'/admin/passenger/exportPsgAccFlow',
  //导出司机接单信息
  driverExcel: host+'/admin/driver/driverExcel',
  //司机接单信息
  driverOperate: host + '/admin/driver/driverOperate',
  //司机运营数据统计
  driverOperateTotal:host+'/admin/driver/driverOperateTotal',
  //调查问卷列表
  queryQuestionnaire:host+'/admin/questionnaire/queryQuestionnaire',
  //添加问卷调查
  saveQuestion:host+'/admin/questionnaire/save',
  //获取ROI列表
  getRoi:host+'/admin/order/getRoi',
  //获取ROI统计数据
  getTotalRoi:host+'/admin/order/getTotalRoi',
  //导出ROI
  exportRoiList:host+'/admin/order/exportRoiList',
  //获取补贴列表
  getSubsidy:host+'/admin/order/getSubsidy',
  //获取补贴总额
  getTotalSubsidy:host+'/admin/order/getTotalSubsidy',
  //导出补贴列表
  exportSubsidyList:host+'/admin/order/exportSubsidyList',
  // v1.2.0
  // 添加修改区域
  saveOrUpdateArea: host + '/admin/area/saveOrUpdate',
  // 获取区域列表
  getArea: host + '/admin/area/getArea',
  // 冻结区域
  freezeArea: host + '/admin/area/freezeArea',
  // 开放区域
  unFreezeArea: host + '/admin/area/unFreezeArea',
}
