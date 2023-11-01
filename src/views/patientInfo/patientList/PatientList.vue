<template>
  <div class="global-container mt20">
    <div>
      <SearchTool
        :rules="searchRule1"
        v-model="filtertableData"
        @search="SearchChange"
        :reset="resetFlag"
        title="患者查询"
      >
<!--        <el-button slot="sBtn" @click="filterFlag = true;"  size="small"-->
<!--        >条件筛选</el-button>-->
        <el-button slot="sBtn"
                   size="small"
                   :class="selectType==1?'selected':'unselected'"
                   style="margin-left: 10px; "
                   @click="typeChange(1)">已就诊</el-button>
        <el-button slot="sBtn" size="small" :class="selectType!=1?'selected':'unselected'"  @click="typeChange(2)">已添加</el-button>
      </SearchTool>


    </div>
    <div class="mt20">
      <el-table
        :data="
         tableData
        "
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        :cell-style="{ 'text-align': 'center' }"
        :header-cell-style="{
          background: '#EFF3F4',
          color: '#1c7e7c',
          'text-align': 'center',
          'font-size': '16px',
        }"
      >
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.PatientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号">
          <template slot-scope="scope">
            <span>{{ scope.row.PatientID }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{ scope.row.Gender || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <span>{{ scope.row.Age || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式">
          <template slot-scope="scope">
            <span>{{ scope.row.Phone || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="家庭住址">
          <template slot-scope="scope">
            <span>{{ scope.row.Address || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="初诊">
          <template slot-scope="scope">
            <span>{{ scope.row.NewDiagnosis || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构">
          <template slot-scope="scope">
            <span>{{ scope.row.HospitalName || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="patientDetails(scope.$index, scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
        ></el-pagination>
      </div>
    </div>
    <!--   条件筛选对话框-->
    <el-dialog title="筛选患者" :visible.sync="filterFlag"  >
      <div >
        <el-form
            :model="filterForm"
            label-position="right"
            :show-message="false"
            ref="filterForm"
            label-width="100px"
            size="small"
            class="add-form"
        >
          <el-form-item prop="name" label="姓氏" >
            <el-select
                style="height:30px;width: 200px"
                size="small"
                placeholder="默认为无"
                clearable
                v-model="filterForm.surName"
            >
              <el-option
                  v-for="(item, index) in surnameOptions"
                  :key="index"
                  :label="item"
                  :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gender" label="性别" >
            <el-radio-group v-model="filterForm.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
            <el-button type="primary" plain size="mini" style="margin-left: 30px"
                       @click="filterForm.gender=''"
            > 取消选择</el-button>
          </el-form-item>
          <el-form-item prop="IdCard" label="年龄段" >
            <el-select
                style="height:30px; width:200px;margin-right: 20px"
                size="small"
                placeholder="最小年龄"
                clearable
                v-model="filterForm.minAge"
            >
              <el-option
                  v-for="(item, index) in 100"
                  :key="index"
                  :label="item"
                  :value="item"
              >
              </el-option>
            </el-select>
            <el-select
                style="height:30px; width:200px"
                size="small"
                placeholder="最大年龄"
                clearable
                v-model="filterForm.maxAge"
            >
              <el-option
                  v-for="(item, index) in 100"
                  :key="index"
                  :label="item"
                  :value="item"
                  v-if="item >= filterForm.minAge"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="age" label="地址" >
            <el-input v-model="filterForm.Address" placeholder="无" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item prop="tel" label="初诊症状">
            <el-input v-model="filterForm.NewDiagnosis" placeholder="无" style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="filterTable">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增患者" :visible.sync="addDialogVisible" width="500px">
      <div class="addBox">
        <el-form
          :model="newPatient"
          :show-message="false"
          :rules="rules"
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
          <el-form-item prop="birthday" label="出生日期">
            <el-date-picker
              value-format="timestamp"
              v-model="newPatient.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="tel" label="联系方式">
            <el-input
              v-model="newPatient.tel"
              placeholder="默认为无"
            ></el-input>
          </el-form-item>
          <el-form-item prop="address" label="家庭住址">
            <el-input
              v-model="newPatient.address"
              placeholder="默认为无"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addPatient"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPatientList,
  addNewPatient,
  getPatientListSum, getMyPatientList
} from "@api/patientInfo/patientinfo.js";
import SearchTool  from "@views/patientInfo/newPatient/components/SearchTool";
export default {
  data() {
    return {
      filterFlag:false,//条件筛选对话框弹出
      resetFlag:false,
      filterForm:{  //条件筛选具体内容
        surName:null ,  //姓氏
        gender:null,//性别
        Phone:null,//联系方式
        minAge: null ,//最小年龄
        maxAge:null,//最大年龄
        Address:null ,//住址
        NewDiagnosis:null, //初诊
        name:null,//姓名,
        PatientName:null,
        organization:null,//机构id

      },
      searchRule1: [
        {
          label: "姓名",
          value: "PatientName",
          type: "input",
        },
        {
          label: "姓氏",
          value: "surName",
          secondValue:'PatientName',
          type: "selection",
          currentValue:''
        },
        {
          label: "联系方式",
          value: "Phone",
          type: "input",
          currentValue:''
        },
        {
          label: "性别",
          value: "Gender",
          type: "selection",
          currentValue:''
        },
        // {
        //   label: "年龄段",
        //   value: "ageLimit",
        //   secondValue:'Age',
        //   type: "selection",
        //   currentValue:''
        // },
        {
          label: "家庭住址",
          value: "Address",
          type: "input",
          currentValue:''
        },
        {
          label: "初诊症状",
          value: "NewDiagnosis",
          type: "input",
          currentValue:''
        },
        // {
        //   label: "所属机构",
        //   value: "HospitalName",
        //   type: "selection",
        //   currentValue:''
        // },

      ],
      searchRule: {
        rule: "name",
        value: "",
      },
      shpwTest: [],
      formInline: {
        name: "",
        account: "",
        gender: "",
      },
      tableData: [],
      filtertableData:[],
      currentPage: this.$store.state.patientList.patientList.currentPage,
      pageSize: this.$store.state.patientList.patientList.pageSize,
      addDialogVisible: false,
      newPatient: {
        name: "",
        gender: "",
        birthday: "",
        tel: "",
        address: "",
      },
      rules: {
        name: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
        gender: [{ required: true }],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
      newBingliVisible: false,
      selectType:1,
      totalSize:0
    };
  },
  components:{
    SearchTool
  },
  computed:{
    //姓氏筛选
    surnameOptions(){
      let arr = [];
      let temp = JSON.parse(JSON.stringify(this.tableData));
      console.log("姓氏")
      //姓氏的筛选
      temp.forEach((item) => {
        if (
            item.PatientName &&
            arr.indexOf(item.PatientName[0]) == -1
        ) {
          arr.push(item.PatientName[0] + "");
        }
      });
      // console.log(arr)
      return arr;
    },
  },
  methods: {
    SearchChange(rule,data){
      console.log("查询返回",rule,data)
      // let arr={  //条件筛选具体内容
      //   surName:null ,  //姓氏
      //   gender:null,//性别
      //   minAge: null ,//最小年龄
      //   maxAge:null,//最大年龄
      //   Address:null ,//住址
      //   NewDiagnosis:null, //初诊
      //   PatientName:null,
      //   name:null,//姓名
      //   organization:null,//机构id
      //
      // }
      this.filterForm[rule.value]=data
      this.getList(this.filterForm)
    },

    getList(searchData){
      console.log("查询数据searchdata",searchData.Phone)
      let data={
        type:this.selectType,
        surName:searchData.surName,  //姓氏
        gender:searchData.gender,//性别
        minyear: searchData.minyear ,//最小年龄
        maxyear:searchData.maxyear,//最大年龄
        Address:searchData.Address ,//住址
        NewDiagnosis:searchData.NewDiagnosis ,//初诊,
        name:searchData.PatientName,  //姓名
        organization:searchData.organization,
        iphone:searchData.Phone==undefined?null:searchData.Phone
      }
      getPatientListSum(data).then(res=>{
        console.log("我的患者总数",res[0]['count(*)'])
        this.totalSize=res[0]['count(*)']
        getMyPatientList(this.currentPage,this.pageSize,data).then(res=>{
          console.log("我的患者列表",res)
          this.tableData=res
        })
      })
    },
    //根据条件查询数据
    filterTable(){
      console.log("条件筛选",this.filterForm)
      if (this.filterForm.maxAge<this.filterForm.minAge){
        this.$message.error("最大年龄不能小于最小年龄")
        return
      }
      //姓氏赋值
      this.searchRule1[1].currentValue=this.filterForm.surName
      this.searchRule1[2].currentValue=this.filterForm.gender//性别
      //住址
      this.searchRule1[3].currentValue=this.filterForm.Address
      //初诊
      this.searchRule1[4].currentValue=this.filterForm.NewDiagnosis
      //年龄段
      let arr = [];
      let temp = JSON.parse(JSON.stringify(this.tableData));
      arr=temp.filter(item=>{
        //姓氏筛选
        // console.log(item.PatientName[0])
        //姓氏的筛选
        if((item.PatientName[0]+"").includes(this.filterForm.surName) &&
            (item.Address+"").includes(this.filterForm.Address)    &&
            (item.Gender+"").includes(this.filterForm.gender)    &&
            (item.NewDiagnosis+"").includes(this.filterForm.NewDiagnosis)
        ){
          if (this.filterForm.maxAge==null){
              if (item.Age>=this.filterForm.minAge){
                return true
              }else {
                return false
              }
          }else{
            if (item.Age>=this.filterForm.minAge && item.Age<=this.filterForm.maxAge){
              return true
            }else {
              return false
            }
          }

          // }

        }else{
          // console.log("不成立，",item.PatientName)
          return false
        }
      })
      console.log('筛选结果',arr)
      this.filtertableData=arr
      this.filterFlag=false
      // this.shpwTest=arr
      // console.log(this.searchRule1)
      this.filterFlag=false

    },
    bingliVisibeChange(type) {
      this.newBingliVisible = type;
    },
    reSet() {
      (this.formInline.name = ""),
        (this.formInline.account = ""),
        (this.formInline.gender = ""),
        (this.formInline.age = "");
    },
    patientDetails(index, row) {
      this.$store.commit(
        "patientInfo/currentPatientAccountChange",
        row.PatientID
      );
      this.$store.commit(
        "patientInfo/currentPatientNameChange",
        row.PatientName
      );
      this.$router.push("/patientinfo/patientdetails");
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$store.commit('patientList/pageSizeChange',val)
      this.getList(this.filterForm)

    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$store.commit('patientList/currentPageChange',val)
      this.getList(this.filterForm)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.gender == "未处理" || row.age == "是") {
        return "highlight";
      } else {
        return "";
      }
    },
    searchRuleChange() {
      this.searchRule.value = "";
      this.reSet();
    },
    addPatient() {
      this.addDialogVisible = false;
      addNewPatient(this.newPatient).then((res) => {
        if (res) {
          this.$message.success("添加成功");
          getPatientList().then((res) => {
            this.tableData = res;
            this.filtertableData=res
          });
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    //查询类型改变
    typeChange(val){
      this.selectType=val
      this.filterForm={  //条件筛选具体内容
        surName:null ,  //姓氏
        gender:null,//性别
        minAge: null ,//最小年龄
        maxAge:null,//最大年龄
        Address:null ,//住址
        NewDiagnosis:null, //初诊
        PatientName:null,
        name:null,//姓名
        organization:null,//机构id
      }
      this.currentPage=1
      this.pageSize=10
      this.resetFlag=!this.resetFlag
      this.getList(this.filterForm)
    },
  },

  //
  mounted() {
    this.getList(this.filterForm)
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
// .addPatient {
//   width: 50px;
//   height: 50px;
//   float: left;
//   background-color: red;
// }
.selected{
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.unselected{
  color: #606266;
  background: transparent;
  border-color: #DCDFE6;
}
</style>


<style lang="scss">
.el-table .highlight {
  background: oldlace;
}
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
