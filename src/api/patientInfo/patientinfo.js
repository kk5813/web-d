import {
  Get,
  Post,
  Delete,
  FileLoad,
  download,
  Put
} from "../../http/request.js";
import store from "../../store/index.js";
import { Message } from "element-ui";
import router from "../../router/index.js";

// 获取相关患者列表
export function getPatientList() {
  // console.log("我的患者查询")
  return Post("/api/patientinfo/patientlist", {
    page: 2,
    pagesize: 10
  }).then(res => {
    // console.log("我的患者查询",typeof res.data.Patient_info1)
    console.log("我的患者查询", res);
    let totalPatient;
    if (typeof res.data.Patient_info1 != "string") {
      console.log("1");
      res.data.Patient_info1.forEach(item => {
        if (item.NewDiagnosis == undefined || item.NewDiagnosis == null) {
          item.NewDiagnosis = "";
        }
      });
      totalPatient = [...res.data.Patient_info1, ...res.data.Patient_info2];
    } else {
      console.log("2");
      totalPatient = res.data.Patient_info2;
    }
    console.log("患者查询", res.data.Patient_info1);
    const temp = new Map();
    //去除重复项
    totalPatient = totalPatient.filter(
      arr => !temp.has(arr.PatientID) && temp.set(arr.PatientID, arr.PatientID)
    );
    // console.log(totalPatient)
    return totalPatient;
  });
}
//我的患者列表
export function getMyPatientList(page, pagesize, data) {
  let obj = {};
  if (data.name != null) {
    if (data.name.length == 0) {
      data.name = null;
    }
  }
  obj = {
    type: data.type,
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization,
    iphone: data.iphone
  };

  // console.log("我的患者查询123===========",obj)
  return Post(`/api/patientinfo/patientlist`, {
    type: data.type,
    page: page,
    pagesize: pagesize,
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization,
    iphone: data.iphone
  }).then(res => {
    // console.log("添加的患者列表",res)
    return res.data.Patient_info;
  });
}
//我的患者模块总数
export function getPatientListSum(data) {
  console.log("查询==================", data);
  if (data.name != null) {
    if (data.name.length == 0) {
      data.name = null;
    }
  }

  return Post(`/api/patientinfo/addPatientListSum1`, {
    type: data.type,
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization,
    iphone: data.iphone
  }).then(res => {
    // console.log("我的患者",res)
    return res.data.sum;
  });
}
// 获取添加的患者列表
export function getAddPatientList(page, pagesize, data) {
  let obj = {};
  if (data.name != null) {
    if (data.name.length == 0) {
      data.name = null;
    }
  }
  obj = {
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization,
    importname: data.importname,
    startDate: data.startDate,
    endDate: data.endDate,
    iphone: data.Phone
  };

  console.log("新增动态查询", obj);
  return Post(`/api/patientinfo/addPatientList`, {
    page: page,
    pagesize: pagesize,
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization,
    importname: data.importname,
    startDate: data.startDate,
    endDate: data.endDate,
    iphone: data.Phone
  }).then(res => {
    // console.log("新增患者列表",res)
    return res.data.Patient_info;
  });
}
//获取新增患者总数
export function getAddPatientListSum(data) {
  // console.log("查询==================",data)
  if (data.name != null) {
    if (data.name.length == 0) {
      data.name = null;
    }
  }
  return Post(`/api/patientinfo/addPatientListSum`, {
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization,
    importname: data.importname,
    startDate: data.startDate,
    endDate: data.endDate,
    iphone: data.Phone
  }).then(res => {
    // console.log("新增患者总数",res)
    return res.data.sum;
  });
}
//动态查询新增患者列表/addPatientList/search
export function searchAddPatientList(data) {
  // console.log("查询数据",data)
  if (data.name != null) {
    if (data.name.length == 0) {
      data.name = null;
    }
  }

  let obj = {
    surName: data.surName, //姓氏
    gender: data.gender, //性别
    minyear: data.minyear == undefined ? null : data.minyear, //最小年龄
    maxyear: data.maxyear == undefined ? null : data.maxyear, //最大年龄
    Address: data.Address, //住址
    NewDiagnosis: data.NewDiagnosis, //初诊,
    name: data.name, //姓名
    organization: data.organization
  };
  // if(data.surName!=null){
  //     if(data.surName.length!=0){
  //         obj.surName=data.surName
  //     }
  // }
  // if(data.gender!=null){
  //     obj.gender=data.gender
  // }
  // if(data.minAge!=null){
  //     obj.minAge=data.minAge
  // }
  // if(data.maxAge!=null){
  //     obj.maxAge=data.maxAge
  // }
  // if(data.Address!=null){
  //     obj.Address=data.Address
  // }
  // if(data.NewDiagnosis!=null){
  //     obj.NewDiagnosis=data.NewDiagnosis
  // }
  // if(data.name!=null){
  //     obj.name=data.name
  // }
  // if(data.organization!=null){
  //     obj.organization=data.organization
  // }
  console.log("查询对象", obj);
  return Post("/api/patientinfo/addPatientList/search", obj).then(res => {
    console.log("列表查询", res.data);
    return res.data.Patient_info;
  });
}
//根据患者账号获取患者基本信息
export function getPatientBasicInfo(account) {
  return Get("/api/patientinfo/getPatientList/" + account, account).then(
    res => {
      console.log(res);
      return res.data.patientinfo;
    }
  );
}

