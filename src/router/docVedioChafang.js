const vedioChafang = {
  path: '/yuyue',
  name: "视频查房",
  // redirect: '/chafang/todayRounds',
  meta: { navName: "视频查房" },
  component: () => import('@views/docvediochafang/Layout.vue'),
  children: [
    {
      path: '/yuyue',
      name: '查房预约',
      meta: { activeRoute: "/yuyue", navName: "查房预约" },
      component: () => import('@views/docvediochafang/yuyue/yuyue.vue'),
    },
    {
      path: "/yuyue/yuyueDetail",
      name: "患者详情",
      meta: { activeRoute: "/yuyue", navName: "患者详情" },
      component: () => import('@views/docvediochafang/yuyue/yueyueDetail.vue'),
    },
    {
      path: '/huanzhe',
      name: '住院患者',
      meta: { activeRoute: "/huanzhe", navName: "住院患者" },
      component: () => import('@views/docvediochafang/zhuyuan/zhuyuan.vue'),
    },
    {
      path: "/zhuyuan/patientDetail",
      name: "患者详情",
      meta: { activeRoute: "/huanzhe", navName: "患者详情" },
      component: () => import('@views/docvediochafang/zhuyuan/patientDetail.vue'),
    },
    {
      path: "/zhuyuan/handleDetail",
      name: "患者处理",
      meta: { activeRoute: "/huanzhe", navName: "患者详情" },
      component: () => import('@views/docvediochafang/zhuyuan/handleDetail.vue'),
    },
    {
      path: '/shenqing',
      name: '住院申请',
      meta: { activeRoute: "/shenqing", navName: "住院申请" },
      component: () => import('@views/docvediochafang/shenqing/shenqing.vue'),
    },
    {
      path: "/shenqing/patientShenqing",
      name: "患者详情",
      meta: { activeRoute: "/shenqing", navName: "患者详情" },
      component: () => import('@views/docvediochafang/shenqing/patientShenqing.vue'),
    },
    {
      path: '/history',
      name: '历史患者',
      meta: { activeRoute: "/history", navName: "历史患者" },
      component: () => import('@views/docvediochafang/history/history.vue'),
    },
    {
      path: "/history/patientDetail",
      name: "患者详情",
      meta: { activeRoute: "/history", navName: "患者详情" },
      component: () => import('@views/docvediochafang/history/patientDetail.vue'),
    },
    {
      path: '/yuancheng',
      name: '远程患者',
      meta: { activeRoute: "/yuancheng", navName: "远程患者" },
      component: () => import('@views/docvediochafang/yuancheng/yuanchengList.vue'),
    },
    {
      path: '/yuancheng/yuanchengDetail',
      name: '远程患者',
      meta: { activeRoute: "/yuancheng", navName: "患者详情" },
      component: () => import('@views/docvediochafang/yuancheng/yuanchengDetail.vue'),
    },
    {
      path: '/chafangApply',
      name: '查房申请',
      meta: { activeRoute: "/chafangApply", navName: "查房申请" },
      component: () => import('@views/docvediochafang/chafangapply/chafangApply.vue'),
    },
    {
      path: '/chafangApply/chafangApplyDetail',
      name: '查房申请',
      meta: { activeRoute: "/chafangApply", navName: "患者详情" },
      component: () => import('@views/docvediochafang/chafangapply/chafangApplyDetail.vue'),
    }
  ]
}

export default vedioChafang     //导出