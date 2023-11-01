<template>
  <div class="global-container mt20">
    <div class="mt20">
      <SearchTool
        :tableData="tableData"
        :rules="formInline"
        v-model="showTable"
        title="患者查询"
      >
        <el-button @click="addZhuyuanPatient" type="success" size="small"
        >添加患者</el-button
        >
      </SearchTool>
    </div>
    <div class="mt20">
      <TablePage
        :tableData="showTable"
        :headers="headers"
        :btns="btns"
      ></TablePage>
    </div>
    <el-dialog title="新增患者" :visible.sync="addDialogVisible" width="500px">
      <div class="addBox">
        <el-form
          :model="newPatient"
          :show-message="false"
          :rules="rules"
          ref="form"
          label-width="80px"
          size="small"
        >
          <el-form-item prop="name" label="患者姓名">
            <el-input v-model="newPatient.name"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="患者性别">
            <el-radio-group v-model="newPatient.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="IdCard" label="身份证号">
<!--            @blur="searchPatient"-->
            <el-input
              v-model="newPatient.IdCard"
              placeholder="请输入身份证号码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="birthday" label="出生日期">
            <el-date-picker
              value-format="timestamp"
              v-model="newPatient.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="tel" label="联系方式">
            <el-input v-model="newPatient.tel"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="家庭住址">
            <el-input v-model="newPatient.address" placeholder="默认为无"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addPatient">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { zhuyuanPatientList, addNewPatient } from "@api/docchafang/docchafang.js";

export default {
  // sockets: {
  //   confirm_tohospital() {
  //     zhuyuanPatientList().then((res) => {
  //       this.tableData = res;
  //     });
  //   },
  // },
  data() {
    return {
      showTable: [],
      formInline: [
        {
          label: "姓名",
          value: "PatientName",
          type: "input",
        },
        {
          label: "住院号",
          value: "ToHospitalID",
          type: "input",
        }
        // {
        //   label: "今日治疗状态",
        //   value: "API_state",
        //   type: "selection",
        // },
      ],
      addDialogVisible: false,
      newPatient: {
        name: "",
        gender: "",
        birthday: "",
        tel: "",
        IdCard: "",
        address: ""
      },
      rules: {
        name: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
        gender: [{ required: true, trigger: "blur" }],
        IdCard: [{ required: true, trigger: "blur" }],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "blur"
            // trigger: "change"
          }
        ],
        tel: [{ required: true, trigger: "blur" }]
      },
      headers: [
        { label: "住院号", value: "ToHospitalID", sortable: true },
        { label: "姓名", value: "PatientName" },
        // { label: "诊断专家", value: "API_expert" },
        { label: "入院时间", value: "ToHospitalDateTime", sortable: true },
        { label: "处理状态", value: "flag", sortable: true },
      ],
      btns: [
        {
          label: "查看",
          func: this.patientDetails,
        },
      ],

      tableData: []
    };
  },
  methods: {
    patientDetails(row) {
      console.log(row);
      if( row.flag === "未处理") {
        this.$router.push({
          path: "/zhuyuan/handleDetail",
          query: { pid: row.pid },
        });
      } else {
        this.$router.push({
          path: "/zhuyuan/patientDetail",
          query: { pid: row.pid },
        });
      }
    },
    addZhuyuanPatient() {
      this.newPatient = {};
      this.addDialogVisible = true;
    },
    addPatient() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addNewPatient(this.newPatient).then(res => {
            if (res === 200) {
              this.$message.success("添加成功");
              this.addDialogVisible = false;
              zhuyuanPatientList().then(res => {
                this.tableData = res;
              });
            } else {
              this.$message.error("添加失败");
            }
          })
        }
      });
    }
  },

  created() {
    this.$store.commit("startLoading");
    zhuyuanPatientList().then((res) => {
      this.tableData = res;
      // console.log(res);
      this.$store.commit("endLoading");
    });
  },
};
</script>

<style scoped lang="scss">
.eltable {
  width: 90%;
  margin: 10px 5%;
}

.filter {
  margin: 20px 0px 0px 5%;
}
.page {
  float: right;
  margin: 10px 5% 10px 0px;
}
.formLabel {
  font-size: 16px;
  // font-weight: bold;
  color: #1c7e7c;
  margin-left: 5px;
}
.btn {
  background-color: #1c7e7c;
  margin-left: 30px;
}
</style>
<style>
.el-table .highlight {
  background: oldlace;
}
</style>
<style lang="scss">
.searchRule {
  .el-input__inner {
    border: 0px;
    color: #1c7e7c;
    font-size: 16px;
  }
  :hover {
    background-color: #eff3f4;
  }
}
</style>
