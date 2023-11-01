<template>
  <div class="mainContent">
    <el-collapse v-model="pages.collapse_activeNames">
      <!--基本信息-->
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="title">基本信息</h3>
        </template>
        <BasicPersonlInfo :prsonalInfo="patientInfo.API_basicInfo" :is-show-vedio="true">
        </BasicPersonlInfo>
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

      <!--查房记录表-->
      <el-dialog
        :visible.sync="dialogVisible"
        width="60%"
      >
        <chafang-log :pid="pid" :pre-data="preData" :readonly="readonly" @closeDiag = "closeDiag"></chafang-log>
      </el-dialog>

    </el-collapse>

    <!-- 参考 -->
        <Reference
          :pid="pid"
          :items="['就诊记录']"
          :readonly="true"
        ></Reference>
  </div>
</template>

<script>
import BasicPersonlInfo from "@views/docvediochafang/zhuyuan/components/BasicPersonlInfo";
import Reference from "../components/Reference.vue";
import chafangLog from "../components/chafangLog";

import { getPatientsDetails} from "@api/docchafang/docchafang.js";
import { getChafangLogs, getDetailLog, getResponseDocList, toReserve } from "@api/chafang/chafang";

export default {
  name: "yuanchengDetail",
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
  components: {
    BasicPersonlInfo,
    Reference,
    chafangLog
  },
  created() {
    this.pid = this.$route.query.pid;
  },
  mounted() {
    this.$store.commit("startLoading");
    let flag = 0;
    getPatientsDetails(this.pid).then((res) => {
      console.log(this.pid);
      console.log(res);
      this.patientInfo.API_basicInfo = res;
      flag++;
      if (flag === 1) {
        this.$store.commit("endLoading");
      }
    });
    getResponseDocList(this.pid).then(res => {
      this.nurList = res.hushiList;
      this.docList = res.ycDocterList;
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
  .doctors {
    //display: flex;
    //justify-content: space-between;
    .docCard {
      width: 100%;
      height: 180px;
      display: flex;
      flex-direction: column;
      .pic {
        margin: auto;
        img {
          width: 100px;
          height: 100px;
        }
      }
      .check {
        margin: auto;
      }
    }
  }
  .docReserve{
    margin-top: 20px;
    margin-left: 40px;
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