//导出新增患者
export function getAddPatientListAll() {
  return Post(`/api/patientinfo/addPatientListAll`).then(res => {
    console.log("导出患者", res);
    return res.data.Patient_info;
  });
}

//编辑患者信息
export function updatePatient(data) {
  let editInfo = {
    UserID: data.UserID,
    Name: data.name,
    Gender: data.gender,
    Birthday: data.birthday,
    Address: data.address || "无",
    Job: data.job || "无",
    Phone: data.tel || "无",
    IdentityID: data.IdCard || "无",
    NewDiagnosis: data.NewDiagnosis || "无"
  };
  return Post("/api/patientinfo/editPatient", editInfo).then(res => {
    console.log(res);
    if (res.data.status == 200) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  });
}
//根据患者账号删除患者
export function deletePatient(account) {
  return Get("/api/patientinfo/deleteorPatientlist/" + account, account).then(
    res => {
      console.log("删除患者返回", res);
      if (res.data.status == 200) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }
  );
}

// 获取患者历史病历信息
export function getPatientHistory(account) {
  return Get("/api/patientinfo/patienthistory/" + account).then(res => {
    res.data.patient_info.sort((a, b) => {
      let t1 = new Date(a.date);
      let t2 = new Date(b.date);
      return t2 - t1;
    });
    console.log(res);
    return res.data.patient_info;
  });
}

// 获取患者历史病历信息
export function getPatientHistoryInfo(account) {
  return Get("/api/patientinfo/addPatientList/DiagRecord/" + account).then(
    res => {
      // console.log(res.data)
      return res.data;
    }
  );
}

// 添加新患者
export function addNewPatient(data) {
  let newPatient = {
    Name: data.name,
    Gender: data.gender,
    Birthday: data.birthday,
    Phone: data.tel || "无",
    IdentityID: data.IdCard || "无",
    Address: data.address || "无",
    Job: data.job || "无",
    NewDiagnosis: data.NewDiagnosis || "无"
  };
  return Post("/api/patientinfo/addPatient", newPatient).then(res => {
    console.log("添加患者返回", res);
    if (res.data.status == 200) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  });
}

// 创建新的病历
export function addBingli(data, patient) {
  let newBingli = {
    diagTime: data.date, //就诊时间
    date: data.date, //就诊时间
    API_illState: {
      API_description: data.state
    },
    API_history: {
      //患者历史（家族史，过敏史，过往史）
      API_familyHistory: data.history.jiazu,
      API_allergyHistory: data.history.guoming,
      API_patientistory: data.history.jiwang
    },
    API_examination: data.jianchajieguo,
    expertName: data.expert, //专家的名字
    patientName: patient.name, //患者的名字
    patientUserID: patient.userID, //患者的ID

    isToHospital: data.shifouzhuyuan, //是否需要住院 1表示需要，0表示不需要
    API_diagInfo: {
      API_diagResult: data.zhenduanjielun, //诊断结果
      API_treatment: {
        API_description: data.zhiliaofangan.text, //治疗方案
        API_prescription: data.zhiliaofangan.chufang
      }
    }
  };
  return Post("/api/patientinfo/addPatientList/addDiagRecord", newBingli).then(
    res => {
      console.log(res);
      if (res.data) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }
  );
}

