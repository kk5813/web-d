import idreg from "@utils/reg";

export function validateAccount(rule, value, callback) {
    if (value == "") {
        return callback(new Error("账号不能为空"));
    }
    if (!/^[0-9_-]{6,12}$/.test(value)) {
        return callback(new Error("请输入6-12位数字"));
    } else {
        callback();
    }
};

export function validatePass(rule, value, callback) {
    if (value == "") {
        callback(new Error("请输入密码"));
    } else {
        callback()
    }
};

export function validateName(rule, value, callback) {
    if (value == "") {
        callback(new Error("请输入姓名"));
    } else {
        if (!/^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/.test(value)) {
            callback(new Error("姓名不符合规范"));
        } else {
            callback()
        }
    }
};
// 非空验证
export function spaceValidate(rule, value, callback) {
    console.log(value)
    if (!value) {
        callback(new Error("此处不可为空"));
    }
    if (value == "") {
        callback(new Error("此处不可为空"));
    } else {
        callback()
    }
};
//身份证是否合法
export function isCnNewID  (rule, value, callback) {
  // console.log("tttt",value,callback )
  // if (!value) {
  //   console.log("空")
  //   callback(new Error("此处不可为空"));
  // }
  // if (value == "") {
  //   console.log("空")
  //   callback(new Error("此处不可为空"));
  // } else {
  //   callback()
  // }
  if (idreg.test(value) ){
    callback()
  } else {
    return callback(new Error("身份证格式有误"))
    // console.log('有误')
    // this.isErrorFlag=true
  }
  // let arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子
  // let arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码
  // if (/^\d{17}\d|x$/i.test(value)) {
  //   let sum = 0
  //   let idx;
  //   for (let i = 0; i < value.length - 1; i++) {
  //     // 对前17位数字与权值乘积求和
  //     sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
  //   }
  //   // 计算模（固定算法）
  //   idx = sum % 11;
  //   // 检验第18为是否与校验码相等
  //   if (arrValid[idx] == value.substr(17, 1).toUpperCase()) {
  //     callback()
  //   } else {
  //     console.log("有误")
  //     return callback(new Error("身份证格式有误"))
  //   }
  // } else {
  //   return callback(new Error("身份证格式有误"))
  // }
}
