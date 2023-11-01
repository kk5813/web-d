import axios from "axios";
import { Message, Loading } from "element-ui"; // 导入axios和element-ui库

// 创建Loading服务的变量（已注释掉）
// let Myloading = null

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前执行的操作
    config.retry = 0; // 设置请求重试次数
    config.retryDelay = 5000; // 重试延迟时间
    if (localStorage.getItem("token")) {
      config.headers.Authorization = localStorage.getItem("token"); // 如果有用户令牌，添加到请求头
    }
    // 创建并显示加载指示器（已注释掉）
    // Myloading = Loading.service({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // });
    return config;
  },
  function(error) {
    // 请求错误处理
    Message.error("网络错误"); // 显示网络错误消息
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 在接收到响应后执行的操作
    // 关闭加载指示器（已注释掉）
    // Myloading.close();
    return response;
  },
  function(err) {
    // 失败重传
    let config = err.config; // 获取请求配置
    // 检查是否需要重传
    if (!config || !config.retry) return Promise.reject(err);
    // 设置当前重传次数
    config.__retryCount = config.__retryCount || 0;
    console.log(config.__retryCount);
    // 检查是否达到最大重传次数
    if (config.__retryCount >= config.retry) {
      // 返回错误
      return Promise.reject(err);
    }
    // 重传次数增加
    config.__retryCount += 1;
    // 建立重传定时器
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });
    // 返回重传结果
    return backoff.then(function() {
      return axios(config);
    });
  }
);

export default axios; // 导出axios对象
