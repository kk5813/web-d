<template>
  <div>
    <div class="pageContent">
      <el-collapse v-model="pages.collapse_activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <h3 class="title">基本信息</h3>
          </template>
          <PersonalInfo
            @endTreat="endTreat"
            @startConsultation="startConsultation"
            :prsonalInfo="patientInfo.API_basicInfo"
          ></PersonalInfo>
        </el-collapse-item>

        <div class="chuyuan">
          <Chuyuan ref="chuyuan"></Chuyuan>
        </div>
        <div class="chuyuan">
          <ConsultationStart :pid="pid" ref="huizhen"></ConsultationStart>
        </div>
        <el-collapse-item name="2">
          <template slot="title">
            <h3 class="title">治疗记录</h3>
          </template>
          <div v-if="chuyuanApplyFlag" style="margin: 20px 0">
            <Tips :reason="chuyuanReason" @refuse="refuseApply" @end="endTreat"></Tips>
          </div>
          <div class="container">
            <TreatLogs :pid="pid"></TreatLogs>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <h3 class="title">穿戴式设备</h3>
          </template>
          <div class="wearable" style="margin: 20px 0;">
            <div class="bloodSugarInfo" style="margin-left: 30px;margin-right:30px;width: 100%;display: flex;justify-content: space-between;align-items: center">
              <div>
                <span class="formLabel">时间：</span>
                <el-date-picker
                    v-model="searchDate"
                    size="small"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </div>
              <div>
                <span class="formLabel">手机号：</span>
                <el-input v-model="phone" placeholder="请输入地址" style="width: 200px"></el-input>
              </div>
              <el-button type="success" @click="searchWear()">查询</el-button>

            </div>

          </div>
          <div class="wearable">
            <div class="bloodSugarInfo">
              <div class="titleInfo">血糖信息</div>
              <div id="bloodSugar" style="width: 500px; height: 400px"></div>
            </div>
            <div class="bloodSugarInfo">
              <div class="titleInfo">胆固醇信息</div>
              <div id="cholesterol" style="width: 500px; height: 400px"></div>
            </div>
            <div class="bloodSugarInfo">
              <div class="titleInfo">智慧衣温度信息</div>
              <div id="temperature" style="width: 500px; height: 400px"></div>
            </div>
            <div class="bloodSugarInfo">
              <div class="titleInfo">血压信息</div>
              <div id="bloodpressure" style="width: 500px; height: 400px"></div>
            </div>
            <div class="bloodSugarInfo">
              <div class="titleInfo">尿酸信息</div>
              <div id="uriAcid" style="width: 500px; height: 400px"></div>
              <div v-if="uriAcid.length==0"> 暂无数据</div>
            </div>
            <div class="gpsInfo" style="margin-top: 10px">
              <div class="titleInfo">GPS信息</div>
              <div  style=" margin-top: 30px; margin-left: 30px">
                <el-table
                    :data="gps.slice((gpsPage.currentpage - 1) * gpsPage.pageSize, gpsPage.currentpage * gpsPage.pageSize)"
                    style="width: 100%">
                  <el-table-column
                      prop="dateTime"
                      label="日期"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="longitude"
                      label="经度"
                  >
                  </el-table-column>
                  <el-table-column
                      prop="latitude"
                      label="纬度">
                  </el-table-column>
                </el-table>
                <div>
                  <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handlegpsCurrentChange"
                      :current-page="gpsPage.currentpage"
                      :page-size="gpsPage.pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="gpsPage.total"
                  ></el-pagination>
                </div>

              </div>
              <!--              <div id="gps" style="width: 500px; height: 400px"></div>-->
            </div>
            <div class="bloodSugarInfo" style="margin-top: 10px; width: 1000px;">
              <div class="titleInfo">
                <span>EEG信息</span>
<!--                <el-button type="primary" style="margin-left: 30px" @click="handleShowClick">获取实时数据</el-button>-->
                <el-button type="primary" style="margin-left: 30px" @click="handleShowClick">实时数据</el-button>
                <show-e-eg v-model="dialogVisible"></show-e-eg>

              </div>
<!--              <el-dialog-->
<!--                  title="实时EEG数据"-->
<!--                  :visible.sync="dialogVisible"-->
<!--                  width="80%"-->
<!--                  style="width: 100%;height: 100%"-->
<!--                  :before-close="handleClose">-->
<!--&lt;!&ndash;                <div id="totalFlowRate" style="height:300px; width: 100%" ref="totalFlowRate"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate1" style="height:300px; width: 100%" ref="totalFlowRate1"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate2" style="height:300px; width: 100%" ref="totalFlowRate2"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate3" style="height:300px; width: 100%" ref="totalFlowRate3"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate4" style="height:300px; width: 100%" ref="totalFlowRate4"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate5" style="height:300px; width: 100%" ref="totalFlowRate5"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate6" style="height:300px; width: 100%" ref="totalFlowRate6"></div>&ndash;&gt;-->
<!--&lt;!&ndash;                <div id="totalFlowRate7" style="height:300px; width: 100%" ref="totalFlowRate7"></div>&ndash;&gt;-->
<!--                <text>实时数据</text>-->
<!--&lt;!&ndash;                <div style="width: 100%;height: 100%">&ndash;&gt;-->
<!--&lt;!&ndash;                  <iframe src="/static/showEeg.html" id="tempHtml"  ref="tempHtml" frameborder="0" style="width: 100%;height: 100%"></iframe>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->

