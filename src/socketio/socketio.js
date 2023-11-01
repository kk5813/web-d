import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import Vue from "vue";
import socketMsgDeal from "./msgDeal.js";
const socket = io("http://localhost:3000");
// const socket = io('https://www.nowhealth.top:3000');

let reconnectFlag = "";

socket.addEventListener("disconnect", data => {
  console.log("socket断开", data);
  //重连
  reconnectFlag = setInterval(() => {
    console.log("重连");
    socket.connect();
  }, 1000);
});

socket.addEventListener("connect", data => {
  //console.log("socket连接", data);
  if (reconnectFlag) {
    clearInterval(reconnectFlag);
  }
  if (localStorage.getItem("token")) {
    socket.emit("login", localStorage.getItem("UserID"));
  }
});

for (let key in socketMsgDeal) {
  socket.addEventListener(key, socketMsgDeal[key]);
}

Vue.use(VueSocketIOExt, socket);

export default socket;
