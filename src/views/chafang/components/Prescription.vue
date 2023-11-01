<template>
  <div>
    <el-table
      v-if="prescription.length > 0"
      size="mini"
      :data="prescription"
      style="width: 100%"
    >
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.DrugsName || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产厂家">
        <template slot-scope="scope">
          <span>{{ scope.row.DrugsManufacturer || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格">
        <template slot-scope="scope">
          <!-- <span>{{ "0.1g" }}</span> -->
          <span>{{ scope.row.DosageOfDrugsUnits || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.DrugsNumber || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.DosageOfDrugsUnits || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次用量">
        <template slot-scope="scope">
          <span>{{ scope.row.DrugsUsage || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频率">
        <template slot-scope="scope">
          <span>{{ scope.row.UseFrequency || "无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间">
        <template slot-scope="scope">
          <span>{{ scope.row.UseTime || "无" }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 处方、表格展示表格组件
export default {
  name: "CheckBox",
  props: {
    prescription: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>