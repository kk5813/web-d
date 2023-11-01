<template>
    <div>
        <div>
            <div class="search">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <template slot="label">
                            <span class="searchLabel">名称：</span>
                        </template>
                        <el-input
                            v-model="search.nodeName"
                            placeholder="请输入药物名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search_node"
                            >查询</el-button
                        >
                        <!-- <el-button type="success" @click="addExpertGroupDialogVisible=true">添加</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div id="graph" style="width: 100%; height: 700px"></div>
    </div>
</template>

<script>
// import graph_data_base from "./bingli_drugGraph_use.json";
import { Get } from "@/http/request.js";
export default {
    data() {
        return {
            search: {
                nodeName: "",
            },
            nodes: [
                {
                    name: "青霉素胶囊",
                    des: "青霉素胶囊",
                    symbolSize: 50, //节点大小
                    category: 0, //设置节点所属类别
                },
                {
                    name: "多奈哌齐",
                    des: "多奈哌齐",
                    symbolSize: 50, //节点大小
                    category: 0, //设置节点所属类别
                },
                {
                    name: "美金刚",
                    des: "美金刚",
                    symbolSize: 50, //节点大小
                    category: 0, //设置节点所属类别
                },
                {
                    name: "阿尔茨海默症",
                    des: "阿尔茨海默症",
                    symbolSize: 50, //节点大小
                    category: 1, //设置节点所属类别
                },
                {
                    name: "额颞叶痴呆",
                    des: "额颞叶痴呆",
                    symbolSize: 50, //节点大小
                    category: 1, //设置节点所属类别
                },
                {
                    name: "血管感染",
                    des: "血管感染",
                    symbolSize: 50, //节点大小
                    category: 1, //设置节点所属类别
                },
                {
                    name: "头晕",
                    des: "头晕",
                    symbolSize: 50, //节点大小
                    category: 2, //设置节点所属类别
                },
                {
                    name: "头疼",
                    des: "头疼",
                    symbolSize: 50, //节点大小
                    category: 2, //设置节点所属类别
                },
                {
                    name: "恶心",
                    des: "恶心",
                    symbolSize: 50, //节点大小
                    category: 2, //设置节点所属类别
                },
                {
                    name: "老人",
                    des: "老人",
                    symbolSize: 50, //节点大小
                    category: 3, //设置节点所属类别
                },
                {
                    name: "小孩",
                    des: "小孩",
                    symbolSize: 50, //节点大小
                    category: 3, //设置节点所属类别
                },
            ],
            links: [
                {
                    source: "美金刚", //源节点
                    target: "阿尔茨海默症", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "美金刚", //源节点
                    target: "恶心", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "美金刚", //源节点
                    target: "头晕", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "多奈哌齐", //源节点
                    target: "阿尔茨海默症", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "美金刚", //源节点
                    target: "老人", //目标节点
                    name: "适合", //关系
                    des: "",
                },
                {
                    source: "美金刚", //源节点
                    target: "额颞叶痴呆", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "青霉素胶囊", //源节点
                    target: "血管感染", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "青霉素胶囊", //源节点
                    target: "头疼", //目标节点
                    name: "治疗", //关系
                    des: "",
                },
                {
                    source: "青霉素胶囊", //源节点
                    target: "小孩", //目标节点
                    name: "适合", //关系
                    des: "",
                },
            ],
        };
    },
    methods: {
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
        get_nodes(arr) {
            let drugs = new Set();
            let person = new Set();
            let jibing = new Set();
            let zhengzhuang = new Set();
            arr.forEach((item) => {
                drugs.add(item.mingcheng);
                item.jinjiyaowu.forEach((e) => {
                    drugs.add(e);
                });
                item.lianyongyaowu.forEach((e) => {
                    drugs.add(e);
                });
                item.shiyongzhengzhuang.forEach((e) => {
                    zhengzhuang.add(e);
                });
                item.jinjizhengzhuang.forEach((e) => {
                    zhengzhuang.add(e);
                });
                item.shiyongrenqun.forEach((e) => {
                    person.add(e);
                });
                item.jinjirenqun.forEach((e) => {
                    person.add(e);
                });
                item.shiyongjibing.forEach((e) => {
                    jibing.add(e);
                });
                item.jinjijibing.forEach((e) => {
                    jibing.add(e);
                });
            });
            // console.log(drugs);
            drugs = Array.from(drugs);
            person = Array.from(person);
            jibing = Array.from(jibing);
            zhengzhuang = Array.from(zhengzhuang);
            drugs = drugs.map((item) => {
                return {
                    name: item,
                    des: item,
                    symbolSize: 50, //节点大小
                    category: 0, //设置节点所属类别
                };
            });
            zhengzhuang = zhengzhuang.map((item) => {
                return {
                    name: item,
                    des: item,
                    symbolSize: 50, //节点大小
                    category: 1, //设置节点所属类别
                };
            });
            jibing = jibing.map((item) => {
                return {
                    name: item,
                    des: item,
                    symbolSize: 50, //节点大小
                    category: 2, //设置节点所属类别
                };
            });
            person = person.map((item) => {
                return {
                    name: item,
                    des: item,
                    symbolSize: 50, //节点大小
                    category: 3, //设置节点所属类别
                };
            });
            return drugs.concat(zhengzhuang).concat(jibing).concat(person);
        },
        get_links(arr) {
            let links = [];
            arr.forEach((item) => {
                item.jinjiyaowu.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "禁忌", //关系
                        des: "",
                    });
                });
                item.lianyongyaowu.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "联用", //关系
                        des: "",
                    });
                });
                item.shiyongzhengzhuang.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "治疗", //关系
                        des: "",
                    });
                });
                item.jinjizhengzhuang.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "禁忌", //关系
                        des: "",
                    });
                });
                item.shiyongrenqun.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "适用", //关系
                        des: "",
                    });
                });
                item.jinjirenqun.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "禁忌", //关系
                        des: "",
                    });
                });
                item.shiyongjibing.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "适用", //关系
                        des: "",
                    });
                });
                item.jinjijibing.forEach((e) => {
                    links.push({
                        source: item.mingcheng, //源节点
                        target: e, //目标节点
                        name: "禁忌", //关系
                        des: "",
                    });
                });
                // console.log(links)
            });
            return links;
        },
        search_node() {
            let nodes = new Set();
            let showLinks = this.links.filter((item) => {
                if (
                    item.source.includes(this.search.nodeName) ||
                    item.target.includes(this.search.nodeName)
                ) {
                    nodes.add(item.source);
                    nodes.add(item.target);
                    return true;
                } else {
                    return false;
                }
            });

            let showNodes = this.nodes.filter((item) => nodes.has(item.name));

            let sn = Array.from(new Set(showNodes));
            let sl = Array.from(new Set(showLinks));
            console.log(sn, sl);

            this.freshGraph(sn, sl);
        },
        freshGraph(data, links) {
            let name_arr = [];
            data = data.filter((item) => {
                if (name_arr.includes(item.name)) {
                    return false;
                } else {
                    name_arr.push(item.name);
                    return true;
                }
            });

            var myChart = this.$echarts.init(document.getElementById("graph"));
            var categories = [
                { name: "药物" },
                { name: "症状" },
                { name: "疾病" },
                { name: "人群" },
            ];
            var option = {
                // 图的标题
                title: {
                    text: "",
                },
                // 提示框的配置
                tooltip: {
                    formatter: function (x) {
                        return x.data.des;
                    },
                },
                // 工具箱
                toolbox: {
                    // 显示工具箱
                    show: true,
                    feature: {
                        mark: {
                            show: true,
                        },
                        // 还原
                        restore: {
                            show: true,
                        },
                        // 保存为图片
                        saveAsImage: {
                            show: true,
                        },
                    },
                },
                legend: [
                    {
                        // selectedMode: 'single',
                        //设置可以根据类别显示or隐藏节点
                        data: categories.map(function (a) {
                            return a.name;
                        }),
                    },
                ],
                series: [
                    {
                        type: "graph", // 类型:关系图
                        layout: "force", //图的布局，类型为力导图
                        symbolSize: 40, // 调整节点的大小
                        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                        edgeSymbol: ["circle", "arrow"],
                        edgeSymbolSize: [2, 10],
                        edgeLabel: {
                            normal: {
                                textStyle: {
                                    fontSize: 20,
                                },
                            },
                        },
                        force: {
                            repulsion: 2500,
                            edgeLength: [10, 50],
                        },
                        draggable: true,
                        lineStyle: {
                            normal: {
                                width: 2,
                                color: "#4b565b",
                            },
                        },
                        edgeLabel: {
                            normal: {
                                show: true,
                                formatter: function (x) {
                                    return x.data.name;
                                },
                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                textStyle: {},
                            },
                        },

                        // 数据
                        data: data, //...后续数据省略
                        links: links, //定义关系，后续省略
                        categories: categories, //给类别赋值
                    },
                ],
            };

            myChart.setOption(option);
        },
        async fresh_data() {
            let data = await this.fetch_drug_data();
            let graph_data = data;

            this.listInfo = graph_data;
            this.nodes = this.get_nodes(graph_data);
            this.links = this.get_links(graph_data);
            this.freshGraph(
                this.get_nodes(graph_data.slice(0, 10)),
                this.get_links(graph_data.slice(0, 10))
            );
        },
    },
    async mounted() {
        this.fresh_data();
        // let data = localStorage.getItem("durg_graph");
        // let graph_data = null;
        // if (data) {
        //     graph_data = JSON.parse(data);
        // } else {
        //     graph_data = graph_data_base;
        // }
        // this.listInfo = graph_data;
        // this.nodes = this.get_nodes(graph_data);
        // this.links = this.get_links(graph_data);
        // this.freshGraph(
        //     this.get_nodes(graph_data.slice(0, 10)),
        //     this.get_links(graph_data.slice(0, 10))
        // );
    },
};
</script>
<style scoped lang="scss">
.search {
    margin: 30px 0 0 5%;
    .searchLabel {
        font-size: 20px;
        font-weight: bold;
        color: #1c7e7c;
        margin-top: 20px;
    }
}
</style>