<template>
  <div class="mainContent">
    <el-collapse v-model="pages.collapse_activeNames">
      <!--基本信息-->
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="title">基本信息</h3>
        </template>
        <basic-personl-info :prsonalInfo="patientInfo.API_basicInfo" :is-show-vedio="true" :is-record-vedio="true"></basic-personl-info>
      </el-collapse-item>

      <!--视频查房-->
      <el-collapse-item name="2">
        <template slot="title">
          <h3 class="title">视频查房</h3>
        </template>
        <div class="shipin">
          <div style="margin-top: 20px">
            <div class="label">视频查房ID:</div>
            <span class="shipinText">0987897</span>
          </div>
          <div style="margin-top: 20px">
            <div class="label">视频查房密码:</div>
            <span class="shipinText">0987897</span>
          </div>
          <div style="margin-top: 20px">
            <div class="label">查房开始时间:</div>
            <span class="shipinText">2021-04-10 10:00:00</span>
          </div>
<!--          <div style="margin-top: 20px">-->
<!--            <div class="label">操作:</div>-->
<!--            <el-button type="success" size="small">参与查房</el-button>-->
<!--            <el-button type="danger" size="small">结束查房</el-button>-->
<!--          </div>-->
        </div>
      </el-collapse-item>

      <!--查房信息-->
      <el-collapse-item name="3">
        <template slot="title">
          <h3 class="title">查房信息</h3>
        </template>
        <div class="chafanglog">
          <div v-if="chafangInfos.length === 0" class="itemlog">暂无查房记录</div>
          <div v-for="item in chafangInfos" :key="item.chafangID" class="itemlog">
            {{item.date}}查房记录<el-link type="primary" class="link" @click="viewLog(item.chafangID)">查看</el-link>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!--查房记录表-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
    >
      <chafang-log :pid="pid" :pre-data="preData" :readonly="readonly" @closeDiag = "closeDiag"></chafang-log>
    </el-dialog>

    <!--参考 -->
    <Reference
      :pid="pid"
      :items="['就诊记录']"
      :readonly="true"
    ></Reference>
  </div>
</template>

<script>
import BasicPersonlInfo from "../components/BasicPersonlInfo";
import Reference from "../components/Reference";
import chafangLog from "../components/chafangLog";

import { getPatientsDetails } from "@api/docchafang/docchafang";
import { getChafangLogs, getDetailLog } from "@api/chafang/chafang";

export default {
  name: "appointmentDetail",
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
      view: true,
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
    this.$store.commit("startLoading");
    let flag = 0;
    getPatientsDetails(this.pid).then(res => {
      this.patientInfo.API_basicInfo = res;
      flag++;
      if (flag === 1) {
        this.$store.commit("endLoading");
      }
    });
    getChafangLogs(this.pid).then(res => {
      this.chafangInfos = res;
    });
  },
  methods: {
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
  .shipin{
    margin-left: 30px;
  }
  .shipinText{
    font-size: 16px;
  }
  .label {
    display: inline-block;
    width: 120px;
    font-size: 16px;
    color: #1c7e7c;
    text-align: justify;
  }
  .chafanglog{
    font-size: 18px;
    margin-left: 30px;
    .itemlog{
      margin-top: 5px;
    }
    .link{
      margin-left: 20px;
    }
  }
}
</style>