//提交每日护理记录
export function postNursingLogs(pid, data, time) {
  let nursingLog = {
    API_newNursingLog: data,
    nursingTime: time || data.date
  };
  console.log(nursingLog);
  return Post("/api/patientinfo/newnursinglog/" + pid, nursingLog).then(res => {
    return Promise.resolve(true);
  });
}

//提交评估记录
export function postPingguLogs(pid, data, time) {
  data.assessmentTime = time || data.data.time || Date.now();
  return Post("/api/patientinfo/pinggu/" + pid, data).then(res => {
    return Promise.resolve(true);
  });
}

// 提交新的治疗记录
// 入院和日常的尚未分开
export function postTreatLogs(pid, data, time) {
  if (
    data.API_patientState.length == 0 ||
    data.API_treatment.length == 0 ||
    data.API_description.length == 0
  ) {
    return Promise.resolve(false);
  }
  let newTreatLog = {
    API_date: time || data.time || Date.now(),
    API_patientState: data.API_patientState || [],
    API_treatment: data.API_treatment || [],
    API_prescription: data.API_prescription || []
  };
  return Post("/api/patientinfo/treatmentlog/" + pid, newTreatLog).then(res => {
    return Promise.resolve(true);
  });
}

// 提交患者出院记录
export function endPatientTreat(pid, data, time) {
  let newChuyuan = {
    diagResult: data.diagResult,
    treatLogs: data.treatLogs,
    notes: data.notes,
    endtreatmentDate: time || data.time || Date.now(),
    prescription: data.prescription || []
  };

  return Post("/api/patientinfo/endtreatment/" + pid, newChuyuan).then(res => {
    console.log(res);
    if (res.data.status != 0) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  });
}

// 提交患者随访记录
export function postFollowLog(pid, data) {
  let obj = {
    time: data.data.nextdate,
    name: "随访记录表",
    API_questionnaire: data.data
  };
  return Post("/api/followmanage/patientdetails/" + pid, obj).then(res => {
    console.log(res);
    if (res.data && res.data.status != 0) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  });
}

// 还没有的部分
// 添加会诊记录结论
export function stopGroupConsultation(consultationId, data) {
  data.after = data.after || [];
  data.prescription = data.prescription || [];
  return Post(
    "/api/groupconsultation/endconsultation/" + consultationId,
    data
  ).then(res => {
    console.log(res);
    if (res.data && res.data.status != 0) {
      return true;
    } else {
      return false;
    }
  });
}

// 提交入院治疗方案
export function confirmApply(pid, data, time) {
  if (data.API_patientState.length == 0 || data.API_treatment.length == 0) {
    return Promise.resolve(false);
  }
  let newTreatLog = {
    API_date: time || data.time || Date.now(),
    API_patientState: data.API_patientState || [],
    API_treatment: data.API_treatment || [],
    API_prescription: data.API_prescription || [],
    API_description: data.API_treatment || []
  };
  return Post("/api//patientinfo/before_treatmentlog/" + pid, newTreatLog).then(
    res => {
      console.log(res);
      return Promise.resolve(true);
    }
  );
}

// 提交入院评估
export function postRuyuanPinggu(pid, data, time) {
  data.assessmentTime = time || data.data.time || Date.now();
  console.log(data);
  return Post("/api/patientinfo/before_pinggu/" + pid, data).then(res => {
    console.log(res);
    return Promise.resolve(true);
  });
}

// 查询相似患者
export function possiblePatientSearch(data) {
  // console.log(data);
  let obj = {
    Name: data.name,
    Phone: data.tel
  };
  return Post("/api/patientinfo/addPatient_exist", obj).then(res => {
    if (res.data.status == 200) {
      return res.data.userList.map(item => {
        return {
          PatientName: item.Name || "无",
          PatientID: item.UserID || "无",
          Gender: item.Gender || "无",
          Age: item.Age || "无",
          Phone: item.UserID || "无",
          Address: item.Address || "无",
          IdCard: item.IdentityID || "无",
          Image: item.Image || "无"
        };
      });
    } else {
      return [];
    }
    console.log(res);
    return [];
  });
}
// 获取注册用户信息
export function getRigisterPatientList() {
  return Get("/api/patientinfo/registerList").then(res => {
    console.log("注册患者列表", res);
    return res.data.registerlist;
  });
}
