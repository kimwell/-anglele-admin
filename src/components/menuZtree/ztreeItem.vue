<template>
    <li :class="liClassVal">
        <div class="tree-info">
            <span :class="spanClassVal" @click='open(model)'></span>
            <!-- <a :class="aClassVal" @click='Func(model,$event)'>
                    <span :class="{loadSyncNode:model.loadNode==1}" v-if='model.loadNode==1'></span>
                    <span :class='model.iconClass' v-show='model.iconClass' v-else></span>
                </a> -->
            <span class="node_name">
                {{model.title}}</span>
            </span>
            <div class="tree-option">
                <a @click="Func(model,$event,1)"><i class="iconfont icon-xinzeng"></i>新增</a>
                <a @click="Func(model,$event,2)"><i class="iconfont icon-bianji"></i>编辑</a>
                <a @click="Func(model,$event,3)"><i class="iconfont icon-tuanduicankaoxian-"></i>删除</a>
            </div>
        </div>
        <ul :class="ulClassVal" v-show='model.isFolder'>
            <ztree-item v-for="(item,i) in model.children" :key='i' :callback='callback' :expandfunc='expandfunc' :cxtmenufunc='cxtmenufunc' :model.sync="item" :num.sync='i' root='1' :nodes.sync='model.children.length' :trees.sync='trees'></ztree-item>
        </ul>
    </li>
</template>


<script>
    export default {
        name: "ztree-item",
        props: {
            model: {
                type: Object,
                twoWay: true
            },
            num: {
                type: Number,
                twoWay: true
            },
            nodes: {
                type: Number,
                twoWay: true,
                default: 0
            },
            trees: {
                type: Array,
                twoWay: true,
                default: []
            },
            root: {
                type: String,
                twoWay: true
            },
            callback: {
                type: Function
            },
            expandfunc: {
                type: Function
            },
            cxtmenufunc: {
                type: Function
            }
        },
        methods: {
            Func(m, e, o) {
                // 查找点击的子节点
                var recurFunc = (data, list) => {
                    data.forEach(i => {
                        if (i.id == m.id) {
                            i.clickNode = true;
                            if (typeof this.callback == "function") {
                                this.callback.call(null, m, list, e, o);
                            }
                        } else {
                            i.clickNode = false;
                        }
                        if (i.children) {
                            recurFunc(i.children, i);
                        }
                    });
                };
                recurFunc(this.trees, this.trees);
            },
            open(m) {
                m.isExpand = !m.isExpand;
                if (typeof this.expandfunc == "function" && m.isExpand) {
                    if (m.loadNode != 2) {
                        //
                        this.expandfunc.call(null, m);
                    } else {
                        m.isFolder = !m.isFolder;
                    }
                } else {
                    m.isFolder = !m.isFolder;
                }
            },
            checkHandle(m) {
                m.isCheck = !m.isCheck;
                if (m.children) {
                    m.children.forEach(el => {
                        el.isCheck = !el.isCheck;
                    });
                }
            }
        },
        computed: {
            // 给（根 和 子树）赋值不同的样式
            rootClass() {
                var strRootClass = "";
    
                // 根判断
                if (this.root == "0") {
                    strRootClass =
                        this.num == 0 && this.model.children.length == 0 ?
                        "roots_docu" :
                        this.nodes == 1 || (this.num == 0 && this.nodes != this.num + 1) ?
                        "root_" :
                        this.nodes == this.num + 1 ? "bottom_" : "center_";
    
                    // 子树判断
                } else if (this.root == "1") {
                    strRootClass =
                        this.nodes > 1 &&
                        this.model.children.length > 0 &&
                        this.nodes != this.num + 1 ?
                        "center_" :
                        (this.num == 0 && this.nodes > 1) || this.nodes != this.num + 1 ?
                        "center_docu" :
                        (this.nodes == 1 && this.num != 0) ||
                        (this.nodes == this.num + 1 && this.model.children.length > 0) ?
                        "bottom_" :
                        "bottom_docu";
                }
                return strRootClass;
            },
            // 是否有儿子节点
            isChildren() {
                return this.num + 1 != this.nodes;
            },
            // 展开/收起
            prefixClass() {
                var returnChar = "";
                if (this.rootClass.indexOf("docu") == -1) {
                    if (this.model.isFolder) {
                        returnChar = "open";
                    } else {
                        returnChar = "close";
                    }
                }
                if (
                    this.model.children.length == 0 &&
                    this.rootClass.indexOf("docu") == -1
                ) {
                    returnChar = "docu";
                }
    
                return returnChar;
            },
            liClassVal() {
                return "level" + this.num;
            },
            spanClassVal() {
                return (
                    "button level" +
                    this.num +
                    " switch " +
                    this.rootClass +
                    this.prefixClass
                );
            },
            aClassVal() {
                return this.model.clickNode ?
                    "level" + this.num + " curSelectedNode" :
                    "level" + this.num;
            },
            ulClassVal() {
                return this.isChildren && this.model.children.length > 0 ?
                    "level" + this.num + " line" :
                    "level" + this.num;
            }
        }
    };
</script>

