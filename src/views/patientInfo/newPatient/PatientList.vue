<template>
  <div class="global-container mt20">
    <div style="display: flex;align-items: center">
    </div>
    <div class="g-c-search" >
      <SearchTool
        @search="SearchChange"
        @ruleChange="ruleChange"
        :rules="searchRule1"
        v-model="showTable"
        title="患者查询"
      >
        <el-button slot="sBtn" @click="handlefilter"  size="small" style="margin-left:20px"
        >条件筛选</el-button>
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <el-button @click="addDialogVisible = true;isErrorFlag=false;" type="success" size="small"
          >添加患者</el-button>
          <el-button v-if="isZhuanJia===true"
                     type="primary"
                     size="small"
                     @click="exportToExcel2"
                     :loading="exportFlag"
          > {{exportFlag?'正在导出':'导出数据'}} </el-button>
          <div style="width: 150px;margin-left: 10px" v-if="exportFlag">
            <el-progress :text-inside="false" :stroke-width="8" :percentage="export_precent" color="#909399" text-color="#C0C4CC"></el-progress>
          </div>

        </div>
      </SearchTool>


    </div>

    <div class="mt20">
      <el-table
        :data="tableData"
        style="width: 100%"
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
        <el-table-column label="更新">
          <template slot-scope="scope">
            <span>{{ scope.row.ModifyTime || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构">
          <template slot-scope="scope">
            <span>{{ scope.row.HospitalName || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="导入者">
          <template slot-scope="scope">
            <span>{{ scope.row.Name || "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button @click="patientDetails(scope.$index, scope.row)" size="mini"
              >查看</el-button
            >
            <el-button @click="editPatient(scope.$index, scope.row)" size="mini"
            >编辑</el-button
            >
            <el-button v-if="isManaeger " @click="delPatient(scope.$index, scope.row)" size="mini"
            >删除</el-button
            >
          </template>

        </el-table-column>
      </el-table>
<!--      此表格一直隐藏，只是方便导出-->
      <el-table v-show="false"
          :data="exportData"
          style="width: 100%"
          id="patientList"
          border
          :cell-style="{ 'text-align': 'center' }"
          :header-cell-style="{
          background: '#EFF3F4',
          color: '#1c7e7c',
          'text-align': 'center',
          'font-size': '16px',
        }"
      >
        <el-table-column
            v-for="(item, index) in headers"
            :key="index"
            :prop="item.value"
            :label="item.label"
            :width="item.width ? item.width : ''"
            :sortable="item.sortable ? 'custom' : false"
        >
          <template slot-scope="scope">
            <span >{{
                scope.row[item.value] || "无"
              }}</span>
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
            <el-input v-model="filterForm.surName" placeholder="请输入姓氏" style="width: 200px"></el-input>
<!--            <el-select-->
<!--                style="height:30px;width: 200px"-->
<!--                size="small"-->
<!--                placeholder="默认为无"-->
<!--                clearable-->
<!--                v-model="filterForm.surName"-->
<!--            >-->
<!--              <el-option-->
<!--                  v-for="(item, index) in surnameOptions"-->
<!--                  :key="index"-->
<!--                  :label="item"-->
<!--                  :value="item"-->
<!--              >-->
<!--              </el-option>-->
<!--            </el-select>-->
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
          <el-form-item prop="Date" label="录入时间段">
            <el-date-picker
                v-model="searchDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="age" label="地址" >
            <el-input v-model="filterForm.Address" placeholder="请输入地址" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item prop="tel" label="初诊症状">
            <el-input v-model="filterForm.NewDiagnosis" placeholder="请输入初诊症状" style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="filterTable">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增患者" :visible.sync="addDialogVisible" width="500px" @close="dialogClose()">
      <div class="addBox">
<!--        <div v-if="possiblePatients.length > 0" class="similarBox">-->
<!--          <div><span class="secondLabel">发现相似患者</span></div>-->
<!--          <SimilarInfo-->
<!--            class="mt5"-->
<!--            v-for="patient in possiblePatients"-->
<!--            @select="possiblePatientSelect(patient)"-->
<!--            :key="patient.id"-->
<!--            :patient="patient"-->
<!--          ></SimilarInfo>-->
<!--        </div>-->
        <el-form
          :model="newPatient"
          :show-message="false"
          :rules="rules"
          ref="newPatientForm"
          label-width="100px"
          size="small"
          class="add-form"
        >
          <el-form-item prop="name" label="患者姓名">
            <el-input @blur="searchPatient" v-model="newPatient.name"></el-input>
<!--            <span>hhh</span>-->
          </el-form-item>
          <el-form-item prop="gender" label="患者性别" >
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
              autocomplete="off"
              onkeyup="this.value=this.value.replace(/[^\X0-9]/g, '')"
              @blur="validateId(1)"
            ></el-input>
            <div style="color: #F56C6C;  font-size: 12px; line-height: 1; padding-top: 4px; position: absolute; top: 100%; left: 0;" v-if="isErrorFlag">请输入合法的身份证号</div>
          </el-form-item>
          <el-form-item prop="age" label="患者年龄">
<!--            <el-date-picker-->
<!--              value-format="yyyy-MM-dd"-->
<!--              format="yyyy 年 MM 月 dd 日"-->
<!--              v-model="newPatient.birthday"-->
<!--              style="width: 100%"-->
<!--            ></el-date-picker>-->
            <el-input v-model="newPatient.age" placeholder="无"></el-input>
          </el-form-item>
          <el-form-item prop="tel" label="联系方式">
            <el-input v-model="newPatient.tel" placeholder="无"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="家庭住址">
            <el-input v-model="newPatient.address" placeholder="无"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="初诊内容">
            <el-input v-model="newPatient.NewDiagnosis" placeholder="无"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addPatient">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑患者信息" :visible.sync="editDialogVisible" width="500px">
      <div class="addBox">
<!--        <div v-if="possiblePatients.length > 0" class="similarBox">-->
<!--          <div><span class="secondLabel">发现相似患者</span></div>-->
<!--          <SimilarInfo-->
<!--              class="mt5"-->
<!--              v-for="patient in possiblePatients"-->
<!--              @select="possiblePatientSelect(patient)"-->
<!--              :key="patient.id"-->
<!--              :patient="patient"-->
<!--          ></SimilarInfo>-->
<!--        </div>-->
        <el-form
            :model="editInfo"
            :show-message="false"
            :rules="rules"
            ref="editPatientForm"
            label-width="80px"
            size="small"
            class="add-form"
        >
          <el-form-item prop="name" label="患者姓名">
            <el-input @blur="searchPatient" v-model="editInfo.name"></el-input>
          </el-form-item>
          <el-form-item prop="gender" label="患者性别">
            <el-radio-group v-model="editInfo.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="IdCard" label="身份证号">
            <el-input
                @blur="validateId(2)"
                v-model="editInfo.IdCard"
                placeholder="请输入身份证号码"
            ></el-input>
            <div style="color: #F56C6C;  font-size: 12px; line-height: 1; padding-top: 4px; position: absolute; top: 100%; left: 0;" v-if="isErrorFlag">请输入合法的身份证号</div>
<!--            <div class="error" v-if="isErrorFlag">请输入合法的身份证号</div>-->
          </el-form-item>
          <el-form-item prop="age" label="患者年龄">
<!--            <el-date-picker-->
<!--                value-format="yyyy-MM-dd"-->
<!--                format="yyyy 年 MM 月 dd 日"-->
<!--                v-model="editInfo.birthday"-->
<!--                style="width: 100%"-->
<!--            ></el-date-picker>-->
            <el-input v-model="editInfo.age" placeholder="无"></el-input>

          </el-form-item>
          <el-form-item prop="tel" label="联系方式">
            <el-input v-model="editInfo.tel" placeholder="默认为无"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="家庭住址">
            <el-input v-model="editInfo.address" placeholder="默认为无"></el-input>
          </el-form-item>
          <el-form-item prop="address" label="初诊内容">
            <el-input v-model="editInfo.NewDiagnosis" placeholder="默认为无"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAddPatientList,
  addNewPatient,
  possiblePatientSearch,
  getPatientBasicInfo,
  deletePatient,
  updatePatient,
  searchAddPatientList,
  getAddPatientListSum,
  getAddPatientListAll,
} from "@api/patientInfo/patientinfo.js";
import similarInfo from "./components/similarInfo.vue";
//在要导出的vue组件中的script引入
import FileSaver from "file-saver"
import XLSX from "xlsx"
import {getOrgInfo} from "@api/orgmanage/orgmanage";
import SearchTool from "@views/patientInfo/newPatient/components/SearchTool";
import {Loading} from "element-ui";

export default {
  data() {
    return {
      isErrorFlag:false,  //身份证是否正确
      filterFlag:false,//条件筛选对话框弹框
      filterForm:{  //条件筛选具体内容
        surName:null ,  //姓氏
        gender:null,//性别
        Phone:null,//电话号码
        minAge: null ,//最小年龄
        maxAge:null,//最大年龄
        Address:null ,//住址
        NewDiagnosis:null, //初诊
        name:'',//姓名
        organization:null,//机构id
        importname:null ,   //导入者名称
        startDate:null,
        endDate:null



      },
      searchDate:null,
      searchRule: {
        rule: "name",
        value: "",
      },
      formInline: {
        name: "",
        account: "",
        gender: "",
      },
      searchRule1: [
        {
          label: "姓名",
          value: "name",
          type: "input",
          currentValue:''
        },
        {
          label: "姓氏",
          value: "surName",
          secondValue:'PatientName',
          type: "input",
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
          value: "gender",
          type: "selection",
          currentValue:'',
          options:[{label:'男',value:'男'},{label:'女',value:'女'}],
        },
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
      ],
      roleName:JSON.parse(localStorage.getItem("role")),
      headers:[
        {label:'姓名',value:'PatientName'},
        {label:'账号',value:'PatientID'},
        {label:'性别',value:'Gender'},
        {label:'年龄',value:'Age'},
        {label:'联系方式',value:'Phone'},
        {label:'家庭住址',value:'Address'},
        {label:'初诊',value:'NewDiagnosis'},
        {label:'更新',value:'ModifyTime'},
        {label:'所属机构',value:'HospitalName'},
        {label:'导入者',value:'Name'},

      ],
      showTable: [],   //table表格显示的数据
      tableData: [],   // 最原始的数据
      filtertableData:[],  //多条件筛选过后的数据
      currentPage: this.$store.state.patientList.addPatientList.currentPage,
      pageSize: this.$store.state.patientList.addPatientList.pageSize,
      addDialogVisible: false,
      editDialogVisible: false,
      newPatient: {
        name: "",
        gender: "",
        birthday: "",
        tel: "",
        IdCard: "",
        address: "",
        NewDiagnosis:"",
        age:''
      },
      editInfo:{
        name: "",
        gender: "",
        birthday: "",
        tel: "",
        IdCard: "",
        address: "",
        NewDiagnosis:"",
        age:'',
      },
      exportData:[],
      json_data:[],
      rules: {
        name: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
        gender: [{ required: true }],
        // IdCard: [{	//调用上面定义的方法校验格式是否正确
        //           validator: isCnNewID,trigger: "blur",
        // }],
        age: [
          {
        //     // type: "date",
            required: true,
            message: "请输入年龄",
            trigger: "change",
          },
        ],
      },
      newBingliVisible: false,
      possiblePatientsDialogVisible: false,
      possiblePatients: [],
      totalSize:0,
      orgList:[],
      exportFlag:false,//导出标志
      export_precent:0,//导出进度条
    };
  },
  computed:{
    isManaeger(){
      let role=JSON.parse(localStorage.getItem("role"))
      let flag=false
      role.forEach(item=>{
        console.log(item.RoleName)
        if (item.RoleName=="专家负责人" || item.RoleName=="机构负责人"){
          console.log("专家")
          flag=true
        }
      })
      return flag
    },
    isZhuanJia(){
      let role=JSON.parse(localStorage.getItem("role"))
      let flag=false
      role.forEach(item=>{
        // console.log(item.RoleName)
        if (item.RoleName=="专家负责人"){
          // console.log("专家")
          flag=true
        }
      })
      return flag
    },
    //姓氏筛选
    surnameOptions(){
      let arr = [];
      let temp = JSON.parse(JSON.stringify(this.tableData));
      // console.log("姓氏")
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
  watch:{
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
      //   name:null,//姓名
      //   organization:null,//机构id
      //   importname: null  //导入者名称
      //
      // }
      this.filterForm[rule.value]=data
      console.log("索引",this.searchRule1.findIndex(item=>{return item.value==rule.value}))
      // arr[rule.value]=data
      // searchAddPatientList(arr)
      this.getList(this.filterForm)
      // this.filterForm[rule.value]=data
      // console.log(this.filterForm)
    },
    ruleChange(rule,data){
      console.log("rule改变")
     let index=this.searchRule1.findIndex(item=>{return item.value==rule.value})
      this.searchRule1[index].currentValue=''
      this.filterForm[rule.value]=''
      this.getList(this.filterForm)
    },
    handlefilter(){
      this.filterFlag = true;
      // this.filterForm={
      //   surName:null ,  //姓氏
      //   gender:null,//性别
      //   minAge: null ,//最小年龄
      //   maxAge:null,//最大年龄
      //   Address:null ,//住址
      //   NewDiagnosis:null, //初诊
      //   name:'',//姓名
      //   organization:null,//机构id
      //   importname: null  //导入者名称
      //
      // }
    },
    //
    checkId(idNo){
      console.log("check",idNo)
        if (idNo && typeof idNo == 'string' && idNo.length == 18) {
          // 前17位系数
          let preCard17 = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 余数与身份证第18位对应关系

          let card18 = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
          let  pre17 = idNo.substring(0, 17).split(""); // 前17位与系数的乘积和

          let sum = 0;

          for (let i = 0; i < preCard17.length; i++) {
            sum += preCard17[i] * parseInt(pre17[i]);
          } // 求余数


          var seek = sum % 11; //检验

          if (idNo.substring(17) == card18[seek]) {
            // console.log("有效")
            return true;
          } else {
            // console.log("无效")
            return false;
          }
        } else {
          // console.log("无效")
          return false;
        }


    },
    //身份号验证
    validateId(type){

      let iden;
      if (type==1){
        iden=this.newPatient.IdCard
      }else {
        iden=this.editInfo.IdCard
      }
      console.log(iden)
      // this.checkId(this.newPatient.IdCard)
      if (iden.length!=0){
        let val = iden.length;
        let myDate = new Date();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let age = 0;
        // 出生日期验证
        let  sBirthday = (
                iden.substr(6, 4) +
                "-" +
                Number(iden.substr(10, 2)) +
                "-" +
                Number(iden.substr(12, 2))
            ).replace(/-/g, "/"),
            d = new Date(sBirthday)
        console.log(iden.length,d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())
        // if (idreg.test(this.newPatient.IdCard)) {
        // if (
        //     (sBirthday == d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()) &&
        //     (iden.length==18)){
        if ( this.checkId(iden)==true){
          this.isErrorFlag=false
          if (val === 15) {
            age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
            if (iden.substring(8, 10) < month || iden.substring(8, 10) == month && iden.substring(10, 12) <= day) age++;
          }
          if (val === 18) {
            age = myDate.getFullYear() - iden.substring(6, 10) - 1;
            if (iden.substring(10, 12) < month || iden.substring(10, 12) == month && iden.substring(12, 14) <= day) age++;
          }
          if (age<0){
            this.isErrorFlag=true
          }else {
            this.isErrorFlag=false
            if (type==1){
              this.newPatient.age=age
            }else {
              this.editInfo.age=age
            }
          }


        } else {
          // console.log('有误')
          this.isErrorFlag=true
        }
      }else {
        this.isErrorFlag=false
      }


    },
    dialogClose(){
       this.newPatient= {
           name: "",
            gender: "",
            birthday: "",
            tel: "",
            IdCard: "",
            address: "",
            NewDiagnosis:"",
            age:''
      }
    },
    // //根据条件查询数据
    // filterTable1(){
    //   console.log("条件筛选",this.filterForm)
    //   if (this.filterForm.maxAge<this.filterForm.minAge && this.filterForm.maxAge!=null){
    //     this.$message.error("最大年龄不能小于最小年龄")
    //     return
    //   }
    //   //姓氏赋值
    //   this.searchRule1[1].currentValue=this.filterForm.surName
    //   this.searchRule1[2].currentValue=this.filterForm.gender//性别
    //   //住址
    //   this.searchRule1[3].currentValue=this.filterForm.Address
    //   //初诊
    //   this.searchRule1[4].currentValue=this.filterForm.NewDiagnosis
    //   //年龄段
    //   let arr = [];
    //   let temp = JSON.parse(JSON.stringify(this.tableData));
    //   arr=temp.filter(item=>{
    //     //姓氏筛选
    //     // console.log(item.PatientName[0])
    //     //姓氏的筛选
    //     if((item.PatientName[0]+"123").includes(this.filterForm.surName) &&
    //         (item.Address+"").includes(this.filterForm.Address)    &&
    //         (item.Gender+"").includes(this.filterForm.gender)    &&
    //         (item.NewDiagnosis+"").includes(this.filterForm.NewDiagnosis)
    //     ){
    //       if (this.filterForm.maxAge==null){
    //         if (item.Age>=this.filterForm.minAge){
    //           return true
    //         }else {
    //           return false
    //         }
    //       }else{
    //         if (item.Age>=this.filterForm.minAge && item.Age<=this.filterForm.maxAge){
    //           return true
    //         }else {
    //           return false
    //         }
    //       }
    //
    //       // }
    //
    //     }else{
    //       // console.log("不成立，",item.PatientName)
    //       return false
    //     }
    //   })
    //   console.log('筛选结果',arr)
    //   this.filtertableData=arr
    //   this.filterFlag=false
    //   // this.shpwTest=arr
    //   // console.log(this.searchRule1)
    //   this.filterFlag=false
    //
    // },
    filterTable(){
      console.log("日期",this.searchDate)
      if (this.searchDate==null){
        this.filterForm.startDate=null
        this.filterForm.endDate=null
      }else {
          this.filterForm.startDate=this.searchDate[0]+" 00:00:00"
        this.filterForm.endDate=this.searchDate[1]+" 00:00:00"
      }
      //处理查询数据
      console.log("查询",this.filterForm)
      if(this.filterForm.length==0){
        this.filterForm.name=null
      }
      //姓氏赋值
      this.searchRule1[1].currentValue=this.filterForm.surName
      this.searchRule1[2].currentValue=this.filterForm.gender//性别
      //住址
      this.searchRule1[3].currentValue=this.filterForm.Address
      //初诊
      this.searchRule1[4].currentValue=this.filterForm.NewDiagnosis
      //年龄段
      // console.log(this.filterForm.surName.length)
      let year=new Date().getFullYear()
      // console.log(year-this.filterForm.minAge)
      // console.log("-----------------")
      this.filterForm.minyear=year-this.filterForm.minAge +' 00:00:00'
      if (this.filterForm.maxAge==null){
        this.filterForm.maxyear=null
      }else{
        this.filterForm.maxyear=year-this.filterForm.maxAge +' 00:00:00'
      }
      this.getList(this.filterForm)
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
      this.$store.commit("patientInfo/currentPatientAccountChange", row.PatientID);
      this.$store.commit("patientInfo/currentPatientNameChange", row.PatientName);
      this.$router.push("/patientinfo/newpatientdetails");
    },
    editPatient(index,row){
      this.isErrorFlag=false
      getPatientBasicInfo(row.PatientID).then(res=>{
        console.log("获取患者信息",res)
        let year = new Date().getFullYear();
        this.editInfo= {
            UserID:row.PatientID,
            name:res[0].Name,
            gender:res[0].Gender,
            birthday: res[0].Birthday.split(" ")[0],
            tel: res[0].Phone,
            IdCard: res[0].IdentityID,
            address: res[0].Address,
          NewDiagnosis:res[0].NewDiagnosis,
          age:year-res[0].Birthday.split(" ")[0].split('-')[0],
        }
        console.log("查询",this.editInfo)

      })
      // console.log("编辑",this.newPatient)
      this.editDialogVisible=true
      this.addDialogVisible=false

    },
    confirmEdit(){
      //年
      if (this.editInfo.name.length==0 || this.editInfo.name==null || this.editInfo.name==undefined){
        this.$message.error("请输入患者姓名")
        return

      }
      if (this.editInfo.gender.length===0 || this.editInfo.gender==null || this.editInfo.gender==undefined){
        this.$message.error("请选择患者性别")
        return
      }
      if (this.editInfo.age.length==0 || this.editInfo.age==null || this.editInfo.age==undefined){
        this.$message.error("请输入患者年龄")
        return
      }
      let year = new Date().getFullYear();
      let month = new Date().getMonth() +1;
      let day = new Date().getDate();
      console.log(year-this.editInfo.age)
      this.editInfo.birthday=year-this.editInfo.age+'-'+month+'-'+day
      // console.log(this.newPatient)
      updatePatient(this.editInfo).then(res=>{
        console.log("病历修改",res)
        if (res) {
          this.getList(this.filterForm)
          this.$message.success("修改成功");
          this.editDialogVisible=false
        } else {
          this.$message.error("修改失败");
          this.editDialogVisible=false
        }
      })

    },
    delPatient(index,row){
      this.$confirm("确认是否删除这条患者信息！", "提示", {
        center: "true",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(()=>{
        deletePatient(row.PatientID).then(res=>{
          if (res) {
            this.getList(this.filterForm)
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败");
          }
        })
      }).catch(()=>{

      })

    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$store.commit('patientList/addpageSizeChange',val)
      this.getList(this.filterForm)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$store.commit('patientList/addcurrentPageChange',val)
      this.getList(this.filterForm)

    },
    searchRuleChange() {
      this.searchRule.value = "";
      this.reSet();
    },
    searchPatient() {
      if (this.newPatient.name || this.newPatient.IdCard) {
        possiblePatientSearch(this.newPatient).then((res) => {
          this.possiblePatients = res.map((item) => {
            return {
              userId: item.PatientID,
              identity: item.IdCard,
              address: item.Address,
              age: item.Age,
              gender: item.Gender,
              name: item.PatientName,
              pic: item.Image,
              tel: item.Phone,
            };
          });
          console.log(res);

          this.possiblePatientsDialogVisible = true;
        });
      }
    },
    addPatient() {
      if (this.newPatient.name.length==0 || this.newPatient.name==null || this.newPatient.name==undefined){
        this.$message.error("请输入患者姓名")
        return

      }
      if (this.newPatient.gender.length===0 || this.newPatient.gender==null || this.newPatient.gender==undefined){
        this.$message.error("请选择患者性别")
        return
      }
      if (this.newPatient.age.length==0 || this.newPatient.age==null || this.newPatient.age==undefined){
        this.$message.error("请输入患者年龄")
        return
      }
      //年
      let year = new Date().getFullYear();
      let month = new Date().getMonth() +1;
      let day = new Date().getDate();
      console.log(year-this.newPatient.age)
      this.newPatient.birthday=year-this.newPatient.age+'-'+month+'-'+day
      console.log(this.newPatient)
      addNewPatient(this.newPatient).then((res) => {
        console.log("添加患者",res)
        if (res) {
          this.getList(this.filterForm)
          this.newPatient=[];
          this.$message.success("添加成功");
          this.addDialogVisible = false;

        } else {
          this.$message.error("添加失败");
          this.addDialogVisible = false;
        }
      });
    },
    possiblePatientSelect(item) {
      this.$store.commit("patientInfo/currentPatientAccountChange", item.userId);
      this.$store.commit("patientInfo/currentPatientNameChange", item.name);
      this.$router.push("/patientinfo/newpatientdetails");
    },
    //导出数据表格,数据写入excel，并导出为Excel文件
    exportToExcel(){
      const XLSX = require('xlsx')
      console.log('XLSX',XLSX,FileSaver)
      let temp=this.pageSize
      this.pageSize=this.totalSize
      this.currentPage=1
      let loading = Loading.service({
        lock: true,
        text: '正在导出',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      //获取所有数据
      getAddPatientListAll().then(res=>{
        console.log("导出",res)
        this.exportData=res
        this.$nextTick(function () {
          loading.close()
          // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
          const xlsxParam = { raw: true }
          const wb = XLSX.utils.table_to_book(document.querySelector('#patientList'), xlsxParam)
          // 默认导出excel文件名
          let fileName = '患者信息' + new Date().getTime() + '.xlsx'
          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            // 下载保存文件
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
          } catch (e) {
            if (typeof console !== 'undefined') {
              console.log(e, wbout)
            }
          }
          this.pageSize=temp
          return wbout
        })
      })


      // 使用 this.$nextTick 是在dom元素都渲染完成之后再执行
      // this.$nextTick(function () {
      //   // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
      //   const xlsxParam = { raw: true }
      //   const wb = XLSX.utils.table_to_book(document.querySelector('#patientList'), xlsxParam)
      //   // 默认导出excel文件名
      //   let fileName = '患者信息' + new Date().getTime() + '.xlsx'
      //
      //   const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      //   try {
      //     // 下载保存文件
      //     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
      //   } catch (e) {
      //     if (typeof console !== 'undefined') {
      //       console.log(e, wbout)
      //     }
      //   }
      //   this.pageSize=temp
      //   return wbout
      // })
    },
    async exportToExcel2(){
      this.exportFlag=true
      this.export_precent=0
      let exportTotal= 0 // 导出记录数
      let totalPage=0    //总共要请求多少次
      let exprotPage=1 // 调用接口页
      let exportSize=10000  // 每次请求10000条，
      let exportPercent= 0; // 合并进度比。由于查看合并进度。
      let exportData=[];
      getAddPatientListSum(this.filterForm).then(async res => {
        exportTotal = res[0]['count(*)']
        totalPage = Math.ceil(exportTotal / exportSize);
        // console.log("共计", totalPage)
        //分段请求数据
        // let arr==[]
        for (let i = 1; i <= totalPage; i++) {
          const res = await getAddPatientList(i, exportSize, this.filterForm)
            // console.log("第"+i+"次",res)
            exportData=[...exportData,...res]

            this.export_precent=Math.ceil(exportData.length/exportTotal*100)
        }
        // console.log("全部数据",exportData)
        let result = exportData;
        //获取数据长度，用于后期截取
        let length = result.length;
        //展示的顺序，把data中对象的属性按照你想要的顺序排放就可以了，我这里把id移到了第一列展示
        const header = ["PatientName", "PatientID","Gender","Age","Phone","Address","NewDiagnosis","ModifyTime","HospitalName","Name"];
        //展示的名称
        const headerDisplay = {PatientName:"姓名", PatientID:"账号", Gender:"性别", Age:"年龄", Phone:"联系方式", Address:"家庭住址", NewDiagnosis:"初诊",ModifyTime:"更新时间",HospitalName:"所属机构",Name:"导入者"};
        //每页放4W条数据，获取满页页数
        var fornum = parseInt(length / 40000);
        //获取剩余数据量
        var remainnum = length % 40000;
        let workbook = XLSX.utils.book_new();
        // 循环sheet页数开始填充
        // for (var i = 0; i < fornum; i++) {
        //   console.log("分页数据",result.slice(0,40000))
        //   let sheetdata = XLSX.utils.json_to_sheet([headerDisplay,...result.slice(0,40000)],{header:header,skipHeader:true});
        //   console.log("sheetdata",sheetdata)
        //   //添加sheet页
        //   XLSX.utils.book_append_sheet(workbook, sheetdata, 'sheet' + (i + 1));
        //   result = result.slice(40000);  //删除掉已录入的数据
        // }
        //最后剩余数据
        let last = XLSX.utils.json_to_sheet([headerDisplay,...result],{header:header,skipHeader:true});
        XLSX.utils.book_append_sheet(workbook, last, 'sheet' + (fornum + 1));
        let wbout = XLSX.write(workbook, {
          bookType: 'xlsx',
          bookSST: false,
          type: 'array'
        });
        try {
          console.log("下载保存文件")
          this.exportFlag=false
          let fileName = '患者信息' + new Date().getTime() + '.xlsx'
          // XLSX.writeFile(workbook, '患者数据导出.xlsx')
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
          // FileSaver.saveAs(
          //     new Blob([wbout], {
          //       type: 'application/octet-stream;charset=utf-8"'
          //     }), "名称");
        } catch (e) {
          if (typeof console !== 'undefined') console.log("异常",e, wbout);
        }
        return wbout;
      })

      // // console.log("导出数据0",new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
      // getAddPatientListAll().then(res=>{
      //   console.log("res",res)
      //   console.log("获取到数据",new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
      //   let result = res;
      //   //获取数据长度，用于后期截取
      //   let length = result.length;
      //   let xlsxParam = {
      //     raw: true
      //   };
      //   //展示的顺序，把data中对象的属性按照你想要的顺序排放就可以了，我这里把id移到了第一列展示
      //   const header = ["PatientName", "PatientID","Gender","Age","Phone","Address","NewDiagnosis","ModifyTime","HospitalName","Name"];
      //   //展示的名称
      //   const headerDisplay = {PatientName:"姓名", PatientID:"账号", Gender:"性别", Age:"年龄", Phone:"联系方式", Address:"家庭住址", NewDiagnosis:"初诊",ModifyTime:"更新时间",HospitalName:"所属机构",Name:"导入者"};
      //   //每页放4W条数据，获取满页页数
      //   var fornum = parseInt(length / 40000);
      //   //获取剩余数据量
      //   var remainnum = length % 40000;
      //   let workbook = XLSX.utils.book_new();
      //   // 循环sheet页数开始填充
      //   // for (var i = 0; i < fornum; i++) {
      //   //   console.log("分页数据",result.slice(0,40000))
      //   //   let sheetdata = XLSX.utils.json_to_sheet([headerDisplay,...result.slice(0,40000)],{header:header,skipHeader:true});
      //   //   console.log("sheetdata",sheetdata)
      //   //   //添加sheet页
      //   //   XLSX.utils.book_append_sheet(workbook, sheetdata, 'sheet' + (i + 1));
      //   //   result = result.slice(40000);  //删除掉已录入的数据
      //   // }
      //   //最后剩余数据
      //   let last = XLSX.utils.json_to_sheet([headerDisplay,...result],{header:header,skipHeader:true});
      //   XLSX.utils.book_append_sheet(workbook, last, 'sheet' + (fornum + 1));
      //   let wbout = XLSX.write(workbook, {
      //     bookType: 'xlsx',
      //     bookSST: false,
      //     type: 'array'
      //   });
      //   try {
      //     console.log("下载保存文件")
      //     this.exportFlag=false
      //     let fileName = '患者信息' + new Date().getTime() + '.xlsx'
      //     // XLSX.writeFile(workbook, '患者数据导出.xlsx')
      //     FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
      //     // FileSaver.saveAs(
      //     //     new Blob([wbout], {
      //     //       type: 'application/octet-stream;charset=utf-8"'
      //     //     }), "名称");
      //   } catch (e) {
      //     if (typeof console !== 'undefined') console.log("异常",e, wbout);
      //   }
      //   return wbout;
      // })

    },
    getList(searchData){
      getAddPatientListSum(this.filterForm).then(res=>{
        this.totalSize=res[0]['count(*)']
        console.log("总数", this.totalSize);
      })
      getAddPatientList(this.currentPage,this.pageSize,searchData).then((res) => {
        console.log("新增患者列表",res)
        this.showTable=this.tableData = res;
      });

    },

  },
  components: {
    // SimilarInfo: similarInfo,
    SearchTool
  },

  mounted() {

    this.getList(this.filterForm)
    if (this.isZhuanJia==true){
      this.searchRule1.push( {
        label: "导入者",
        value: "importname",
        type: "input",
        currentValue:'',
      },)
      getOrgInfo().then(res=>{
        // console.log("机构信息获取",res)
        this.orgList=res.map(item=>{
          return {
            label:item.HospitalName,
            value:item.HospitalID
          }
        })
        this.searchRule1.push( {
          label: "所属机构",
          value: "organization",
          type: "selection",
          currentValue:'',
          options:this.orgList
        },)
      })
    }


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
  margin: 10px 2.5% 10px 0px;
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
.addBox {
  position: relative;
  .similarBox {
    width: 350px;
    border-radius: 5px;
    padding: 10px;
    background-color: #fff;
    right: -370px;
    top: -80px;
    position: absolute;
  }
}
.medicalCard {
  display: flex;
  min-height: 100px;
  background-color: rgb(236, 231, 231);
  overflow: hidden;
  margin-top: 10px;
  padding: 5px;
  border-radius: 3px;
  .pic {
    max-width: 95px;
    max-height: 95px;
    flex-shrink: 0;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      display: flex;
      flex-direction: row;
      width: 100%;
      .select {
        float: right;
      }
    }
  }
}
//.error{
//  color: #F56C6C;
//  font-size: 12px;
//  line-height: 1;
//  padding-top: 4px;
//  position: absolute;
//  top: 100%;
//  left: 0;
//}
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
.add-form{
  //.el-form-item__error {
  //  color: #F56C6C;
  //  font-size: 12px;
  //  line-height: 1;
  //  padding-top: 4px;
  //  position: absolute;
  //  top: 100%;
  //  left: 0;
  //}
  ::v-deep{
    .el-form-item__error{
        color: #F56C6C;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }
  }
}
.el-dialog__body {
  padding: 30px 0px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.el-progress__text {
  font-size: 10px;
  color: #606266;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  line-height: 1;
}
</style>
