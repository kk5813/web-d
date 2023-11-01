<template>
  <div class="mainContent">
    <el-collapse v-model="pages.collapse_activeNames">
      <!--基本信息-->
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="title">基本信息</h3>
        </template>
        <PersonalInfo :prsonalInfo="patientInfo.API_basicInfo"></PersonalInfo>
      </el-collapse-item>
      <!--分配护士-->
      <el-collapse-item name="2">
        <template slot="title">
          <h3 class="title">住院信息</h3>
        </template>
        <div class="nurses">
          <div class="xuanze">
            <div class="text">请选择查房护士：</div>
            <div class="nurses">
              <el-checkbox-group v-model="choosedNur" class="nurXuanze">
           <el-row :gutter="5">
             <el-col
               v-for="nur in nurList"
               :key="nur.UserID"
               :xs="8"
               :sm="6"
               :md="4"
               :lg="4"
             >
               <div class="nurCard">
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
              <el-button type="danger" class="toZhuyuan" @click="toZhuyuan">确认</el-button>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!--参考 -->
    <Reference
      :pid="pid"
      :items="['就诊记录', '入院记录']"
      :readonly="true"
    >
    </Reference>
  </div>
</template>

<script>
import PersonalInfo from "../components/PersonalInfo";
import Reference from "@components/reference/Reference.vue";
import { getPatientsDetails } from "@api/operationmanage/operationmanage";
import { getHospitalNurList, zhuyuanNur } from "@api/docchafang/docchafang"

export default {
  name: "patientShenqing",
  components: {
    PersonalInfo,
    Reference
  },
  data() {
    return {
      pid: "",
      pages: {
        collapse_activeNames: ["1", "2", "3"]
      },
      patientInfo: {
        API_basicInfo: {}
      },
      nurList: [],
      choosedNur: []
    }
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
    getHospitalNurList().then(res => {
      // console.log(res);
      this.nurList = res;
    });
  },
  methods: {
    toZhuyuan() {
      if (this.choosedNur.length === 0) {
        this.$message.error("请选择负责该患者的查房护士！");
      } else {
        let obj = {};
        obj.nurId = [];
        this.choosedNur.forEach(item => {
          obj.nurId.push(item.UserID)
        });
        obj.pid = this.pid;
        console.log(obj);
        zhuyuanNur(obj).then(res => {
          console.log(res);
          if (res.status === 200) {
            this.$router.push("/shenqing");
            this.$message.success("已成功分配查房护士")
          } else {
            this.$message.error("请求失败，请重试！");
          }
        })
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
  .nurses {
    //display: flex;
    //justify-content: space-between;
    .nurCard {
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

  .toZhuyuan{
    margin-top: 20px;
    margin-left: 40px;
  }
}
</style>