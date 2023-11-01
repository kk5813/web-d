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
      <!--视频查房-->
<!--      <el-collapse-item name="2">-->
<!--        <template slot="title">-->
<!--          <h3 class="title">视频查房</h3>-->
<!--        </template>-->
<!--        <div class="shipin">-->
<!--          <span class="text">查房开始时间：</span>-->
<!--          <el-time-picker-->
<!--            v-model="reserveTime"-->
<!--            placeholder="请选择时间"-->
<!--            style="margin-left: 10px"-->
<!--          >-->
<!--          </el-time-picker>-->
<!--          <div class="xuanze">-->
<!--            <div class="text">请选择远程查房医生：</div>-->
<!--            <div class="doctors">-->
<!--              <el-checkbox-group v-model="choosedDoc" class="docXuanze">-->
<!--                <el-row :gutter="5">-->
<!--                  <el-col-->
<!--                    v-for="doc in docList"-->
<!--                    :key="doc.UserID"-->
<!--                    :xs="8"-->
<!--                    :sm="6"-->
<!--                    :md="4"-->
<!--                    :lg="4"-->
<!--                  >-->
<!--                    <div class="docCard">-->
<!--                      <div class="pic">-->
<!--                        <img :src="doc.Image" alt />-->
<!--                      </div>-->
<!--                      <div class="check">-->
<!--                        <el-checkbox :label="doc">{{ doc.Name }}</el-checkbox>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </el-checkbox-group>-->
<!--              <el-button type="danger" class="docReserve" @click="toReserve">发起预约</el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-collapse-item>-->
      <!--查房信息-->
      <el-collapse-item name="3">
        <template slot="title">
          <h3 class="title">查房信息</h3>
        </template>
        <div class="chafanglog">
          <el-button type="primary" size="small" class="newLog" @click="newChafangLog">新增查房记录</el-button>
          <div v-if="chafangInfos.length === 0" class="itemlog">暂无查房记录</div>
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
        width="50%"
      >
        <chafang-log :pid="pid" :pre-data="preData" :readonly="readonly" @closeDiag = "closeDiag"></chafang-log>
      </el-dialog>
    </el-collapse>
  </div>
</template>

<script>
import BasicPersonlInfo from "../components/BasicPersonlInfo";
import Reference from "../components/Reference";
import chafangLog from "@views/chafang/components/chafangLog";

import { getPatientsDetails } from "@api/docchafang/docchafang";
import { getResponseDocList, getChafangLogs, getDetailLog, toReserve } from "@api/chafang/chafang.js";

export default {
  name: "chafangDetail",
  data() {
    return {
      pid: "",
      pages: {
        collapse_activeNames: ["1", "2", "3"],
      },
      patientInfo: {
        API_basicInfo: {},
      },
      vedioBtns: ["查看视频", "录制视频"],
      reserveTime: "",
      choosedDoc: [],
      nextChafangTime: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '三天后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      dialogVisible: false,
      docList: [],
      chafangInfos: [],
      detailLog: {},
      readonly: false,
      preData: {}
    };
  },
  components: {
    BasicPersonlInfo,
    Reference,
    chafangLog
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
      if (flag === 2) {
        this.$store.commit("endLoading");
      }
    });
    getResponseDocList(pid).then((res) => {
      flag++;
      this.docList = res.docterList;
      if (flag === 2) {
        this.$store.commit("endLoading");
      }
    });
    this.getChafangInfos();
  },
  methods: {
    getChafangInfos() {
      getChafangLogs(this.pid).then(res => {
        // console.log(res);
        this.chafangInfos = res;
      });
    },
    toReserve() {
      let docIds = [];
      this.choosedDoc.forEach(item => {
        docIds.push(item.UserID);
      });
      if(this.choosedDoc.length == 0 || this.reserveTime == "" || this.reserveTime == null) {
        this.$message.error("请选择预约时间或查房医生");
      }else{
        let obj = {};
        obj.SeekMedicalAdviceID = this.pid;
        obj.reserveTime = this.reserveTime;
        obj.docIds = docIds;
        toReserve(obj).then(res => {
          if(res.status === 200){
            this.$message.success("发起预约成功");
          } else {
            this.$message.error("发起预约失败，请重新发起！");
          }
        })
      }
    },
    newChafangLog() {
      this.dialogVisible = true;
      this.readonly = false;
      this.preData = {};
    },
    closeDiag() {
      this.getChafangInfos();
      this.dialogVisible = false;
      this.preData = {};
      this.readonly = false;
    },
    viewLog(id) {
      this.dialogVisible = true;
      getDetailLog(id).then((res) => {
        this.readonly = true;
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
  .shipin{
    //display: flex;
    margin-top: 5px;
    .xuanze{
      margin-top: 10px;
    }
  }
  .chafanglog{
    font-size: 16px;
    margin-left: 40px;
    .newLog{
      margin-bottom: 10px;
    }
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