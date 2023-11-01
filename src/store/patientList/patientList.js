export default {
  namespaced: true,
  state: {
    addPatientList:{
      currentPage:1,
      pageSize:10,
      filterForm:{  //条件筛选具体内容
        surName:null ,  //姓氏
        gender:null,//性别
        minAge: null ,//最小年龄
        maxAge:null,//最大年龄
        Address:null ,//住址
        NewDiagnosis:null, //初诊
        name:'',//姓名
        organization:null,//机构id
      },

    },
    patientList:{
      currentPage:1,
      pageSize:10,
    }
  },
  getters: {
    currentPage: (state) => {
      return state.addPatientList.currentPage;
    }
  },
  mutations: {
    addcurrentPageChange(state, page) {
      state.addPatientList.currentPage = page
    },
    addpageSizeChange(state, pagesize) {
      state.addPatientList.pageSize=pagesize
    },
    currentPageChange(state, page) {
      state.patientList.currentPage = page
    },
    pageSizeChange(state, pagesize) {
      state.patientList.pageSize=pagesize
    },
    filterFormChange(state, form) {
      state.addPatientList.filterForm = form
    }
  },
  actions: {

  },
  modules: {}
};
