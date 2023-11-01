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
      <TablePage :tableData="showTableR" :headers="headers" :btns="btns"></TablePage>
    </div>
  </div>
</template>

<script>
import { getRemoteList } from "@api/docchafang/docchafang.js";
export default {
  name: "yuanchengList",
  data() {
    return {
      showTable: [],
      formInline: [
        {
          label: "姓名",
          value: "patientName",
          type: "input",
        },
        {
          label: "住院号",
          value: "tohospitalID",
          type: "input",
        }
      ],
      headers: [
        { label: "住院号", value: "tohospitalID", sortable: true },
        { label: "姓名", value: "patientName" },
        { label: "主治医师", value: "DoctorName" },
        { label: "入院时间", value: "ToHospitalDateTime", sortable: true },
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
    patientDetails(row, index) {
      this.$router.push({
        path: "/yuancheng/yuanchengDetail",
        query: {
          pid: row.pid
        }
      });
    }
  },
  computed: {
    showTableR: function() {
      let result = [];
      result = this.showTable.map((item) => {
        item.API_date = this.$timeFormat(item.API_date).format("yyyy-MM-DD");
        item.API_enddate = this.$timeFormat(item.API_enddate).format("yyyy-MM-DD");
        return item;
      });
      return result;
    },
  },
  mounted() {
    this.$store.commit("startLoading");
    getRemoteList().then((res) => {
      this.$store.commit("endLoading");
      console.log(res);
      this.tableData = res;
    });
  },
};
</script>
