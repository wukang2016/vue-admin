<template>
    <div class="table-container">
        <el-row class="mod-breadcrumb">
            <el-col :span="12">{{$route.name}}</el-col>
            <el-col :span="12">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <a href="/">活动管理</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <section>
            <!--工具条-->
            <el-row class="mod-toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getUsers">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-row>

            <!--列表 //@current-change="handleCurrentChange"-->
            <el-table
                ref="tableView"
                :data="tableData"
                highlight-current-row
                border
                stripe
                show-overflow-tooltip
                tooltip-effect="dark"
                v-loading="listLoading"
                @selection-change="handleSelectionChange"
                :height="maxHeight"
                style="width: 100%;"
                :default-sort="{prop: 'name', order: 'descending'}"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120" sortable></el-table-column>
                <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex"></el-table-column>
                <el-table-column prop="age" label="年龄" width="100"></el-table-column>
                <el-table-column prop="birth" label="生日" width="120"></el-table-column>
                <el-table-column prop="addr" label="地址" min-width="180"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button
                            @click="handleView(scope.$index, scope.row)"
                            type="text"
                            size="small"
                        >查看</el-button>
                        <el-button
                            @click="handleEdit(scope.$index, scope.row)"
                            type="text"
                            size="small"
                        >编辑</el-button>
                        <el-button
                            @click="handleDelete(scope.$index, scope.row)"
                            type="text"
                            size="small"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-row class="mod-toolbar mb0" ref="bottomToolbar">
                <el-button
                    type="danger"
                    @click="batchRemove"
                    :disabled="this.multipleSelection.length===0"
                >批量删除</el-button>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handlePageChange"
                    :page-size="20"
                    :total="total"
                ></el-pagination>
            </el-row>

            <!--查看界面-->
            <el-dialog title="查看" :visible.sync="viewFormVisible" :close-on-click-modal="false">
                <el-form :model="viewForm" label-width="80px" ref="viewForm">
                    <el-form-item label="姓名" prop="name">
                        <span>{{viewForm.name}}</span>
                    </el-form-item>
                    <el-form-item label="性别">
                        <span>{{viewForm.sex}}</span>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <span>{{viewForm.age}}</span>
                    </el-form-item>
                    <el-form-item label="生日">
                        <span>{{viewForm.birth}}</span>
                    </el-form-item>
                    <el-form-item label="地址">
                        <span>{{viewForm.addr}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="viewFormVisible = false">关闭</el-button>
                </div>
            </el-dialog>

            <!--编辑界面-->
            <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="editForm.sex">
                            <el-radio class="radio" :label="1">男</el-radio>
                            <el-radio class="radio" :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input type="textarea" v-model="editForm.addr"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>

            <!--新增界面-->
            <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="addForm.sex">
                            <el-radio class="radio" :label="1">男</el-radio>
                            <el-radio class="radio" :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input type="textarea" v-model="addForm.addr"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
        </section>
    </div>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
    getUserListPage,
    removeUser,
    batchRemoveUser,
    editUser,
    addUser
} from "@/api/api";

