<template>
  <div class="newLog">
    <div class="header clearfix">
      <el-link type="primary" @click="importHistory" class="import">
        导入历史方案</el-link
      >
    </div>

    <div style="margin:20px 0px">
      <span style="float:left;font-size:16px;color:#1c7e7c">治疗时间:</span>
      <el-date-picker
        v-model="newTreatmentLog.time"
        size="small"
        value-format="timestamp"
        style="float:left;margin-left:20px;vertical-align-center"
      ></el-date-picker>
      <div style="clear:both;height=0"></div>
    </div>
    <span class="label">患者状况：</span>

<!--    <div class="box" @click="inputBoxShow('state')">-->
    <div class="box" >
      <el-input  v-model="stateData"  type="textarea" ></el-input>
    </div>
    <span class="label">治疗建议：</span>
<!--    <div class="box" @click="inputBoxShow('treatment')">-->
    <div class="box">
      <el-input  v-model="treateData"  type="textarea" ></el-input>
    </div>
    <div>
      <prescription-edit
        :prescription=" newTreatmentLog.API_prescription"
        @input="prescription($event)"
      ></prescription-edit>
    </div>
    <div class="footer clearfix">
      <el-button
        style="float:right;width:100px"
        size="small"
        type="primary"
        @click="saveNewLog"
        >保存</el-button
      >
    </div>
    <el-dialog
      title="历史治疗方案"
      :visible.sync="importDialogFlag"
      width="800px"
    >
      <el-table
        ref="historyTreatment"
        :data="historyLogs.slice(0, 5)"
        style="width: 100%"
        max-height="500px"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <PrescriptionEdit
              :readonly="true"
              :prescription="scope.row.API_prescription"
            ></PrescriptionEdit>
          </template>
        </el-table-column>
        <el-table-column label="患者状况">
          <template slot-scope="scope">
            <span>{{ scope.row.API_patientState.join("，") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="治疗建议">
          <template slot-scope="scope">
            <span>{{ scope.row.API_description.join("，") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处方">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" width="100" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="confirmImporrt(scope.row)"
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import SpecialInput from "@components/common/SpecialInput.vue";
import PrescriptionEdit from "@components/common/PrescriptionEdit.vue";
import Prescription from "@components/common/Prescription.vue";
import { getHistoryTreatLog } from "@api/patienttreatment/patienttreatment.js";

export default {
  name: "NewTreatmentLog",
  props: {
    newLog: {
      type: Object,
      default: () => {
        return {
          API_patientState: [],
          API_treatment: [],
          API_prescription: []
        };
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          type: "newLog"
        };
      }
    }
  },
  data() {
    return {
      importDialogFlag: false,
      historyLogs: [],
      dialogVisible: false,
      newTreatmentLog: {
        time: "",
        API_treatment: [],
        API_prescription: [],
        API_patientState:[],
        API_prescriptionFlag: true
      },
      stateData:'',
      treateData:''
    };
  },
  components: {
    SpecialInput,
    PrescriptionEdit
  },
  methods: {
    saveNewLog() {
      console.log(this.newTreatmentLog)
      this.newTreatmentLog.API_patientState=this.stateData.replace(",", "，").split(',')
      this.newTreatmentLog.API_treatment=this.treateData.replace(",", "，").split(',')
      console.log(this.newTreatmentLog)
      this.$emit("save", this.newTreatmentLog);
    },
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmImporrt(data) {
      this.importDialogFlag = false;
      let opt=this.stateData.replace(",", "，").split(',')
      this.newTreatmentLog.API_patientState=[...opt,...data.API_patientState]
      this.stateData=this.newTreatmentLog.API_patientState.join(',').replace(/^(\s|,)+|(\s|,)+$/g,'');
       opt=this.treateData.replace(",", "，").split(',')
      this.newTreatmentLog.API_treatment=[...opt,...data.API_description]
      this.treateData=this.newTreatmentLog.API_treatment.join(',').replace(/^(\s|,)+|(\s|,)+$/g,'');

      this.newTreatmentLog.API_prescription=[...this.newTreatmentLog.API_prescription,...data.API_prescription]
      this.newLog.API_prescription= this.newTreatmentLog.API_prescription
      // console.log(data)
      // console.log( this.newTreatmentLog)
      this.$emit("import", this.newTreatmentLog);
    },
    importHistory() {
      getHistoryTreatLog().then(res => {
        this.importDialogFlag = true;
        this.historyLogs = res;
      });
    },
    inputBoxShow(type) {
      this.$emit("inputBox", type);
    },
    prescription(data) {
      this.newTreatmentLog.API_prescription = data;
      this.$emit("prescription", this.newTreatmentLog.API_prescription);
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
.newLog {
  .header {
    .import {
      float: right;
    }
  }
  .label {
    font-size: 16px;
    color: #1c7e7c;
  }
  .box {
    width: 100%;
    min-height: 60px;
    margin-top: 5px;
    //border: 1px solid #e4e7ed;
    p {
      margin-top: 5px;
      font-size: 16px;
      text-indent: 20px;
    }
  }
}
</style>
