<template>
  <!--
个人信息
  -->
  <div>
    <PatientInfo :patient="patient">
      <el-button v-show="isRecordVedio" slot="btn" type="danger">录制视频</el-button>
      <el-button v-show="isShowVedio" slot="btn" type="primary">查看视频</el-button>
      <el-button v-show="isZhuayun" slot="btn" @click="endTreat" type="danger">结束住院</el-button>
    </PatientInfo>
  </div>
</template>

<script>
export default {
  name: "BasicPersonlInfo",
  props: {
    isRecordVedio: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    isShowVedio: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    isZhuayun: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    prsonalInfo: {
      type: Object,
      default: () => {
        return {
          API_pic:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          API_name: "张三",
          API_gender: "男",
          API_birthday: "1999-0",
          API_address: "四川省成都市",
          API_tel: "19999999999",
          API_date: "2020/7/8",
          API_toHospitalID: "",
        };
      },
    },
  },
  computed: {
    patient() {
      return {
        address: this.prsonalInfo.Address == "undefined"? "无":this.prsonalInfo.API_address || this.prsonalInfo.Address,
        age: this.ageCompute(this.prsonalInfo.birthday) || this.ageCompute(this.prsonalInfo.API_birthday) || "无",
        gender: this.prsonalInfo.gender || this.prsonalInfo.API_gender || "无",
        name: this.prsonalInfo.patientName || this.prsonalInfo.API_name || "无",
        // userId: this.prsonalInfo.API_UserID || "无",
        hospitalId: this.prsonalInfo.tohospitalID || "无",

        pic: this.prsonalInfo.API_pic || "https://www.nowhealth.top:3000/readload?url=chatfile/d3e6d7f98e54794ed784460567eb36bd.png" || "无",
        tel: this.prsonalInfo.telephone || this.prsonalInfo.API_tel || "无"
      };
    },
  },
  methods: {
    endTreat() {
      this.$emit("endTreat");
    },
    startConsultation() {
      this.$emit("startConsultation");
    },
    diagResult() {
      this.$router.push("/operationmanage/diagresult");
    },
    treatResult() {
      this.$router.push("/operationmanage/treatresult");
    },
    startConsultation() {
      this.$emit("startConsultation");
    },
    ageCompute(birthday) {
      if (!birthday) {
        return "暂无";
      } else {
        let str = this.$timeFormat(new Date(birthday)).format("yyyy-MM-DD");
        return this.jsGetAge(str);
      }
    },

    //根据出生日期计算年龄
    jsGetAge(strBirthday) {
      var returnAge;
      var strBirthdayArr = strBirthday.split("-");
      var birthYear = strBirthdayArr[0];
      var birthMonth = strBirthdayArr[1];
      var birthDay = strBirthdayArr[2];
      var d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1;
      var nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0; //同年 则为0岁
      } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay; //日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            var monthDiff = nowMonth - birthMonth; //月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
        }
      }
      return returnAge + ""; //返回周岁年龄
    },

    startCommunication() {
      let flag = true;

      this.$store.state.instantInfo.sessions.forEach((person) => {
        if (person.id == this.prsonalInfo.API_UserID) {
          flag = false;
        }
      });
      if (flag) {
        this.$store.commit("instantInfo/addPerson", {
          id: this.prsonalInfo.API_UserID,
          name: this.prsonalInfo.API_name,
          img: this.prsonalInfo.API_pic,
        });
      } else {
        this.$store.commit(
          "instantInfo/changeCurrentSessionId",
          this.prsonalInfo.API_UserID
        );
      }
      this.$router.push("/instantinfo/message");
    },
  },
};
</script>

<style lang="scss" scoped>
.personalInfo {
  width: 100%;
  display: flex;
  .img {
    width: 170px;
    height: 150px;
    padding-left: 30px;
    padding-right: 20px;
    flex-shrink: 0;
    border-right: 1px solid #d9d9d9;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    margin-left: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 18px;
  }
}
</style>
