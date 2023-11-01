<template>
  <div class="global-container mt20">
    <div class="mt20">
      <SearchTool
        :tableData="tableData"
        :rules="formInline"
        v-model="showTable"
        title="患者查询"
      >
      </SearchTool>
    </div>
    <div class="mt20">
      <TablePage :tableData="showTable" :headers="headers" :btns="btns"></TablePage>
    </div>
  </div>
</template>

<script>
import {getChafangApplyList, confirmYuanchengChafang} from '@api/docchafang/docchafang'

export default {
  name: "chafangApply",
  data() {
    return {
      showTable: [],
      formInline: [
        {
          label: "姓名",
          value: "API_name",
          type: "input"
        },
        {
          label: "住院号",
          value: "API_toHospitalID",
          type: "input"
        }
      ],
      headers: [
        { label: "住院号", value: "API_toHospitalID" },
        { label: "姓名", value: "API_name" },
        { label: "主治医师", value: "API_expert" },
        { label: "查房开始时间", value: "reserveTime" }
      ],
      btns: [
        {
          label: "同意",
          func: this.confirmApply
        },
        {
          label: "查看",
          func: this.patientDetails
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.$store.commit("startLoading");
    getChafangApplyList().then(res => {
      this.tableData = res;
      this.$store.commit("endLoading");
    });
  },
  methods: {
    patientDetails(row) {
      this.$router.push({
        path: "/chafangApply/chafangApplyDetail",
        query: { pid: row.API_pid }
      });
    },
    confirmApply(row) {
      confirmYuanchengChafang(row.API_pid).then(res => {
        console.log(res);
        if(res.data.status === 200){
          this.$message.success("已同意该申请！");
          getChafangApplyList().then(() => {
            getChafangApplyList().then(res => {
              this.tableData = res;
            });
          });
        }
      })
    }
  }
};
</script>

<style scoped>

</style>