<template>
  <div class="mainContent">
    <el-collapse v-model="pages.collapse_activeNames">
      <!--基本信息-->
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="title">基本信息</h3>
        </template>
        <basic-personl-info :prsonalInfo="patientInfo.API_basicInfo" :is-show-vedio="true">
        </basic-personl-info>
      </el-collapse-item>
      <!--查房信息-->
      <el-collapse-item name="3">
        <template slot="title">
          <h3 class="title">查房信息</h3>
        </template>
        <div class="chafanglog">
            <div v-for="item in chafangInfos" :key="item.chafangID" class="itemlog">
              {{item.date}}查房记录<el-link type="primary" class="link" @click="viewLog(item.chafangID)">查看</el-link>
            </div>
        </div>
      </el-collapse-item>
      <!--病历信息-->
      <Reference
        :pid="pid"
        :items="['就诊记录']"
        :readonly="true"
      ></Reference>

      <!--查房记录表-->
      <el-dialog
        :visible.sync="dialogVisible"
        width="60%"
      >
        <chafang-log :pid="pid" :pre-data="preData" :readonly="readonly" @closeDiag = "closeDiag"></chafang-log>
      </el-dialog>
    </el-collapse>
  </div>
</template>

<script>
import chafangLog from "@views/chafang/components/chafangLog";
import BasicPersonlInfo from "../components/BasicPersonlInfo";
import Reference from "../components/Reference";


import { getPatientsDetails } from "@api/docchafang/docchafang";
import { getChafangLogs, getDetailLog } from "@api/chafang/chafang.js";

export default {
  name: "chafangDetail",
  components: {
    BasicPersonlInfo,
    Reference,
    chafangLog
  },
  data() {
    return {
      pid: "",
      pages: {
        collapse_activeNames: ["1", "2", "3"]
      },
      patientInfo: {
        API_basicInfo: {}
      },
      chafangInfos: [],
      dialogVisible: false,
      preData: {},
      readonly: true
    };
  },
  created() {
    this.pid = this.$route.query.pid + "";
  },
  mounted() {
    let pid = this.pid;
    this.$store.commit("startLoading");
    let flag = 0;
    getPatientsDetails(pid).then((res) => {
      this.patientInfo.API_basicInfo = res;
      flag++;
      if (flag === 1) {
        this.$store.commit("endLoading");
      }
    });
    getChafangLogs(this.pid).then(res => {
      // console.log(res);
      this.chafangInfos = res;
    });
  },
  methods:{
    closeDiag() {
      this.dialogVisible = false;
      this.preData = {};
    },
    viewLog(id) {
      this.dialogVisible = true;
      getDetailLog(id).then((res) => {
        this.preData = res;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.mainContent {
  width: 95%;
  height: 100%;
  margin: 20px auto;

  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .text{
    font-size: 16px;
    margin-left: 20px;
    margin-top: 5px;
  }
  .chafanglog{
    font-size: 18px;
    margin-left: 40px;
    .itemlog{
      margin-top: 5px;
    }
    //padding-top: 10px;
    //margin-top: 20px;
    .link{
      margin-left: 20px;
    }
  }
}
</style>