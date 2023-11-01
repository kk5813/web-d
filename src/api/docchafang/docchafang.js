import { Get, Post } from "../../http/request.js";

//添加患者
export function addNewPatient(newPatient) {
  return Post("/api/operationmanage/addPatient", { newPatient }).then(res => {
    return res.data.status;
  });
}

//获取病人基本信息
export function getPatientsDetails(pid) {
  return Get("/api/operationmanage/patientDetail/" + pid).then((res) => {
    return res.data.patient[0];
  })
}

//添加患者病历信息
export function addPatientInfos(BingLi) {
  return Post("/api/operationmanage/addInfo",{BingLi}).then(res => {
    console.log(res);
    return res.data.status;
  });
}

//获取预约查房列表
export function getReserveList() {
  return Get("/api/operationmanage/myAppointment").then(res => {
    console.log(res);
    return res.data.myappointmentList;
  });
}

//获取住院申请列表
export function getInHospitalList() {
  return Get("/api/operationmanage/doctorApplylist").then(res => {
    return res.data.patientsList;
  });
}

//获取查房护士信息
export function getHospitalNurList() {
  return Get("/api/operationmanage/zhuyuanNurse").then(res => {
    return res.data.nurseList;
  });
}

//为患者分配住院护士
export function zhuyuanNur(obj) {
  return Post(`/api/operationmanage/distribution`,{ obj }).then(res => {
    return res.data;
  });
}

//获取住院患者列表
export function zhuyuanPatientList() {
  return Get(`/api/operationmanage/docPatientlist`).then(res => {
    // console.log(res);
    return res.data.msg;
  });
}

// 提交结束患者治疗
export function endPatientTreat(pid, data) {
  return Post("/api/operationmanage/endtreatment/" + pid, data).then((res) => {
    console.log(res);
    if (res.data.status != 0) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  })

}

//获取医生历史住院患者列表
export function getPatientList() {
  return Get(`/api/operationmanage/yShistorypatientlist`).then(res => {
    return res.data.patientList;
  });
}

//获取远程患者列表
export function getRemoteList() {
  return Get(`/api/operationmanage/ycPatientList`).then(res => {
    return res.data.patient;
  });
}

//获取查房申请列表
export function getChafangApplyList() {
  return Get(`/api/operationmanage/chafangApply`).then(res => {
    return res.data.chafangApplyList;
  });
}

//本地医生同意远程医生查房请求
export function confirmYuanchengChafang(pid) {
  return Post("/api/operationmanage/chafangApplyDeal",{ pid }).then(res => {
    return res;
  });
}

//获取患者就诊记录
export function getPatientDiagRecord(pid) {
  return Get("/api/operationmanage/getInfo/" + pid).then(res => {
    return res.data;
  });
}

