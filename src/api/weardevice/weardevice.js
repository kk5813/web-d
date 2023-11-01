import { Get, Post} from '../../http/request.js'
import store from "../../store";

//获取gps数据/gpsDataAll
export function getGpsInfo() {
    return Get('/api/wearable/gpsDataAll').then(res => {
        return res
    })
}

// 获取血糖1 胆固醇2 温度数据3/wearableDataAll/:type
export function getTypeInfo(type) {
    return Get(`/api/wearable/wearableDataAll/${type}`).then(res => {
        return res
    })
}



//获取血压  /bloodPressureAll
export function getBloodPressureInfo() {
    return Get(`/api/wearable/bloodPressureAll`).then(res => {
        return res
    })
}



//鉴权
// export function getToken(appId, Secret) {
//     return Post(`/wear/Merchant/accessToken`, {
//         appId: appId,
//         Secret: Secret
//     }).then(res => {
//         return res
//     })
// }

//"appId": "3b4ffa83ab9119e4",
//     //     "Access_token": "gVTIOPJ3JT8Rd4Pm48FVrKeSfni7q2jamHmGgtd7zHGnlP9TUmfH3te3jS6k2yna1Xt3vFn4AH29sYvgfP3XLSpMJ70l9I51H62D7iby1B4O7GG9PFFN65tGZTS3h3V4xMb9Ge7hH1hJ1R88oYG5ylVeaOxfG6wF3FN99t1187xng75ZRt783MgmK5U4XUnEe5TtgR1bBQXfXfh1Cyz02llO3d4jMFzPevX0JFg0B17WUv1I89w466O4T14InOeA",
//     //     "Phone": "17387512145",
//     //     "StartDate":"2022-05-01 00:00:00",
//     //     "EndDate":"2022-07-01 00:00:00",
//     //     "pageNo":1,
//     //     "pageSize":10000
//获取egg数据 /eggDataAll
// export function getEggInfo(appId, Access_token, Phone, StartDate, EndDate, pageNo, pageSize) {
export function getEggInfo() {
    // return Post(`/wear/Eeg/userEeg`, {
    //     appId: appId,
    //     Access_token: Access_token,
    //     Phone: Phone,
    //     StartDate: StartDate,
    //     EndDate: EndDate,
    //     pageNo: pageNo,
    //     pageSize: pageSize
    // }).then(res => {
    //     return res
    // })
    return Get(`/api/wearable/eggDataAll`).then(res => {
        return res
    })
}

//获取实时eeg数据
export function getCurrentEeg(pageSize, StartDate) {
    return Post(`/api/wearable/wearableDeviceData`, {
        pageSize: pageSize,
        type: 5,
        StartDate: StartDate
    }).then(res => {
        return res
    })
}

let appId = '3b4ffa83ab9119e4';
let secret = '88c79c62d8e021ab867222ce899a9f43'
//获取token
export function getToken(){
    console.log("获取token")
    return Post(`/wear/Merchant/AccessToken`, {
        appId: appId,
        secret: secret,
    }).then(res => {
        console.log("token",res)
        return res.data.access_token
    })
}
//获取血糖
export function getBloodSuger (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
        // console.log("血糖查询",token)
        return Post(`/wear/bgt/userGlu`, {
            appId: appId,
            Access_token: token,
            Phone: phone,
            StartDate: startDate,
            EndDate: endDate,
            pageNo: pageNo,
            pageSize: pageSize,
            Mode:mode,
            SortAction:'desc',
        }).then(res => {
            // console.log("血糖获取",res)
            return res.data.rows
        })
    // })

}
//获取血糖
export function getBloodSugerNew (token,phone,endDate,pageNo,pageSize){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post(`/wear/bgt/userGlu`, {
        appId: appId,
        Access_token: token,
        Phone: phone,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:0,
        SortAction:'desc',
    }).then(res => {
        console.log("最新血糖获取",res)
        return res.data.rows
    })
    // })

}
//获取胆固醇
export function getUserTc (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post(`/wear/bgt/userTc`, {
        appId: appId,
        Access_token: token,
        Phone: phone,
        StartDate: startDate,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:mode,
        SortAction:'desc',
    }).then(res => {
        console.log("胆固醇获取",res)
        return res.data.rows
    })
    // })
}
//获取温度
export function getUserTemperature (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post(`/wear/smartClothing/userTemperature`, {
        appId: appId,
        Access_token: token,
        Phone: phone,
        StartDate: startDate,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:mode,
        SortAction:'desc',
    }).then(res => {
        console.log("温度获取",res)
        return res.data.rows
    })
    // })
}
//获取血压信息
export function getUserBp (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post(`/wear/bgt/userBp`, {
        appId: appId,
        Access_token: token,
        Phone: phone,
        StartDate: startDate,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:mode,
        SortAction:'desc',
    }).then(res => {
        console.log("血压获取",res)
        return res.data.rows
    })
    // })
}
//获取尿酸信息
export function getUserTg (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post(`/wear/bgt/userTg`, {
        appId: appId,
        Access_token: token,
        Phone: phone,
        StartDate: startDate,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:mode,
        SortAction:'desc',
    }).then(res => {
        console.log("尿酸",res)
        return res.data.rows
    })
    // })
}
//获取gps信息
export function getUserGps (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post(`/wear/SmartClothing/userGps`, {
        appId: appId,
        Access_token: token,
        Phone: phone,
        StartDate: startDate,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:mode,
        SortAction:'desc',
    }).then(res => {
        console.log("gps",res)
        return res.data.rows
    })
    // })
}
//获取eeg信息
export function getUserEeg (token,phone,startDate,endDate,pageNo,pageSize,mode){
    // getToken().then(token=>{
    // console.log("血糖查询",token)
    return Post('/wear/Eeg/userEeg', {
        appId: appId,
        Access_token: token,
        Phone: phone,
        StartDate: startDate,
        EndDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize,
        Mode:mode,
        SortAction:'desc',
    }).then(res => {
        // console.log("血糖获取",res)
        if (res.data.rows!=null){

        }
        return res
    }).catch( err=>{

            console.log("错误",err)
    }
    )
    // })
}