export default {
    data() {
        return {
            filters: {
                name: ""
            },
            tableData: [],
            winHeight: window.innerHeight,
            maxHeight: 500,
            total: 0,
            page: 1,
            listLoading: false,
            multipleSelection: [], //列表选中列
            currentRow: null,
            viewFormVisible: false,
            viewForm: {},
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            editFormRules: {
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" }
                ]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                name: "",
                sex: -1,
                age: 0,
                birth: "",
                addr: ""
            },

            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                name: [
                    { required: true, message: "请输入姓名", trigger: "blur" }
                ]
            },
            //新增界面数据
            addForm: {
                name: "",
                sex: -1,
                age: 0,
                birth: "",
                addr: ""
            }
        };
    },
    computed: {},
    watch: {
        winHeight() {
            this.resizeHeight();
        }
    },
    methods: {
        resizeHeight() {
            const maxHeight =
                this.winHeight -
                this.$refs.tableView.$el.offsetTop -
                this.$refs.bottomToolbar.$el.offsetHeight -
                10;
            this.maxHeight = maxHeight;
        },
        //性别显示转换
        formatSex: function(row, column) {
            return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
        },
        //单击选中当前行
        // handleCurrentChange(val) {
        //     console.log(val);
        //     this.currentRow = val;
        // },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.tableView.toggleRowSelection(row);
                });
            } else {
                this.$refs.tableView.clearSelection();
            }
        },
        handlePageChange(val) {
            this.page = val;
            this.getUsers();
        },
        //获取用户列表
        getUsers() {
            let params = {
                page: this.page,
                name: this.filters.name
            };
            this.listLoading = true;
            //NProgress.start();
            getUserListPage(params).then(res => {
                console.log(res);
                this.total = res.data.total;
                this.tableData = res.data.users;
                this.listLoading = false;
                //NProgress.done();
            });
        },
        //查看
        handleView(index, row) {
            console.log(index, row);
            this.viewFormVisible = true;
            this.viewForm = Object.assign({}, row);
        },
        //编辑
        handleEdit(index, row) {
            console.log(index, row);
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //删除
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm("确认删除该记录吗?", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    removeUser(para).then(res => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getUsers();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //临时移除
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        //显示新增界面
        handleAdd: function() {
            this.addFormVisible = true;
            this.addForm = {
                name: "",
                sex: -1,
                age: 0,
                birth: "",
                addr: ""
            };
        },
        //编辑
        editSubmit: function() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {
                        type: "info"
                    }).then(() => {
                        this.editLoading = true;
                        //NProgress.start();
                        let params = Object.assign({}, this.editForm);
                        console.log(params);
                        params.birth =
                            !params.birth || params.birth == ""
                                ? ""
                                : util.formatDate.format(
                                      new Date(params.birth),
                                      "yyyy-MM-dd"
                                  );
                        editUser(params).then(res => {
                            this.editLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: "提交成功",
                                type: "success"
                            });
                            this.$refs.editForm.resetFields();
                            this.editFormVisible = false;
                            this.getUsers();
                        });
                    });
                }
            });
        },
        //新增
        addSubmit: function() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认提交吗？", "提示", {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let params = Object.assign({}, this.addForm);
                        params.birth =
                            !params.birth || params.birth == ""
                                ? ""
                                : util.formatDate.format(
                                      new Date(params.birth),
                                      "yyyy-MM-dd"
                                  );
                        addUser(params).then(res => {
                            this.addLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: "提交成功",
                                type: "success"
                            });
                            this.$refs.addForm.resetFields();
                            this.addFormVisible = false;
                            this.getUsers();
                        });
                    });
                }
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection);
        },
        //批量删除
        batchRemove: function() {
            var ids = this.multipleSelection.map(item => item.id).toString();
            this.$confirm("确认删除选中记录吗？", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then(res => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.getUsers();
                    });
                })
                .catch(() => {});
        },
        /**
         * 函数去抖（debounce）
         * 函数调用n秒后才会执行，如果函数在n秒内被调用的话则函数不执行，重新计算执行时间
         * **/
        debounce(method, delay) {
            var timer = null;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    method.apply(context, args);
                }, delay);
            };
        },
        /**
         * 函数节流（throttle）
         * 函数预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期
         * **/
        throttle(method, duration) {
            var begin = new Date();
            return function() {
                var context = this,
                    args = arguments,
                    current = new Date();
                if (current - begin >= duration) {
                    method.apply(context, args);
                    begin = current;
                }
            };
        }
    },
    mounted() {
        this.getUsers();
        this.$nextTick(() => {
            this.resizeHeight();
        });

        window.addEventListener(
            "resize",
            this.debounce(() => {
                this.winHeight = window.innerHeight;
            }, 100),
            false
        );
    }
};
</script>

<style scoped>
</style>
