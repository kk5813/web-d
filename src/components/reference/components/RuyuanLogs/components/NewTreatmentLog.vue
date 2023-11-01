<template>
  <div class="newLog">
    <div class="header clearfix">
      <el-link
        v-if="!readonly"
        type="primary"
        @click="importHistory"
        class="import"
      >
        导入历史方案</el-link
      >
    </div>
    <span class="label">患者状况：</span>

<!--    <div class="box" @click="inputBoxShow('state')">-->
    <div class="box" v-if="!readonly">
      <el-input  v-model="stateData"  type="textarea" ></el-input>
    </div>
    <div class="box" v-else style="border: 1px solid #e4e7ed;">
      <p>
        {{
          (newLog.API_patientState && newLog.API_patientState.join("，")) ||
          "暂无"
        }}
      </p>
    </div>
    <span class="label">治疗建议：</span>
<!--    <div class="box" @click="inputBoxShow('treatment')">-->
    <div class="box"  v-if="!readonly">
      <el-input  v-model="treatData" type="textarea"></el-input>
    </div>
    <div class="box"  v-else style="border: 1px solid #e4e7ed;">
      <p>
        {{
          (newLog.API_treatment && newLog.API_treatment.join("，")) || "暂无"
        }}
      </p>
    </div>
    <div>
      <prescription-edit
        :readonly="readonly"
        :prescription="newLog.API_prescription"
        @input="prescription($event)"
      ></prescription-edit>
    </div>
    <div class="footer clearfix">
      <el-button
        v-if="!readonly"
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
    },
    readonly: Boolean
  },
  data() {
    return {
      importDialogFlag: false,
      historyLogs: [],
      dialogVisible: false,
      newTreatmentLog: {
        API_treatment: [],
        API_prescription: [],
        API_prescriptionFlag: true
      },
      stateData:'',
      treatData:''
    };
  },
  watch: {
    treatData: {
      handler(val) {
        // console.log("改变")
        this.treatData = this.treatData.replace(",", "，")
        let atr = this.treatData.split('，')
        this.newLog.API_treatment = atr
        // this.$emit("input",atr)
        // console.log("atr",atr)
        // console.log("atr",this.newLog.API_treatment)
        this.$emit('stateChange',this.newLog.API_treatment)

      },
    },
    stateData: {
      handler(val) {
        // console.log("改变")
        this.stateData = this.stateData.replace(",", "，")
        let atr = this.stateData.split('，')
        this.newLog.API_patientState = atr
        // this.$emit("input",atr)
        // console.log("atr",atr)
        // console.log("atr",this.newLog.API_patientState)
        this.$emit('stateChange',this.newLog.API_patientState)

      },
    },
  },
  components: {
    SpecialInput,
    PrescriptionEdit
    // Prescription
  },
  methods: {
    saveNewLog() {
      // console.log("保存===========",this.newTreatmentLog)
      this.$emit("save", this.newTreatmentLog);
    },
    toogleExpand(row) {
      let $table = this.$refs.historyTreatment;
      $table.toggleRowExpansion(row);
    },
    confirmImporrt(data) {
      this.importDialogFlag = false;
      console.log("导入",data)
      //患者症状
      console.log(this.stateData)
      this.stateData = this.stateData.replace(",", "，")
      let atr = this.stateData.split('，')
      let opt1=[]
      opt1=[...atr,...data.API_patientState]
      this.newLog.API_patientState=opt1
      console.log('opt1',opt1)
      this.stateData=opt1.join(',').replace(/^(\s|,)+|(\s|,)+$/g,'');
      //治疗建议
      console.log(this.treatData)
      this.treatData = this.treatData.replace(",", "，")
      atr = this.treatData.split('，')
      let opt2=[]
      opt2=[...atr,...data.API_description]
      this.newLog.API_treatment=opt2
      console.log(opt2)
      this.treatData=opt2.join(',').replace(/^(\s|,)+|(\s|,)+$/g,'');
      console.log('opt2',opt2)
      //药品
      console.log(this.newLog)
       this.newLog.API_prescription=[...this.newTreatmentLog.API_prescription,...data.API_prescription]
      this.newTreatmentLog.API_prescription=this.newLog.API_prescription
       this.$emit("import", this.newLog);
    },
    importHistory() {
      getHistoryTreatLog().then(res => {
        console.log(res);
        this.importDialogFlag = true;
        this.historyLogs = res;
      });
    },
    inputBoxShow(type) {
      if (!this.readonly) {
        this.$emit("inputBox", type);
      }
    },
    prescription(data) {
      // console.log('添加药品',data)
      this.newTreatmentLog.API_prescription = data;
      this.$emit("prescription", this.newTreatmentLog.API_prescription);
    }
  },
  mounted() {
    console.log("=================",this.newLog)
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
