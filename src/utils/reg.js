// 密码至少包含 数字和英文，长度6-20
const mimareg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;

// 身份证正则
const idreg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 手机号正则
const phonereg = /^1[3-9]\d{9}$/;
export default idreg;
