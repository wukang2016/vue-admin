<template>
    <div class="page home">
        <el-container>
            <el-aside width="auto">
                <h1>{{sysName}}</h1>
                <el-menu
                    :default-active="$route.path"
                    class="el-menu-vertical"
                    @open="handleOpen"
                    @close="handleClose"
                    @select="handleSelect"
                    :collapse="isCollapse"
                    router
                    unique-opened
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">导航一</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="/admin/table">Table</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <span slot="title">选项4</span>
                            <el-menu-item index="1-4-1">选项1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                          <i class="el-icon-menu"></i>
                          <span slot="title">导航二</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1">选项1</el-menu-item>
                            <el-menu-item index="2-2">选项2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="3" disabled>
                        <i class="el-icon-document"></i>
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航四</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <el-row>
                        <el-col :span="12">
                            <div class="tools" @click.prevent="collapse">
                                <i class="fa fa-align-justify"></i>
                            </div>
                        </el-col>
                        <el-col :span="12" class="userinfo">
                            <el-dropdown trigger="hover">
                                <span class="el-dropdown-link userinfo-inner">
                                    <img :src="this.sysUserAvatar">
                                    {{sysUserName}}
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>我的消息</el-dropdown-item>
                                    <el-dropdown-item>设置</el-dropdown-item>
                                    <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                    </el-row>
                </el-header>

                <el-main class="pb0">
                    <el-col class="router-view">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sysName: "N",
            isCollapse: false,
            activeIndex: "1-1",
            sysUserName: "",
            sysUserAvatar: ""
        };
    },
    created(){
      console.log(this.$router.options.routes)
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        onSubmit() {
            console.log("submit!");
        },
        //退出登录
        logout: function() {
            var _this = this;
            this.$confirm("确认退出吗?", "提示", {
                //type: 'warning'
            })
                .then(() => {
                    sessionStorage.removeItem("user");
                    _this.$router.push("/login");
                })
                .catch(() => {});
        },
        //折叠导航栏
        collapse: function() {
            this.isCollapse = !this.isCollapse;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName(
                "submenu-hook-" + i
            )[0].style.display = status ? "block" : "none";
        }
    },
    mounted() {
        var user = sessionStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.name || "";
            this.sysUserAvatar = user.avatar || "";
        }
    }
};
</script>

<style scoped lang="scss">
.el-menu-vertical:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
}

.el-container {
    height: 100%;
    .el-aside {
        box-sizing: border-box;
        width: 230px;
        background: #545c64;
        h1 {
            font-size: 22px;
            padding-left: 20px;
            padding-right: 20px;
            height: 60px;
            line-height: 60px;
            background: #20a0ff;
            color: #fff;
        }
        .el-menu {
            border: none;
        }
    }
    .el-header {
        font-size: 22px;
        height: 60px;
        line-height: 60px;
        background: #20a0ff;
        color: #fff;
        .el-dropdown {
            vertical-align: top;
        }
        .userinfo {
            text-align: right;
            padding-right: 15px;
            float: right;
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                    margin: 10px 0px 10px 10px;
                    float: right;
                }
            }
        }
        .tools {
            font-size: 14px;
            width: 14px;
            height: 60px;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .el-main {
        .el-breadcrumb {
            float: right;
        }
    }
}
</style>
