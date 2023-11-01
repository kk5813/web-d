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

      <!--视频查房-->
      <el-collapse-item name="2">
        <template slot="title">
          <h3 class="title">视频查房</h3>
        </template>
        <div class="shipin">
          <span class="text">查房开始时间：</span>
          <el-time-picker
            v-model="reserveTime"
            placeholder="请选择时间"
            style="margin-left: 10px"
          >
          </el-time-picker>
          <div class="xuanze">
            <div class="text">请选择远程查房医生：</div>
            <div class="doctors">
              <el-checkbox-group v-model="choosedDoc" class="docXuanze">
                <el-row :gutter="5">
                  <el-col
                    v-for="nur in docList"
                    :key="nur.UserID"
                    :xs="8"
                    :sm="6"
                    :md="4"
                    :lg="4"
                  >
                    <div class="docCard">
                      <div class="pic">
                        <img :src="nur.Image" alt />
                      </div>
                      <div class="check">
                        <el-checkbox :label="nur">{{ nur.Name }}</el-checkbox>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </div>
            <div class="text">请选择远程查房护士：</div>
            <div class="doctors">
              <el-checkbox-group v-model="choosedNur" class="docXuanze">
                <el-row :gutter="5">
                  <el-col
                    v-for="nur in nurList"
                    :key="nur.UserID"
                    :xs="8"
                    :sm="6"
                    :md="4"
                    :lg="4"
                  >
                    <div class="docCard">
                      <div class="pic">
                        <img :src="nur.Image" alt />
                      </div>
                      <div class="check">
                        <el-checkbox :label="nur">{{ nur.Name }}</el-checkbox>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </div>
            <el-button type="danger" class="docReserve" @click="toReserve">发起预约</el-button>
          </div>
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
      reserveTime: "",
      choosedDoc: [],
      choosedNur: [],
      docList: [],
      nurList: [],
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
      this.patientInfo.API_basicInfo = res;
      flag++;
      if (flag === 1) {
        this.$store.commit("endLoading");
      }
    });
    getResponseDocList(this.pid).then(res => {
      this.nurList = res.hushiList;
      this.docList = res.doctor;
    });
    getChafangLogs(this.pid).then(res => {
      this.chafangInfos = res;
    });
  },
  methods: {
    toReserve() {
      let nurIds = [];
      this.choosedNur.forEach(item => {
        nurIds.push(item.UserID);
      });
      let docIds = [];
      this.choosedDoc.forEach(item => {
        docIds.push(item.UserID);
      });
      if (this.choosedDoc.length == 0 || this.choosedNur.length == 0 || this.reserveTime == "" || this.reserveTime == null) {
        this.$message.error("请选择预约时间或查房护士或查房医生");
      } else {
        let obj = {};
        obj.flag = 1;
        obj.SeekMedicalAdviceID = this.pid;
        obj.reserveTime = this.reserveTime;
        obj.nurIds = nurIds;
        obj.docIds = docIds;
        // console.log(obj);
        toReserve(obj).then(res => {
          if(res.status === 200){
            this.$message.success("发起预约成功");
            this.$router.push("/yuancheng");
          } else {
            this.$message.error("发起预约失败，请重新发起！");
          }
        })
      }
    },
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