<!--              </el-dialog>-->
              <div style="margin-top: 50px; margin-bottom: -70px; margin-left: 50px">channel1</div>
              <div v-loading="loading" id="eeg1" style="width: 1200px; height: 200px; margin-top: 30px; margin-left: -50px"></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel2</div>
              <div v-loading="loading" id="eeg2" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel3</div>
              <div v-loading="loading" id="eeg3" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel4</div>
              <div v-loading="loading" id="eeg4" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel5</div>
              <div v-loading="loading" id="eeg5" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel6</div>
              <div v-loading="loading" id="eeg6" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel7</div>
              <div v-loading="loading" id="eeg7" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div style="margin-bottom: -50px; margin-left: 50px">channel8</div>
              <div v-loading="loading" id="eeg8" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              <div v-if="eegtype==8">
                <div style="margin-bottom: -50px; margin-left: 50px">channel9</div>
                <div v-loading="loading" id="eeg9" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel10</div>
                <div v-loading="loading" id="eeg10" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel11</div>
                <div v-loading="loading" id="eeg11" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel12</div>
                <div v-loading="loading" id="eeg12" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel13</div>
                <div v-loading="loading" id="eeg13" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel14</div>
                <div v-loading="loading" id="eeg14" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel15</div>
                <div v-loading="loading" id="eeg15" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
                <div style="margin-bottom: -50px; margin-left: 50px">channel16</div>
                <div v-loading="loading" id="eeg16" style="width: 1200px; height: 200px; margin-left: -50px" ></div>
              </div>

            </div>

          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 参考 -->
      <Reference
        :pid="pid"
        :items="['就诊记录', '入院记录', '护理记录', '评估记录']"
        :readonly="true"
      ></Reference>
      <!-- 聊天 -->
      <chatBox :pid="pid"></chatBox>
      <!-- 查看问卷对话框 -->
    </div>
  </div>
</template>

<script>
import uCharts from '../../../utils/u-charts';
import showEEg from "@views/patienttreatment/patientdetails/components/showEEg";
var uChartsInstance = {};
import Prescription from "@components/common/Prescription.vue";
import chatBox from "@components/chatBox/chatBox.vue";
import Reference from "@components/reference/Reference.vue";
import questionnaire from "@components/questionnaires/mixin.js";

import PersonalInfo from "./components/PersonalInfo.vue";
import TreatLogs from "./components/TreatLogs.vue";
import Chuyuan from "./components/Chuyuan.vue";
import Tips from "./components/Tips.vue";
import ConsultationStart from "@components/consultation/ConsultationStart.vue";

