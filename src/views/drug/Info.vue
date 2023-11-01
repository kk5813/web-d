<template>
    <div>
        <!-- <el-button @click="fetch_drug_data"> 测试1 </el-button> -->
        <!-- <el-button @click="test2"> 测试2 </el-button>
        <el-button @click="test3"> 测试3 </el-button> -->

        <div class="search">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <template slot="label">
                        <span class="searchLabel">药物名称：</span>
                    </template>
                    <el-input
                        v-model="search.name"
                        placeholder="请输入用品名称"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="add_drug">添加</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="eltable">
            <el-table
                :data="show_data"
                style="width: 100%"
                border
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{
                    background: '#EFF3F4',
                    color: '#1c7e7c',
                    'text-align': 'center',
                    'font-size': '16px',
                }"
            >
                <el-table-column label="名称" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.mingcheng }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="适应症">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shiyingzheng }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="禁忌症">
                    <template slot-scope="scope">
                        <p>{{ scope.row.jinji }}</p>
                    </template>
                </el-table-column>
                <el-table-column width="200px" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="details(scope.row)"
                            >查看</el-button
                        >
                        <el-button
                            type="danger"
                            size="small"
                            @click="deleteDrug(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="page">
            <div class="block">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="search.page"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, prev, pager, next, jumper"
                    :total="graph_data_final.length"
                ></el-pagination>
            </div>
        </div>

        <!-- 添加药品对话框 -->
        <el-dialog
            title="添加药品"
            :visible.sync="addDialogVisible"
            width="700px"
        >
            <div class="dialog">
                <div class="basicInfo">
                    <div class="info">
                        <el-form
                            ref="addForm"
                            :show-message="false"
                            label-width="100px"
                            :inline="true"
                            size="small"
                            :model="newDrug"
                        >
                            <el-form-item
                                prop="name"
                                style="width: 200px"
                                label="名称"
                            >
                                <el-input
                                    style="width: 100px"
                                    v-model="newDrug.mingcheng"
                                ></el-input>
                            </el-form-item>

                            <el-form-item
                                prop="specification"
                                style="width: 200px"
                                label="规格"
                            >
                                <el-input
                                    style="width: 100px"
                                    v-model="newDrug.guige"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                prop="type"
                                style="width: 200px"
                                label="剂型"
                            >
                                <el-select
                                    style="width: 100px"
                                    v-model="newDrug.jixing"
                                    clearable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in [
                                            { label: '片剂', value: '片剂' },
                                            { label: '胶囊', value: '胶囊' },
                                            { label: '颗粒', value: '颗粒' },
                                            { label: '溶剂', value: '溶剂' },
                                        ]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="manufacturer"
                                style="width: 200px"
                                label="厂商"
                            >
                                <el-input
                                    style="width: 100px"
                                    v-model="newDrug.changshang"
                                ></el-input>
                            </el-form-item>

                            <el-form-item
                                prop="approvalNumber"
                                style="width: 200px"
                                label="使用方式"
                            >
                                <el-select
                                    style="width: 100px"
                                    v-model="newDrug.shiyongfangshi"
                                    clearable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in [
                                            { label: '口服', value: '口服' },
                                            { label: '外用', value: '外用' },
                                            { label: '注射', value: '注射' },
                                        ]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="成份"
                            >
                                <el-select
                                    v-model="newDrug.chengfen"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入药物主要成分"
                                >
                                    <el-option
                                        v-for="item in [
                                            '洛索洛芬钠',
                                            '西酞普兰',
                                            '乙酰半胱氨酸',
                                            '阿司匹林',
                                            '丙戊酰胺',
                                        ]"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="禁忌"
                            >
                                <el-input
                                    style="width: 500px"
                                    :rows="2"
                                    v-model="newDrug.jinji"
                                    type="textarea"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="适应症"
                            >
                                <el-input
                                    style="width: 500px"
                                    :rows="2"
                                    v-model="newDrug.shiyingzheng"
                                    type="textarea"
                                ></el-input>
                            </el-form-item>

                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="过敏禁忌"
                            >
                                <el-select
                                    v-model="newDrug.guominjinji"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入药物过敏禁忌"
                                >
                                    <el-option
                                        v-for="item in show_guoming"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="适用疾病"
                            >
                                <el-select
                                    v-model="newDrug.shiyongjibing"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    :filter-method="input_jibing"
                                    style="width: 500px"
                                    placeholder="请录入适用疾病"
                                >
                                    <el-option
                                        v-for="item in show_jibing"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="适用症状"
                            >
                                <el-select
                                    v-model="newDrug.shiyongzhengzhuang"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入适用症状"
                                >
                                    <el-option
                                        v-for="item in show_zhengzhuang"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="适用人群"
                            >
                                <el-select
                                    v-model="newDrug.shiyongrenqun"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入适用人群"
                                >
                                    <el-option
                                        v-for="item in show_renqun"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="联用药物"
                            >
                                <el-select
                                    v-model="newDrug.lianyongyaowu"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入可联用药物"
                                >
                                    <el-option
                                        v-for="item in show_drugs"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="禁忌药物"
                            >
                                <el-select
                                    v-model="newDrug.jinjiyaowu"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入禁忌药物"
                                >
                                    <el-option
                                        v-for="item in show_drugs"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="禁忌疾病"
                            >
                                <el-select
                                    v-model="newDrug.jinjijibing"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入禁忌疾病"
                                >
                                    <el-option
                                        v-for="item in show_jibing"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="禁忌症状"
                            >
                                <el-select
                                    v-model="newDrug.jinjizhengzhuang"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入禁忌症状"
                                >
                                    <el-option
                                        v-for="item in show_zhengzhuang"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                prop="approvalNumber"
                                style="width: 100%"
                                label="禁忌人群"
                            >
                                <el-select
                                    v-model="newDrug.jinjirenqun"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    style="width: 500px"
                                    placeholder="请录入禁忌人群"
                                >
                                    <el-option
                                        v-for="item in show_renqun"
                                        :key="item"
                                        :label="item"
                                        :value="item"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer clearFloat">
                    <el-button
                        size="small"
                        style="margin-top: 20px; float: right"
                        type="primary"
                        @click="confirmAddDrug"
                        >确 定</el-button
                    >
                    <!-- <el-button
                        size="small"
                        style="
                            margin-top: 20px;
                            float: right;
                            margin-right: 20px;
                        "
                        type="warning"
                        @click="relation_solve(newDrug)"
                        >智能解析</el-button
                    > -->
                </span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getDrugsInfo,
    addDrug,
    delDrug,
} from "@api/medicalInfo/medicalInfo.js";
import { Get, Post } from "@/http/request.js";
// import graph_data_base from "./bingli_drugGraph_use copy.json";
export default {
    computed: {
        ruleChange() {
            return (
                this.search.name +
                this.search.classfication +
                this.search.approvalNumber +
                this.search.standardCode
            );
        },
        show_data() {
            return this.listInfo
                .filter((item) => item.mingcheng.includes(this.search.name))
                .slice(10 * (this.search.page - 1), 10 * this.search.page);
        },
    },

    data() {
        return {
            graph_data_final: [],
            uploadToken: {
                Authorization: localStorage.getItem("token"),
            },
            imageUrl: "",
            addDialogVisible: false,
            dialogVisible: false,
            articleRelation: null,
            relationDialogVisible: false,
            search: {
                name: "", //名称
                classfication: "",
                approvalNumber: "",
                standardCode: "",
                page: 1, //第几页
            },
            listInfo: [],
            articleDetail: {
                img: "",
                name: "",
                classfication: "",
                type: "",
                specification: "",
                manufacturer: "",
                approvalNumber: "",
                standardCode: "",
                use: "",
                introduction: "",
            },
            newDrug: {
                mingcheng: "",
                guige: "",
                jixing: "",
                changshang: "",
                shiyongfangshi: "",
                jinji: "",
                shiyingzheng: "",
                chengfen: [],
                guominjinji: [],
                shiyongjibing: [],
                shiyongzhengzhuang: [],
                shiyongrenqun: [],
                lianyongyaowu: [],
                jinjiyaowu: [],
                jinjijibing: [],
                jinjizhengzhuang: [],
                jinjirenqun: [],
            },
            currentPage: 1,
            pageSize: 10,
            maxNum: 0,
            rules: {},

            drugs: [],
            zhengzuang: [],
            jibing: [],
            renqun: [],
            guoming: [],

            show_drugs: [],
            show_zhengzhuang: [],
            show_jibing: [],
            show_renqun: [],
            show_guoming: [],
        };
    },
    methods: {
        // async test2() {
        //     for (let d of graph_data_base) {
        //         await this.post_drug_data(d);
        //         console.log("1");
        //     }
        //     // console.log(graph_data_base);
        // },
        test3() {
            let ids = this.listInfo.map((item) => item.id);
            for (let id of ids) {
                this.del_drug_data(id);
            }
        },
        fetch_drug_data() {
            return Get("/api/medicalinfo_manage/drug_graph/getDrug").then(
                (res) => {
                    let data = res.data.drugsInfo.map((item) => {
                        let t = JSON.parse(item.data);
                        t.id = item.id;
                        return t;
                    });
                    this.graph_data_final = data;
                    return data;
                }
            );
        },
        post_drug_data(e) {
            let data = {
                name: e.mingcheng,
                data: e, //JSON格式
                id: e.id, //为空代表插入，有值代表修改
            };
            return Post(
                "/api/medicalinfo_manage/drug_graph/addDrug",
                data
            ).then((res) => {
                return res;
            });
        },
        del_drug_data(id) {
            return Post("/api/medicalinfo_manage/drug_graph/deleteDrug", {
                id: id,
            }).then((res) => {
                return res;
            });
        },
        input_zhengzhuang(key) {
            this.show_zhengzhuang = this.zhengzhuang
                .filter((item) => item.includes(key))
                .slice(0, 5);
        },
        input_jibing(key) {
            this.show_jibing = this.jibing
                .filter((item) => item.includes(key))
                .slice(0, 5);
        },
        input_yaowu(key) {
            this.show_drugs = this.drugs
                .filter((item) => item.includes(key))
                .slice(0, 5);
        },
        input_renqun(key) {
            this.show_renqun = this.renqshow_renqun
                .filter((item) => item.includes(key))
                .slice(0, 5);
        },
        async postData(url = "", data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        },
        relation_solve(item) {
            this.postData("http://127.0.0.1:8000/predict/jinji", {
                string: item["jinji"] + "##",
            })
                .then((res) => {
                    for (let key in res.data) {
                        this.newDrug[key] = Array.from(
                            new Set(this.newDrug[key].concat(res.data[key]))
                        );
                    }
                })
                .catch((e) => {
                    console.log(e);
                });

            this.postData("http://127.0.0.1:8000/predict/jinji", {
                string: "##" + item["shiyingzheng"],
            })
                .then((res) => {
                    for (let key in res.data) {
                        this.newDrug[key] = Array.from(
                            new Set(this.newDrug[key].concat(res.data[key]))
                        );
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        add_drug() {
            this.newDrug = {
                mingcheng: "",
                guige: "",
                jixing: "",
                changshang: "",
                shiyongfangshi: "",
                jinji: "",
                shiyingzheng: "",
                chengfen: [],
                guominjinji: [],
                shiyongjibing: [],
                shiyongzhengzhuang: [],
                shiyongrenqun: [],
                lianyongyaowu: [],
                jinjiyaowu: [],
                jinjijibing: [],
                jinjizhengzhuang: [],
                jinjirenqun: [],
            };
            this.addDialogVisible = true;
        },
        details(item) {
            this.newDrug = item;
            this.addDialogVisible = true;
        },
        relation(item) {
            this.articleRelation = item;
            this.relationDialogVisible = true;
        },
        handleAvatarSuccess(res, file) {
            this.newDrug.img = res.readloadurl;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        confirmAddDrug() {
            this.$refs["addForm"].validate((valid) => {
                if (valid) {
                    this.addDialogVisible = false;
                    let temp = JSON.parse(JSON.stringify(this.newDrug));
                    this.post_drug_data(temp).then((res) => {
                        this.$message.success("添加成功");
                        this.fresh_data();
                    });
                } else {
                    this.$message("请完善物品信息");
                }
            });
        },
        handleCurrentChange(val) {
            this.search.page = val;
        },
        deleteDrug(item) {
            this.$confirm("此操作将永久删除该药物, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    console.log(item);
                    this.del_drug_data(item.id)
                        .then((res) => {
                            this.$message.success("删除成功");
                            this.fresh_data();
                        })
                        .catch((e) => {
                            this.fetch_drug_data();
                        });
                })
                .catch((e) => {
                    console.log(e);
                    // this.$message({
                    //     type: "info",
                    //     message: "已取消删除",
                    // });
                });
        },
        async fresh_data() {
            let data = await this.fetch_drug_data();
            console.log(data);
            let graph_data = data;

            // console.log(graph_data);
            let drugs = [];
            let zhengzhuang = [];
            let jibing = [];
            let renqun = [];
            let guoming = [];
            let chengfen = [];
            console.log(graph_data);
            graph_data.forEach((item) => {
                drugs.push(item.mingcheng);
                chengfen.push(item.chengfen);

                item.shiyongjibing.forEach((e) => jibing.push(e));
                item.jinjijibing.forEach((e) => jibing.push(e));

                item.shiyongzhengzhuang.forEach((e) => zhengzhuang.push(e));
                item.jinjizhengzhuang.forEach((e) => zhengzhuang.push(e));

                item.shiyongrenqun.forEach((e) => renqun.push(e));
                item.jinjirenqun.forEach((e) => renqun.push(e));

                item.lianyongyaowu.forEach((e) => drugs.push(e));
                item.jinjiyaowu.forEach((e) => drugs.push(e));

                item.guominjinji.forEach((e) => guoming.push(e));
            });
            this.drugs = Array.from(new Set(drugs));
            this.zhengzhuang = Array.from(new Set(zhengzhuang));
            this.jibing = Array.from(new Set(jibing));
            this.renqun = Array.from(new Set(renqun));
            this.guoming = Array.from(new Set(guoming));

            this.show_drugs = this.drugs.slice(0, 5);
            this.show_zhengzhuang = this.zhengzhuang.slice(0, 5);
            this.show_jibing = this.jibing.slice(0, 5);
            this.show_renqun = this.renqun.slice(0, 5);
            this.show_guoming = this.guoming.slice(0, 5);
            this.listInfo = graph_data;
        },
    },
    created() {
        this.fresh_data();
    },
};
</script>
<style scoped lang="scss">
.dialog {
    width: 100%;
    // .basicInfo {
    //     height: 200px;
    //     overflow-y: scroll;
    //     padding-left: 20px;
    //     display: flex;
    //     .pic {
    //         width: 200px;
    //         flex-shrink: 0;
    //         img {
    //             width: 100%;
    //             height: 100%;
    //         }
    //     }
    //     .info {
    //         padding-left: 20px;
    //         width: 100%;
    //         p {
    //             font-size: 18px;
    //             margin-bottom: 10px;
    //             .lable {
    //                 font-weight: bolder;
    //                 color: #1c7e7c;
    //             }
    //         }
    //     }
    // }
    .introduction {
        padding-left: 20px;
        width: 100%;

        .lable {
            font-size: 18px;
            font-weight: bolder;
            color: #1c7e7c;
        }
    }
}
.eltable {
    width: 90%;
    margin: 10px 5%;
}

.content {
    width: 95%;
    max-height: 700px;
    overflow: auto;
    margin: auto;
}

.search {
    margin: 30px 0 0 5%;
    .searchLabel {
        font-size: 20px;
        font-weight: bold;
        color: #1c7e7c;
        margin-top: 20px;
    }
}
.card {
    width: 90%;
    height: 150px;
    overflow: hidden;
    display: flex;
    margin: auto;
    .pic {
        width: 150px;
        height: 150px;
        margin-left: 10px;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .info {
        margin-left: 30px;
        span {
            .name {
                font-size: 20px;
                font-weight: bold;
                color: #1c7e7c;
            }
            p {
                margin-top: 15px;
                font-size: 18px;
            }
        }
        :hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }
}
.leftLine {
    border-left: 10px solid #eff3f4;
    border-top: 10px solid white;
    border-bottom: 10px solid white;
}
.underline {
    width: 90%;
    margin: 20px auto;
    clear: both;
}
.searchLine {
    width: 95%;
    margin: 5px auto 20px;
}
.footer {
    float: right;
    margin-right: 5%;
    .clear {
        height: 30px;
        clear: both;
    }
}
.page {
    float: right;
    margin: 10px 5% 10px 0px;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 190px;
    height: 190px;
    line-height: 190px;
    text-align: center;
}
.avatar {
    width: 190px;
    height: 190px;
    display: block;
}
</style>