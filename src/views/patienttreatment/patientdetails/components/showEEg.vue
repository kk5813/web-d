<template>
  <div  v-show="display" class="confirm-back" >
    <div class="c-content" >
      <div class="c-top">
        <div></div>
        <div class="c-title">
          <span class="c-emphasis-title">
         实时数据展示
        </span>
        </div>
        <el-button @click="hide" class="close" icon="el-icon-close">
        </el-button>
      </div>
      <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center">
        <div style="width: 95%;height: 90%;" id="idName">
<!--          <iframe src="/static/showEeg.html" id="tempHtml"  ref="tempHtml" frameborder="0" style="width: 100%;height: 100%;"></iframe>-->
<!--        <div id="idName"></div>-->
        </div>


      </div>
    </div>
  </div>
</template>

<script >
export default {
  model: {
    prop: "display",
    event: "change",
  },
  props:{
    isEdit:{
      type:Boolean,
      default:false
    },
    isAdd:{
      type:Boolean,
      default: false
    },
    display: Boolean,
    info:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
    };
  },
  computed:{
  },
  watch:{
    display:{
      handler(){
       if (this.display==true){
         this.createIframe(1,1,1)
       } else{
         this.destroyIframe()
       }
      }
    }
  },
  mounted() {
    console.log("挂载");
  },
  methods: {
    hide() {
      this.$emit("change", !this.display);
    },
    cancel() {
      // this.destroyIframe();
      this.hide();
    },
    /**
     * 动态创建iframe
     * @param dom 创建iframe的容器，即在dom中创建iframe。dom能够是div、span或者其它标签。
     * @param src iframe中打开的网页路径
     * @param onload iframe载入完后触发该事件。能够为空
     * @return 返回创建的iframe对象
     */
    createIframe(dom, src, onload){
      console.log("创建推流")
      //在document中创建iframe
          var iframe = document.createElement("iframe");
      // var iframe=document.getElementById("idName")
        //设置iframe的样式
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.margin = '0';
          iframe.style.padding = '0';
          iframe.style.overflow = 'hidden';
          iframe.style.border = 'none';
      iframe.id = "iframe";
        //绑定iframe的onload事件
        //   if(onload && Object.prototype.toString.call(onload) === '[object Function]'){
        //     if(iframe.attachEvent){
        //       iframe.attachEvent('onload', onload);
        //     }else if(iframe.addEventListener){
        //       iframe.addEventListener('load', onload);
        //     }else{
        //       iframe.onload = onload;
        //     }
        //   }
          iframe.src = "/static/showEeg.html";
        //把iframe载入到dom以下
           document.getElementById("idName").appendChild(iframe);
          return iframe;
},
    /**
     * 销毁iframe，释放iframe所占用的内存。
     * @param iframe 须要销毁的iframe对象
     */
     destroyIframe(){
      console.log("销毁推流")
      // window.postMessage("close",'*')
      var iframe = document.getElementById("iframe");
      iframe.contentWindow.getMessageFromParent("close");
      //把iframe指向空白页面，这样能够释放大部分内存。
      iframe.src = 'about:blank';

      try{
        iframe.contentWindow.document.write('');
        iframe.contentWindow.document.clear();
      }catch(e){
        iframe.parentNode.removeChild(iframe);
      }
     //把iframe从页面移除
     //  iframe.src='/static/showEeg.html'
      iframe.parentNode.removeChild(iframe);
    },

      }
    };
</script>

<style lang="scss" scoped>
.confirm-back {
  position: fixed;
  //background: black;
  background-color: rgba($color: #000000, $alpha: 0.5);
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .c-content {
    width:100%;
    height:100%;
    background-color: transparent;
    //background-color: #FFFFFF;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .c-top {
      display: flex;
      justify-content: space-between;
      //align-items: center;
      .c-title{
        //margin-top: 20px;
        .c-normal-title {
          font-size: 14px;
          font-weight: 400;
          color: #A0A0A0;
        }
        .c-emphasis-title{
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 14px;
        }
      }
      .close {
        color: white;
        background-color: #909399;
        border-width: 0px;
        height: 32px;
        width: 32px;
        margin: 0px;
        padding: 0px;
        border-radius: 0px 12px 0px 12px;
      }
      .close:hover {
        //background-color: #019fa6;
      }
    }
  }

}

</style>

