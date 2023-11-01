<template>
  <div>
    <!--
      传入数组
      输入也是数组
      type表示输入什么，state diag treat  可能的值
     -->
    <div @click="inputBoxShow" class="My_input">
      <el-input v-model="inputData" type="textarea">  </el-input>
    </div>
<!--    <el-button></el-button>-->

    <SpecialInputBox
      :key="boxKey"
      :data="data"
      :preValue="choose.join('，')"
      ref="InputBox"
      @result="cons($event)"
    ></SpecialInputBox>
  </div>
</template>

<script>
import SpecialInputBox from "./SpecialInputBox.vue";
import {
  getStateOptions,
  getResultOptions,
  getTreatmentOptions,
} from "@api/patientdiag/patientdiag.js";
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    type: {
      type: String,
      default: () => {
        return "state";
        // state diag treat  可能的值
      },
    },
  },
  components: {
    SpecialInputBox,
  },
  data() {
    return {
      boxKey: 1,
      data: [],
      inputData:''
    };
  },
  computed:{
    choose(){
      return this.value
    }
  },
  watch:{
    value:{
      handler(val){
        this.inputData=val.join('，')
        this.inputData=this.inputData.replace(",","，")
      },
      deep:true
    },
    inputData:{
      handler(val){
        this.inputData=this.inputData.replace(",","，")
        let atr=this.inputData.split('，')
        this.$emit("input",atr)
        // console.log("atr",atr)
      },
    }

  },
  methods: {
    inputBoxShow() {
      // if (!this.readonly) {
      //   this.$refs["InputBox"].boxFlag = true;
      // }
    },
    cons(data) {
      let result = data == "" ? [] : data.split("，");
      this.$emit("input", result);
    },
  },
  mounted() {
    switch (this.type) {
      case "state":
        getStateOptions().then((res) => {
          this.data = res;
        });
        break;
      case "diag":
        getResultOptions().then((res) => {
          this.data = res;
        });
        break;
      case "treat":
        getTreatmentOptions().then((res) => {
          this.data = res;
        });
        break;
      default:
    }
  },
};
</script>

<style scoped lang="scss">
.My_input {
  cursor: pointer;
  width: 100%;
  min-height: 60px;
  //padding: 10px;
    //border: 1px solid lightgray;
  border-radius: 5px;
}
</style>
