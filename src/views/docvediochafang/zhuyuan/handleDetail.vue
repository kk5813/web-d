<template>
  <div class="mainContent">
    <el-collapse v-model="pages.collapse_activeNames">
      <!--基本信息-->
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="title">基本信息</h3>
        </template>
        <BasicPersonlInfo :prsonalInfo="patientInfo.API_basicInfo">
        </BasicPersonlInfo>
      </el-collapse-item>

      <!--    病情概况-->
      <el-collapse-item name="2">
        <template slot="title">
          <h3 class="title">病情概况</h3>
        </template>
        <div style="margin-left: 10px">
          <el-link @click="importDiagFlag.state = true" type="success"
                   style="float: right"
          >+导入病情概况</el-link
          >
          <br />
          <div style="width: 100%">
            <MyInput v-model="BingLi.state"></MyInput>
          </div>
        </div>
      </el-collapse-item>

<!--      患者病史-->
      <el-collapse-item name="3">
        <template slot="title">
          <h3 class="title">患者病史</h3>
        </template>

        <div style="margin-left: 10px">
          <el-link @click="importHis" type="success" style="float: right">+导入患者病史</el-link>
          <br />
          <div style="width: 100%">
            <div>
              <span class="sublabel"> 过敏史 </span>
              <div>
                <el-input v-model="BingLi.history.guoming" type="textarea"></el-input>
              </div>
            </div>
            <div>
              <span class="sublabel"> 家族史 </span>
              <div>
                <el-input v-model="BingLi.history.jiazu" type="textarea"></el-input>
              </div>
            </div>
            <div>
              <span class="sublabel"> 既往史 </span>
              <div>
                <el-input v-model="BingLi.history.jiwang" type="textarea"></el-input>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>

      <!--        诊断结论-->
      <el-collapse-item name="4">
        <template slot="title">
          <h3 class="title">诊断结论</h3>
        </template>

        <div style="margin-left: 10px">
          <el-link type="success" @click="importDiagFlag.result = true"
                   style="float: right"
          >+导入诊断结论</el-link
          >
          <br />
          <MyInput type="diag" v-model="BingLi.zhenduanjielun"></MyInput>
        </div>
      </el-collapse-item>
      <!--        治疗方案-->
      <el-collapse-item name="5">
        <template slot="title">
          <h3 class="title">治疗方案</h3>
        </template>

        <div>
          <el-link type="success" @click="importDiagFlag.treat = true"
                   style="float: right"
          >+导入治疗方案</el-link
          >
          <br />
          <div>
            <MyInput type="treat" v-model="BingLi.zhiliaofangan.text"></MyInput>
          </div>
          <div>
            <PrescriptionEdit v-model="BingLi.zhiliaofangan.chufang"></PrescriptionEdit>
          </div>
        </div>
      </el-collapse-item>

      <!--        后续住院-->
      <el-collapse-item name="6">
        <template slot="title">
          <h3 class="title">后续住院</h3>
        </template>
<!--        :preInfo="API_diagInfo.API_after"-->
        <After
          :medicalInfo="medicalInfo"
          :nurList="nurList"
          @after="afterInfo($event)"
          style="margin-left: 10px"
        ></After>

        <el-button @click="confirmSave" type="primary" class="btn">保存</el-button>
        <div style="clear: both; height: 0"></div>
      </el-collapse-item>

    </el-collapse>



<!--    病情概况-->
    <StateImport
      @import="(data) => (BingLi.state = data)"
      v-model="importDiagFlag.state"
    ></StateImport>
<!--    治疗方案-->
    <TreattextImport
      @import="(data) => (BingLi.zhiliaofangan.text = data)"
      v-model="importDiagFlag.treat"
    ></TreattextImport>
<!--    诊断结论-->
    <DiagResultImport
      @import="(data) => (BingLi.zhenduanjielun = data)"
      v-model="importDiagFlag.result"
    ></DiagResultImport>
  </div>
</template>

<script>
import BasicPersonlInfo from "@views/docvediochafang/zhuyuan/components/BasicPersonlInfo";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import After from "./components/After";


import { getPatientsDetails, getHospitalNurList, addPatientInfos } from "@api/docchafang/docchafang.js";
import { getMedicalInfo, savePatientDiagInfo } from "@api/patientdiag/patientdiag";

export default {
  name: "handleDetail",
  components: {
    BasicPersonlInfo,
    PrescriptionEdit,
    After
  },
  data() {
    return {
      pid: "",
      pages: {
        collapse_activeNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
      },
      patientInfo: {
        API_basicInfo: {}
      },
      importDiagFlag: {
        state: false,
        result: false,
        treat: false,
      },
      BingLi: {
        pid: "",
        state: [],
        history: {
          guoming: "",
          jiazu: "",
          jiwang: "",
        },
        zhenduanjielun: [],
        zhiliaofangan: {
          text: [],
          chufang: [],
        },
        API_after: []
      },
      medicalInfo: [],
      nurList: []
    };
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
    getMedicalInfo().then(res => {
      this.medicalInfo = res;
    });
    getHospitalNurList().then(res => {
      this.nurList = res;
    })
  },
  methods: {
    importHis() {
      this.BingLi.history = {
        guoming: "对海鲜过敏",
        jiazu: "无",
        jiwang: "无"
      };
      // this.$message.success("患者病史导入成功");
    },
    afterInfo(info) {
      this.BingLi.API_after = info;
    },
    diagCheck() {
      let flag = true;
      let errList = [];
      // 病情描述未完善
      if (this.BingLi.state.length == 0) {
        errList.push("病情概况");
        flag = false;
      }
      // 患者病史未完善
      if (this.BingLi.history.guoming == "" || this.BingLi.history.jiazu == "" || this.BingLi.history.jiwang == "") {
        errList.push("患者病史");
        flag = false;
      }
      // 诊断结论未填写
      if (this.BingLi.zhenduanjielun.length == 0) {
        errList.push("诊断结论");
        flag = false;
      }

      //治疗方案
      if(this.BingLi.zhiliaofangan.text.length == 0){
        errList.push("治疗方案");
        flag = false;
      }
      //后续住院
      if(this.BingLi.API_after.length == 0){
        errList.push("后续住院");
        flag = false;
      }
      if (!flag) this.$message.error("请完善以下部分：" + errList.join("、"));
      return flag;
    },
    confirmSave() {
      if (this.diagCheck()) {
        this.BingLi.pid = this.pid;
        console.log(this.BingLi);
        addPatientInfos(this.BingLi).then(res => {
          if(res === 200){
            this.$message.success("保存成功！");
            this.$router.push("/huanzhe");
          } else {
            this.$message.error("保存失败，请重试！")
          }
          console.log(res);
        });
        // this.$localforage.removeItem(window.location.href);
        // this.$router.push("/huanzhe");
      }
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

  .text {
    font-size: 16px;
    margin-left: 20px;
    margin-top: 5px;
  }

  .sublabel{
    font-size: 16px;
  }

  .btn {
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-right: 50px;
    width: 120px;
  }
}
</style>