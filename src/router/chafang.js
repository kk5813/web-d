const chafangManage = {
  path: '/todayRounds',
  name: "今日查房",
  // redirect: '/chafang/todayRounds',
  meta: { navName: "查房管理" },
  component: () => import('@views/chafang/Layout.vue'),
  children: [
    {
      path: '/todayRounds',
      name: '今日查房',
      meta: { activeRoute: "/todayRounds", navName: "今日查房" },
      component: () => import('@views/chafang/todayRounds/todayRounds.vue'),
    },
    {
      path: "/todayRounds/chafangDetail",
      name: "患者详情",
      meta: { activeRoute: "/todayRounds", navName: "患者详情" },
      component: () => import('@views/chafang/todayRounds/chafangDetail.vue'),
    },
    {
      path: '/historyRounds',
      name: '历史查房',
      meta: { activeRoute: "/historyRounds", navName: "历史查房" },
      component: () => import('@views/chafang/historyRounds/historyRounds.vue'),
    },
    {
      path: "/historyRounds/chafangDetail",
      name: "患者详情",
      meta: { activeRoute: "/historyRounds", navName: "患者详情" },
      component: () => import('@views/chafang/historyRounds/chafangDetail.vue'),
    },
    {
      path: '/appointment',
      name: '查房预约',
      meta: { activeRoute: "/appointment", navName: "查房预约" },
      component: () => import('@views/chafang/appointment/appointment.vue'),
    },
    {
      path: "/appointment/appointmentDetail",
      name: "患者详情",
      meta: { activeRoute: "/appointment", navName: "患者详情" },
      component: () => import('@views/chafang/appointment/appointmentDetail.vue'),
    },
    {
      path: '/zyhsHistory',
      name: '历史患者',
      meta: { activeRoute: "/zyhsHistory", navName: "历史患者" },
      component: () => import('@views/chafang/historyChafang/historyChafang.vue'),
    },
    {
      path: "/zyhsHistory/historyChafangDetail",
      name: "患者详情",
      meta: { activeRoute: "/zyhsHistory", navName: "患者详情" },
      component: () => import('@views/chafang/historyChafang/historyChafangDetail.vue'),
    }
  ]
};

export default chafangManage     //导出