import { newQuestionnaire } from "@api/operationmanage/operationmanage.js";
import {
  getGpsInfo,
  getTypeInfo,
  getBloodPressureInfo,
  getEggInfo,
  getToken,
  getCurrentEeg,
  getBloodSuger, getUserTc, getUserTemperature, getUserBp, getUserTg, getUserGps, getUserEeg, getBloodSugerNew
} from "../../../api/weardevice/weardevice"
import {
  getPatientsDetails,
  getChuyuanApplyTag,
  refuseChuyuanApply,
} from "@api/patienttreatment/patienttreatment.js";
import moment from "moment";
export default {
  mixins: [questionnaire],
  components: {
    Prescription,
    PersonalInfo,
    chatBox,
    TreatLogs,
    Reference,
    Chuyuan,
    ConsultationStart,
    Tips,
    showEEg
  },
  data() {
    return {
      tableData: [],
      pid: "",
      chuyuanApplyFlag: false,
      chuyuanReason: "",
      pages: {
        pageSize: 5,
        currentPage: 1,
        collapse_activeNames: ["1", "2","3"],
        search: {
          API_name: "",
          API_state: "",
          API_dateRange: "",
        },
        questionnaire: {
          chooseDialogVisible: false,
          questionnaireDialogVisible: false,
          target: "",
          questionnaireOptions: ["吞咽功能评定", "跌倒风险评定", "护理记录"],
          data: {},
          readOnlyDialoguVisible: false,
          readOnlyDialoguTarget: {},
          lastData: {}, //用于导入的数据
          importFlag: false,
        },
      },
      patientInfo: {
        API_basicInfo: {},
      },
      searchDate:null,//查询日期
      phone:'17387512145',
      gps: [], //
      gpsOption: {},
      bloodsuger: [], //
      bloodsugerOption: {},
      cholesterol: [], //胆固醇
      cholesterolOption: {},
      temperature: [],
      temperatureOption: {},
      uriAcid:[],//尿酸
      uriAcidOption:{},
      bloodpressure: [],
      bloodpressureOption: {},
      eeg: [],
      eegtype:8,
      eegOption: {},
      cWidth: 750,
      cHeight: 500,
      loading: true,
      dialogVisible: false,
      timer: null,
      timer1: null,
      timer2: null,
      timer3: null,
      timer4: null,
      timer5: null,
      timer6: null,
      timer7: null,
      timer8: null,
      yArr1: new Array(500).fill(null),
      yArr2:new Array(500).fill(null),
      yArr3:new Array(500).fill(null),
      yArr4:new Array(500).fill(null),
      yArr5:new Array(500).fill(null),
      yArr6:new Array(500).fill(null),
      yArr7:new Array(500).fill(null),
      yArr8:new Array(500).fill(null),
      ifeData:'',
      eegXdata:[],
      channel1Data:[],
      channel2Data:[],
      channel3Data:[],
      channel4Data:[],
      channel5Data:[],
      channel6Data:[],
      channel7Data:[],
      channel8Data:[],
      channel9Data:[],
      channel10Data:[],
      channel11Data:[],
      channel12Data:[],
      channel13Data:[],
      channel14Data:[],
      channel15Data:[],
      channel16Data:[],
      gpsPage:{
        currentpage:1,
        pageSize:5,
        total:10
      }
    };
  },
  methods: {
    handleShowClick() {
      this.dialogVisible = true;
      // this.ifeData=require("../../../assets/showEeg.html")
      // this.$refs.tempHtml.contentDocument.documentElement.innerHTML=this.ifeData
      // this.currentEegData();
      // this.$nextTick(this.drawCurrentEeg);
      // this.$nextTick(this.drawCurrentEeg1);
      // this.$nextTick(this.drawCurrentEeg2);
      // this.$nextTick(this.drawCurrentEeg3);
      // this.$nextTick(this.drawCurrentEeg4);
      // this.$nextTick(this.drawCurrentEeg5);
      // this.$nextTick(this.drawCurrentEeg6);
      // this.$nextTick(this.drawCurrentEeg7);
    },
    currentEegData() {
      //2022/6/14 8:02:05
      //moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      this.timer8 = setInterval(()=> {
        getCurrentEeg(100, moment().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss')).then(res => {
          const newArr1 = res.data.msg.rows.map((item) => item.data[0]);
          this.yArr1.push(...newArr1);
          const newArr2 = res.data.msg.rows.map((item) => item.data[1]);
          this.yArr2.push(...newArr2);
          const newArr3 = res.data.msg.rows.map((item) => item.data[2]);
          this.yArr3.push(...newArr3);
          const newArr4 = res.data.msg.rows.map((item) => item.data[3]);
          this.yArr4.push(...newArr4);
          const newArr5 = res.data.msg.rows.map((item) => item.data[4]);
          this.yArr5.push(...newArr5);
          const newArr6 = res.data.msg.rows.map((item) => item.data[5]);
          this.yArr6.push(...newArr6);
          const newArr7 = res.data.msg.rows.map((item) => item.data[6]);
          this.yArr7.push(...newArr7);
          const newArr8 = res.data.msg.rows.map((item) => item.data[7]);
          this.yArr8.push(...newArr8);
        })
      }, 100);

    },
    drawCurrentEeg() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate);
      }

      var xAxisData = [];
      // var yAxisData = [];
      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }
      // for (i = 1; i < 501; i++) {
      //   yAxisData.push(null);
      // }
      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel1'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel1',
          type: 'line',
          data: this.yArr1/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer = setInterval( ()=> {
        // yAxisData.push(Math.round(Math.random() * 1000));
        if(this.yArr1.length>500) {
          this.yArr1.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg1() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate1
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate1);
      }

      var xAxisData = [];

      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }

      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel2'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel2',
          type: 'line',
          data: this.yArr2/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer1 = setInterval( ()=> {
        if(this.yArr2.length>500) {
          this.yArr2.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg2() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate2
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate2);
      }

      var xAxisData = [];

      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }

      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel3'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel3',
          type: 'line',
          data: this.yArr3/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer2 = setInterval( ()=> {
        // this.yArr3.push(Math.round(Math.random() * 1000));
        if(this.yArr3.length>500) {
          this.yArr3.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg3() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate3
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate3);
      }

      var xAxisData = [];
      // var yAxisData = [];
      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }
      // for (i = 1; i < 501; i++) {
      //   yAxisData.push(null);
      // }
      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel4'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel4',
          type: 'line',
          data: this.yArr4/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer3 = setInterval( () =>{
        // this.yArr4.push(Math.round(Math.random() * 1000));
        if(this.yArr4.length>500) {
          this.yArr4.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg4() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate4
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate4);
      }

      var xAxisData = [];
      // var yAxisData = [];
      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }
      // for (i = 1; i < 501; i++) {
      //   yAxisData.push(null);
      // }
      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel5'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel5',
          type: 'line',
          data: this.yArr5/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer4 = setInterval( ()=> {
        // this.yArr5.push(Math.round(Math.random() * 1000));
        if(this.yArr5.length>500) {
          this.yArr5.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg5() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate5
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate5);
      }

      var xAxisData = [];
      // var yAxisData = [];
      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }
      // for (i = 1; i < 501; i++) {
      //   yAxisData.push(null);
      // }
      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel6'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel6',
          type: 'line',
          data:  this.yArr6/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer5 = setInterval( () => {
        // this.yArr6.push(Math.round(Math.random() * 1000));
        if(this.yArr6.length>500) {
          this.yArr6.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg6() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate6
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate6);
      }

      var xAxisData = [];
      // var yAxisData = [];
      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }
      // for (i = 1; i < 501; i++) {
      //   yAxisData.push(null);
      // }
      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel7'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel7',
          type: 'line',
          data: this.yArr7/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer6 = setInterval( ()=> {

        if(this.yArr7.length>500) {
          this.yArr7.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    drawCurrentEeg7() {
      let totalFlowRate = this.$echarts.getInstanceByDom(
          this.$refs.totalFlowRate7
      );
      if (totalFlowRate == null) {
        totalFlowRate = this.$echarts.init( this.$refs.totalFlowRate7);
      }

      var xAxisData = [];
      // var yAxisData = [];
      for (var i = 500; i > 0; i--) {
        xAxisData.push(i + "秒前");
      }
      // for (i = 1; i < 501; i++) {
      //   yAxisData.push(null);
      // }
      var totalFlowRateOption = {
        animation: false,
        title: {
          text: 'channel8'/*,
        left:"110px"*/ },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: {
          left: 50/*"50px"*/,
          right: 15/*"15px"*/
        },
        // legend: {
        //   data: ['当前流量']
        // },
        xAxis: {
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: { boundaryGap: false },
        series: {
          symbol: "none",/*去掉小圆点*/
          name: 'channel8',
          type: 'line',
          data: this.yArr8/*,             smooth:true//显示为平滑的曲线*/
        }
      };
      totalFlowRate.setOption(totalFlowRateOption);
      this.timer7 = setInterval( ()=> {
        if(this.yArr8.length>500) {
          this.yArr8.shift();
        }
        totalFlowRate.setOption(totalFlowRateOption);
      }, 100);
    },
    handleClose() {
      this.dialogVisible = false;
      clearInterval(this.timer)
      clearInterval(this.timer1)
      clearInterval(this.timer2)
      clearInterval(this.timer3)
      clearInterval(this.timer4)
      clearInterval(this.timer5)
      clearInterval(this.timer6)
      clearInterval(this.timer7)
      clearInterval(this.timer8)
    },
    getChuyuanApplyFlag() {
      getChuyuanApplyTag(this.pid).then((res) => {
        console.log(res);
        if (res.state) {
          this.chuyuanReason = res.msg.OutHospitalReason;
        }
        this.chuyuanApplyFlag = res.state;
      });
    },
    refuseApply() {
      refuseChuyuanApply(this.pid).then((res) => {
        if (res) {
          this.$message.success("您已拒绝患者出院申请");
        } else {
          this.$message.error("拒绝患者出院申请失败");
        }
      });
      this.getChuyuanApplyFlag();
    },
    endTreat() {
      this.$refs["chuyuan"].showFlag = true;
    },
    startConsultation() {
      this.$refs["huizhen"].showFlag = true;
    },
    handleSizeChange(val) {
      this.pages.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
    },
    handlegpsCurrentChange(val){
      this.gpsPage.currentpage=val
    },
    confirmQuestionnaire() {
      this.pages.questionnaire.chooseDialogVisible = false;
      this.pages.questionnaire.questionnaireDialogVisible = true;
      this.pages.questionnaire.data = {};
    },
    lookQuestionnaire(questionnaire) {
      this.pages.questionnaire.readOnlyDialoguTarget = questionnaire;
      this.pages.questionnaire.readOnlyDialoguVisible = true;
    },
    successImport() {
      this.pages.questionnaire.importFlag = false;
    },
    save() {
      this.$router.push("/treatment/applylist");
    },
    drawGps() {
      // console.log(this.gps)
      let data = [];
      let xMin = 180;
      let yMin = 90;
      for(let i = 0; i < this.gps.length; i++) {
        let tmp = [];
        tmp.push(this.gps[i].longitude, this.gps[i].latitude, this.gps[i].date + '');
        data.push(tmp);
        if(xMin > this.gps[i].longitude) xMin = this.gps[i].longitude
        if(yMin > this.gps[i].latitude) yMin = this.gps[i].latitude
      }
      this.gpsOption.xAxis = {
        min: Math.floor(xMin - 5)
      };
      this.gpsOption.yAxis = {
        min: Math.floor(yMin)
      };
      this.gpsOption.series = [];
      this.gpsOption.series[0] = {};
      this.gpsOption.series[0].symbolSize = 5;
      this.gpsOption.series[0].data = data;
      this.gpsOption.series[0].type = 'scatter';
      let label = {
        show: true,
        position: 'right',
        formatter: '{@value}'
      };
      this.gpsOption.series[0].label = label;
      let tooltip = {
        trigger: 'item',
        formatter:(params) => {
          return `时间：${params.data[2]}</br>经度：${params.data[0]}</br> 纬度：${params.data[1]}`
        }
      };
      this.gpsOption.tooltip = tooltip
      const chart = this.$echarts.init(document.getElementById('gps'))
      chart.setOption(this.gpsOption)
    },
    drawBloodSugar() {
      let xData = [];
      let data = [];
      for(let i = 0; i < this.bloodsuger.length; i++) {
        data.push(this.bloodsuger[i].data);
        xData.push(this.bloodsuger[i].dateTime);
        // xData.push(this.bloodsuger[i].date);
      }
      this.bloodsugerOption.xAxis = {
        type: 'category',
        // type:'time',
        data: xData,
        axisLabel:{ //xAxis，yAxis，axis都有axisLabel属性对象
          show: true, //默认为true，设为false后下面都没有意义了
          // interval:0
        }
      };
      this.bloodsugerOption.yAxis = {
        type: 'value',
        axisLabel: { //xAxis，yAxis，axis都有axisLabel属性对象
          show: true, //默认为true，设为false后下面都没有意义了
        }
      };
      this.bloodsugerOption.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      let tooltip = {
        trigger: 'item',
        formatter:(params) => {
          return `时间：${params.name}</br>血糖：${params.data}`
        }
      };
      this.bloodsugerOption.tooltip = tooltip;
      this.bloodsugerOption.label = {
        show: true,
            position: 'right',
            formatter: '{@value}'
      };
      const chart = this.$echarts.init(document.getElementById('bloodSugar'))
      chart.setOption(this.bloodsugerOption)
    },
    drawCholesterol() {
      let xData = [];
      let tcData=[];
      let hdlData=[];
      let ldlData=[];
      let tgData=[];
      let data = [];
      for(let i = 0; i < this.cholesterol.length; i++) {
        data.push(this.cholesterol[i].data);
        tcData.push(this.cholesterol[i].data==null?0:this.cholesterol[i].data);
        hdlData.push(this.cholesterol[i].hdl==null?0:this.cholesterol[i].hdl);
        ldlData.push(this.cholesterol[i].ldl==null?0:this.cholesterol[i].ldl);
        tgData.push(this.cholesterol[i].tg==null?0:this.cholesterol[i].tg);
        xData.push(this.cholesterol[i].dateTime);
      }
      this.cholesterolOption.legend = {
        x: 'left',
        y: 'bottom',
        padding: [0, 0, 0, 40],
        data: ['总胆固醇值', '高密度脂蛋白', '低密度脂蛋白','甘油三酯']
      };
      this.cholesterolOption.xAxis = {
        // type: 'category',
        data: xData
      };
      this.cholesterolOption.yAxis = {
        type: 'value'
      };
      this.cholesterolOption.series = [{
        name: '总胆固醇值',
        type: 'line',
        smooth: true,
        data: tcData
      },
        {
          name: '高密度脂蛋白',
          type: 'line',
          smooth: true,
          data: hdlData
        },
        {
          name: '低密度脂蛋白',
          type: 'line',
          smooth: true,
          data: ldlData
        },
        {
          name: '甘油三酯',
          type: 'line',
          smooth: true,
          data: tgData
        }
      ];
      let tooltip = {
        trigger: 'axis',
        // formatter:(params) => {
        //   return `时间：${params.name}</br>胆固醇：${params.data}`
        // }
      };
      this.cholesterolOption.tooltip = tooltip;
      this.cholesterolOption.label = {
        show: true,
        position: 'right',
        // formatter: '{@value}'
      };
      const chart = this.$echarts.init(document.getElementById('cholesterol'))
      chart.setOption(this.cholesterolOption)
    },
    drawTemperature() {
      let xData = [];
      let data = [];
      for(let i = 0; i < this.temperature.length; i++) {
        data.push(this.temperature[i].temperature);
        xData.push(this.temperature[i].dateTime);
      }
      this.temperatureOption.xAxis = {
        // type: 'category',
        data: xData
      };
      this.temperatureOption.yAxis = {
        type: 'value',
        min: 30
      };
      this.temperatureOption.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      // this.temperatureOption.dataZoom = [
      //   {
      //     type: "slider",
      //     realtime: true, //拖动滚动条时是否动态的更新图表数据
      //     height: 10, //滚动条高度
      //     start: 0, //滚动条开始位置（共100等份）
      //     end: 20 //结束位置（共100等份）
      //   }
      // ];
      let tooltip = {
        trigger: 'item',
        formatter:(params) => {
          return `时间：${params.name}</br>温度：${params.data}`
        }
      };
      this.temperatureOption.tooltip = tooltip;
      this.temperatureOption.label = {
        show: true,
        position: 'right',
        formatter: '{@value}'
      };
      const chart = this.$echarts.init(document.getElementById('temperature'))
      chart.setOption(this.temperatureOption)
    },
    drawUriAcid(){
      let xData = [];
      let data = [];
      for(let i = 0; i < this.uriAcid.length; i++) {
        data.push(this.uriAcid[i].data);
        xData.push(this.uriAcid[i].dateTime);
      }
      this.uriAcidOption.xAxis = {
        // type: 'category',
        data: xData
      };
      this.uriAcidOption.yAxis = {
        type: 'value',
        min: 36
      };
      this.uriAcidOption.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      let tooltip = {
        trigger: 'item',
        formatter:(params) => {
          return `时间：${params.name}</br>尿酸：${params.data}`
        }
      };
      this.uriAcidOption.tooltip = tooltip;
      this.uriAcidOption.label = {
        show: true,
        position: 'right',
        formatter: '{@value}'
      };
      const chart = this.$echarts.init(document.getElementById('uriAcid'))
      chart.setOption(this.uriAcidOption)
    },
    drawBloodPressure() {
      let xData = [];
      let pulseData = [];
      let sbpData = [];
      let dbpData = [];
      for(let i = 0; i < this.bloodpressure.length; i++) {
        pulseData.push(this.bloodpressure[i].pulse);
        sbpData.push(this.bloodpressure[i].sbp);
        dbpData.push(this.bloodpressure[i].dbp);
        xData.push(this.bloodpressure[i].dateTime);
      }
      this.bloodpressureOption.tooltip = {
        trigger: 'axis'
      };
      this.bloodpressureOption.legend = {
        x: 'left',
        y: 'bottom',
        padding: [0, 0, 0, 40],
        data: ['pulse', 'sbp', 'dbp']
      };
      this.bloodpressureOption.xAxis = {
        data: xData
      };
      this.bloodpressureOption.yAxis = {
        type: 'value'
      };
      this.bloodpressureOption.series = [
        {
          name: 'pulse',
          type: 'line',
          smooth: true,
          data: pulseData
        },
        {
          name: 'sbp',
          type: 'line',
          smooth: true,
          data: sbpData
        },
        {
          name: 'dbp',
          type: 'line',
          smooth: true,
          data: dbpData
        }
      ];
      this.bloodpressureOption.label = {
        show: true,
        position: 'right',
        // formatter: '{@value}'
      };
      const chart = this.$echarts.init(document.getElementById('bloodpressure'))
      chart.setOption(this.bloodpressureOption)
    },
    drawEeg() {
      this.eegtype=this.eeg[0].type
      this.loading = false;
      let xData = [];
      let channel1 = [];
      let channel2 = [];
      let channel3 = [];
      let channel4 = [];
      let channel5 = [];
      let channel6 = [];
      let channel7 = [];
      let channel8 = [];
      let channel9 = [];
      let channel10 = [];
      let channel11 = [];
      let channel12 = [];
      let channel13 = [];
      let channel14 = [];
      let channel15 = [];
      let channel16 = [];

      for(let i = 0; i < this.eeg.length; i++) {
        xData.push(this.eeg[i].dateTime);
        let channelData = this.eeg[i].data.split(",");
        channel1.push(channelData[0]);
        channel2.push(channelData[1]);
        channel3.push(channelData[2]);
        channel4.push(channelData[3]);
        channel5.push(channelData[4]);
        channel6.push(channelData[5]);
        channel7.push(channelData[6]);
        channel8.push(channelData[7]);
        channel9.push(channelData[8]);
        channel10.push(channelData[9]);
        channel11.push(channelData[10]);
        channel12.push(channelData[11]);
        channel13.push(channelData[12]);
        channel14.push(channelData[13]);
        channel15.push(channelData[14]);
        channel16.push(channelData[15]);
      };
      this.drawEeg1(xData, channel1);
      this.drawEeg2(xData, channel2);
      this.drawEeg3(xData, channel3);
      this.drawEeg4(xData, channel4);
      this.drawEeg5(xData, channel5);
      this.drawEeg6(xData, channel6);
      this.drawEeg7(xData, channel7);
      this.drawEeg8(xData, channel8);
      this.drawEeg9(xData, channel9);
      this.drawEeg10(xData, channel10);
      this.drawEeg11(xData, channel11);
      this.drawEeg12(xData, channel12);
      this.drawEeg13(xData, channel13);
      this.drawEeg14(xData, channel14);
      this.drawEeg15(xData, channel15);
      this.drawEeg16(xData, channel16);

      // this.eegOption.tooltip = {
      //   trigger: 'axis'
      // };
      // this.eegOption.legend = {
      //   x: 'left',
      //   y: 'bottom',
      //   padding: [20, 0, 0, 40],
      //   data: ['channel1', 'channel2', 'channel3', 'channel4', 'channel5', 'channel6', 'channel7', 'channel8']
      // };
      // this.eegOption.xAxis = {
      //   data: xData
      // };
      // this.eegOption.yAxis = {
      //   type: 'value'
      // };
      // this.eegOption.series = [
      //   {
      //     name: 'channel1',
      //     type: 'line',
      //     smooth: true,
      //     data: channel1,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel2',
      //     type: 'line',
      //     smooth: true,
      //     data: channel2,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel3',
      //     type: 'line',
      //     smooth: true,
      //     data: channel3,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel4',
      //     type: 'line',
      //     smooth: true,
      //     data: channel4,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel5',
      //     type: 'line',
      //     smooth: true,
      //     data: channel5,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel6',
      //     type: 'line',
      //     smooth: true,
      //     data: channel6,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel7',
      //     type: 'line',
      //     smooth: true,
      //     data: channel7,
      //     showSymbol: false
      //   },
      //   {
      //     name: 'channel8',
      //     type: 'line',
      //     smooth: true,
      //     data: channel8,
      //     showSymbol: false
      //   }
      // ];
      // // this.eegOption.label = {
      // //   show: true,
      // //   position: 'right',
      // //   formatter: '{@value}'
      // // };
      // const chart = this.$echarts.init(document.getElementById('eeg'))
      // chart.setOption(this.eegOption)
    },
    handlerData(data){  //处理eeg数据
       data.forEach(item=>{
        this.eegXdata.push(item.dateTime)
        this.channel1Data.push(item.data[0])
        this.channel2Data.push(item.data[1])
        this.channel3Data.push(item.data[2])
        this.channel4Data.push(item.data[3])
        this.channel5Data.push(item.data[4])
        this.channel6Data.push(item.data[5])
        this.channel7Data.push(item.data[6])
        this.channel8Data.push(item.data[7])
         if(item.type==16){
           this.channel9Data.push(item.data[8])
           this.channel10Data.push(item.data[9])
           this.channel11Data.push(item.data[10])
           this.channel12Data.push(item.data[11])
           this.channel13Data.push(item.data[12])
           this.channel14Data.push(item.data[13])
           this.channel15Data.push(item.data[14])
           this.channel16Data.push(item.data[15])
         }
      })
      this.drawEeg1(this.eegXdata,this.channel1Data);
      this.drawEeg2(this.eegXdata,this.channel2Data);
      this.drawEeg3(this.eegXdata,this.channel3Data);
      this.drawEeg4(this.eegXdata,this.channel4Data);
      this.drawEeg5(this.eegXdata,this.channel5Data);
      this.drawEeg6(this.eegXdata,this.channel6Data);
      this.drawEeg7(this.eegXdata,this.channel7Data);
      this.drawEeg8(this.eegXdata,this.channel8Data);
      this.drawEeg9(this.eegXdata,this.channel9Data);
      this.drawEeg10(this.eegXdata,this.channel10Data);
      this.drawEeg11(this.eegXdata,this.channel11Data);
      this.drawEeg12(this.eegXdata,this.channel12Data);
      this.drawEeg13(this.eegXdata,this.channel13Data);
      this.drawEeg14(this.eegXdata,this.channel14Data);
      this.drawEeg15(this.eegXdata,this.channel15Data);
      this.drawEeg16(this.eegXdata,this.channel16Data);

    },
    drawEeg1(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg1'))
      chart.setOption(eeg1Option)
    },
    drawEeg2(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg2'))
      chart.setOption(eeg1Option)
    },
    drawEeg3(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg3'))
      chart.setOption(eeg1Option)
    },
    drawEeg4(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100//结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg4'))
      chart.setOption(eeg1Option)
    },
    drawEeg5(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg5'))
      chart.setOption(eeg1Option)
    },
    drawEeg6(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg6'))
      chart.setOption(eeg1Option)
    },
    drawEeg7(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg7'))
      chart.setOption(eeg1Option)
    },
    drawEeg8(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg8'))
      chart.setOption(eeg1Option)
    },
    drawEeg9(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg9'))
      chart.setOption(eeg1Option)
    },
    drawEeg10(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg10'))
      chart.setOption(eeg1Option)
    },
    drawEeg11(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg11'))
      chart.setOption(eeg1Option)
    },
    drawEeg12(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg12'))
      chart.setOption(eeg1Option)
    },
    drawEeg13(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg13'))
      chart.setOption(eeg1Option)
    },
    drawEeg14(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg14'))
      chart.setOption(eeg1Option)
    },
    drawEeg15(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100 //结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg15'))
      chart.setOption(eeg1Option)
    },
    drawEeg16(xData, data) {
      let eeg1Option = {};
      eeg1Option.xAxis = {
        // type: 'category',
        data: xData
      };
      eeg1Option.yAxis = {
        type: 'value',
      };
      eeg1Option.series = [{
        data: data,
        type: 'line',
        smooth: true
      }];
      eeg1Option.dataZoom = [
        {
          type: "slider",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          height: 20, //滚动条高度
          start: 0, //滚动条开始位置（共100等份）
          end: 100,//结束位置（共100等份）
        }
      ];
      const chart = this.$echarts.init(document.getElementById('eeg16'))
      chart.setOption(eeg1Option)
    },
    eegReset() {
      this.eegXdata = []
      this.channel1Data = []
      this.channel2Data = []
      this.channel3Data = []
      this.channel4Data = []
      this.channel5Data = []
      this.channel6Data = []
      this.channel7Data = []
      this.channel8Data = []
      this.channel9Data=[]
      this.channel10Data=[]
      this.channel11Data=[]
      this.channel12Data=[]
      this.channel13Data=[]
      this.channel14Data=[]
      this.channel15Data=[]
      this.channel16Data=[]
    },
    //获取血糖
    async getBloodSuger(token, startDate, endDate) {
      //
       let totalBloodSuger=[]
      const res1 = await getBloodSuger(token, this.phone, startDate, endDate, 1, 100, 1)
      // console.log("历史数据",res1)
      const res2 = await getBloodSugerNew(token, this.phone, endDate, 1, 100)
      // console.log("最新数据",res2)
      //拼接
      totalBloodSuger=[...res2,...res1]
      //排序
      totalBloodSuger.sort((a,b)=>{
        return b.id-a.id
      })
      // console.log("总数据",totalBloodSuger)
      this.bloodsuger=totalBloodSuger
      this.drawBloodSugar()
    },
    //获取血压
    async getUserBp(token, startDate, endDate) {
      let totalBp=[]
      const res1 = await getUserBp(token, this.phone, startDate, endDate, 1, 100, 1)
      console.log("历史血压",res1)
      const res2 = await getUserBp(token, this.phone, startDate, endDate, 1, 100, 0)
      console.log("最新血压",res1)
      //拼接
      totalBp=[...res2,...res1]
      //排序
      totalBp.sort((a,b)=>{
        return b.id-a.id
      })
      this.bloodpressure=totalBp
      this.drawBloodPressure()
      console.log("总数据",totalBp)
    },
    //总胆固醇
    async getUserTc(token, startDate, endDate) {
      let totalTc=[]
      const res1 = await getUserTc(token, this.phone, startDate, endDate, 1, 100, 1)
      console.log("历史胆固醇",res1)
      const res2 = await getUserTc(token, this.phone, startDate, endDate, 1, 100, 0)
      console.log("最新胆固醇",res1)
      //拼接
      totalTc=[...res2,...res1]
      //排序
      totalTc.sort((a,b)=>{
        return b.id-a.id
      })
      this.cholesterol=totalTc
      this.drawCholesterol()
      console.log("总数据",totalTc)
    },
    //温度
    async getUserTemperature(token, startDate, endDate) {
      let totalTemperature=[]
      const res1 = await getUserTemperature(token, this.phone, startDate, endDate, 1, 20, 1)
      console.log("历史温度",res1)
      const res2 = await getUserTemperature(token, this.phone, startDate, endDate, 1, 20, 0)
      console.log("最新温度",res1)
      //拼接
      totalTemperature=[...res2,...res1]
      //排序
      totalTemperature.sort((a,b)=>{
        return b.id-a.id
      })
      this.temperature=totalTemperature
      this.drawTemperature()
      console.log("总数据",totalTemperature)
    },
    //尿酸
    async getUserTg(token, startDate, endDate) {
      let totalTg=[]
      const res1 = await getUserTg(token, this.phone, startDate, endDate, 1, 100, 1)
      console.log("历史温度",res1)
      const res2 = await getUserTg(token, this.phone, startDate, endDate, 1, 100, 0)
      console.log("最新温度",res1)
      //拼接
      totalTg=[...res2,...res1]
      //排序
      totalTg.sort((a,b)=>{
        return b.id-a.id
      })
      this.uriAcid=totalTg
      this.drawUriAcid()
      console.log("总数据",totalTg)
    },
    //gps
    async getUserGps(token, startDate, endDate) {
      let totalGps=[]
      const res1 = await getUserGps(token, this.phone, startDate, endDate, 1, 20, 1)
      console.log("历史gps",res1)
      const res2 = await getUserGps(token, this.phone, startDate, endDate, 1, 20, 0)
      console.log("最新gps",res1)
      //拼接
      totalGps=[...res2,...res1]
      //排序
      totalGps.sort((a,b)=>{
        return b.id-a.id
      })
      this.gps=totalGps
      this.gpsPage.total=totalGps.length
      // this.drawUriAcid()
      console.log("总数据",totalGps)
    },

    searchWear(){
      console.log("查询",this.searchDate,this.phone)
      if(this.searchDate==null){
        this.$message.error("请选择查询时间！")
        return
      }
      if(this.phone.length==null){
        this.$message.error("请输入查询手机号！")
        return
      }
      let startDate=this.searchDate[0]+' 00:00:00'
      let endDate=this.searchDate[1]+' 23:59:59'
      this.eegReset()
      getToken().then(token=>{  //获取token
        this.getBloodSuger(token,startDate,endDate)
        this.getUserBp(token,startDate,endDate)
        this.getUserTg(token,startDate,endDate)
        this.getUserGps(token,startDate,endDate)
        this.getUserTc(token,startDate,endDate)
        this.getUserTemperature(token,startDate,endDate)
        this.SearchEeg(token,1,startDate,endDate)
      })



    },
    //获取eeg信息
    SearchEeg(token,page,startDate,endDate){
      console.log("eeg获取")
      // let startDate=this.searchDate[0]+' 00:00:00'
      // let endDate=this.searchDate[1]+' 00:00:00'
      // this.timer8 = setInterval(()=> {
      //   getToken().then(token=>{
          getUserEeg( token,this.phone,startDate,endDate,page,100,1).then(res => {
            console.log("eeg",res)
            if(res.data.rows.length!==0){  //有数据，处理，并继续申请
              this.handlerData(res.data.rows)
              this.SearchEeg(token,page+1,startDate,endDate);//继续查询
              // const newArr1 = res.map((item) => item.data[0]);
              // this.yArr1.push(...newArr1);
              // const newArr2 = res.data.msg.rows.map((item) => item.data[1]);
              // this.yArr2.push(...newArr2);
              // const newArr3 = res.data.msg.rows.map((item) => item.data[2]);
              // this.yArr3.push(...newArr3);
              // const newArr4 = res.data.msg.rows.map((item) => item.data[3]);
              // this.yArr4.push(...newArr4);
              // const newArr5 = res.data.msg.rows.map((item) => item.data[4]);
              // this.yArr5.push(...newArr5);
              // const newArr6 = res.data.msg.rows.map((item) => item.data[5]);
              // this.yArr6.push(...newArr6);
              // const newArr7 = res.data.msg.rows.map((item) => item.data[6]);
              // this.yArr7.push(...newArr7);
              // const newArr8 = res.data.msg.rows.map((item) => item.data[7]);
              // this.yArr8.push(...newArr8);
            }else if (res.data.errorCode==201){//
              // 重新请求token
              getToken().then(token=>{
                this.SearchEeg(token,page+1)
              })
              //终止
            }else{
              return
            }

          })
        // })

      // }, 100);

    }
  },
  created() {
    this.pid = this.$route.query.pid + "";
  },
  mounted() {
    let pid = this.pid;
    this.$store.commit("startLoading");
    getPatientsDetails(pid).then((res) => {
      this.patientInfo.API_basicInfo = res;
      this.$store.commit("endLoading");
    });
    this.getChuyuanApplyFlag(pid);
    // getGpsInfo().then(res => {
    //   this.gps = res.data.data;
    //   // this.drawGps();
    // });
    // getTypeInfo(1).then(res => {
    //   this.bloodsuger = res.data.data;
    //   console.log(this.bloodsuger)
    //   this.drawBloodSugar();
    // });
    // getTypeInfo(2).then(res => {
    //   console.log("总胆固醇信息",res)
    //   this.cholesterol = res.data.data;
    //   this.drawCholesterol();
    // });
    // getTypeInfo(3).then(res => {
    //   this.temperature = res.data.data;
    //   this.drawTemperature()
    // });
    // //尿酸信息获取
    // getTypeInfo(4).then(res => {
    //   console.log("尿酸信息",res.data.data)
    //   this.uriAcid = res.data.data;
    //   this.drawUriAcid()
    // });
    // getBloodPressureInfo().then(res => {
    //   console.log("血压信息",res)
    //   this.bloodpressure = res.data.data;
    //   this.drawBloodPressure();
    // });
    let tempDate = new Date() // 获取今天的日期
    let startDate=tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()+" 00:00:00"
    // tempDate.setDate(tempDate.getDate() +1) // 今天的前N天的日期，N自定义
    let endDate = tempDate.getFullYear() + "-" + (tempDate.getMonth() + 1) + '-' + tempDate.getDate()+" 23:59:59"
    // console.log(endDate)
    console.log("时间",startDate,endDate)
    this.searchDate=[startDate,endDate]
    getToken().then(token=>{  //获取token
      this.getBloodSuger(token,startDate,endDate)
      this.getUserBp(token,startDate,endDate)
      this.getUserTg(token,startDate,endDate)
      this.getUserGps(token,startDate,endDate)
      this.getUserTc(token,startDate,endDate)
      this.getUserTemperature(token,startDate,endDate)
      // this.SearchEeg(token,1)
      // this.SearchEeg(token,1,startDate,endDate)

    })
    getEggInfo().then(res => {
      console.log("eeg数据",res)
      this.eeg = res.data.data;
      this.drawEeg();
    });
    // {
    //   "appId": "3b4ffa83ab9119e4",
    //     "Access_token": "gVTIOPJ3JT8Rd4Pm48FVrKeSfni7q2jamHmGgtd7zHGnlP9TUmfH3te3jS6k2yna1Xt3vFn4AH29sYvgfP3XLSpMJ70l9I51H62D7iby1B4O7GG9PFFN65tGZTS3h3V4xMb9Ge7hH1hJ1R88oYG5ylVeaOxfG6wF3FN99t1187xng75ZRt783MgmK5U4XUnEe5TtgR1bBQXfXfh1Cyz02llO3d4jMFzPevX0JFg0B17WUv1I89w466O4T14InOeA",
    //     "Phone": "17387512145",
    //     "StartDate":"2022-05-01 00:00:00",
    //     "EndDate":"2022-07-01 00:00:00",
    //     "pageNo":1,
    //     "pageSize":10000
    // }
    // getToken("3b4ffa83ab9119e4", "88c79c62d8e021ab867222ce899a9f43").then(res => {
    //   getEggInfo("3b4ffa83ab9119e4", res.access_token, "17387512145", "2022-05-01 00:00:00", "2022-07-01 00:00:00", 1, 4000).then(response => {
    //     console.log(response)
    //     this.eeg = response.data.rows;
    //     this.drawEeg();
    //   })
    // })
  },
};
</script>

<style scoped lang="scss">
.wearable {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .titleInfo {
    margin-left: 50px;
    color: #1c7e7c;
    font-size: 18px;
    margin-bottom: -30px;
  }
  .formLabel {
    font-size: 16px;
    color: #1c7e7c;
  }
}
.pageContent {
  width: 95%;
  height: 100%;
  margin: 20px auto;
  .title {
    font-size: 20px;
    color: #1c7e7c;
  }
  .btn {
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-right: 50px;
    width: 120px;
  }
}
.clearfix:after {
  content: ""; /*设置内容为空*/
  height: 0; /*高度为0*/
  line-height: 0; /*行高为0*/
  display: block; /*将文本转为块级元素*/
  visibility: hidden; /*将元素隐藏*/
  clear: both; /*清除浮动*/
}
.drag {
  width: 300px;
  position: absolute;
  top: 30%;
  left: calc(50% - 150px);
  span {
    z-index: 100;
    position: absolute;
    top: 0px;
    right: 10px;
    color: white;
    cursor: pointer;
  }
}
.container {
  width: 95%;
  margin: auto;
  .search {
    .formLabel {
      font-size: 20px;
      color: #1c7e7c;
    }
    .addbtn {
      margin-left: 20px;
      width: 90px;
    }
  }
  .page {
    width: 95%;
    .block {
      float: right;
    }
  }
  .pinggu {
    margin-right: 20px;
    font-size: 18px;
    .pinggubiao {
      transition: 1s;
    }
  }
}
.addprescription {
  margin-top: 20px;
  font-size: 18px;
}

.inputBox {
  position: fixed;
  left: 240px;
  bottom: 0px;
  width: calc(95% - 240px);
  z-index: 3000;
  transition: 0.5s;
}

.tips {
  margin-top: 20px;
  font-size: 18px;
}
.reference {
  max-height: 500px;
  overflow: auto;
}
</style>
