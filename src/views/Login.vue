<template>
  <div class="login">
    <div class="container">
        <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="0px"
        >
            <h3 class="title">系统登录</h3>
            <el-form-item prop="account">
                <el-input
                    type="text"
                    v-model="form.account"
                    auto-complete="off"
                    placeholder="账号"
                ></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input
                    type="password"
                    v-model="form.checkPass"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter.native="handleLogin"
                ></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    style="width:100%;"
                    @click.native.prevent="handleLogin"
                    :loading="logining"
                >登录</el-button>
                <!--<el-button @click.native.prevent="handleReset">重置</el-button>-->
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { requestLogin } from "../api/api";
//import NProgress from 'nprogress'
export default {
    data() {
        return {
            logining: false,
            form: {
                account: "",
                checkPass: ""
            },
            rules: {
                account: [
                    { required: true, message: "请输入账号", trigger: "blur" }
                    //{ validator: validaePass }
                ],
                checkPass: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                    //{ validator: validaePass2 }
                ]
            },
            checked: false
        };
    },
    methods: {
        handleReset() {
            this.$refs.form.resetFields();
        },
        handleLogin(ev) {
            var _this = this;
            this.$refs.form.validate(valid => {
                if (valid) {
                    //_this.$router.replace('/table');
                    this.logining = true;
                    //NProgress.start();
                    var loginParams = {
                        username: this.form.account,
                        password: this.form.checkPass
                    };
                    requestLogin(loginParams).then(data => {
                        console.log(data);
                        this.logining = false;
                        //NProgress.done();
                        let { msg, code } = data;
                        if (code !== 200) {
                            this.$message({
                                message: msg,
                                type: "error"
                            });
                        } else {
                            // sessionStorage.setItem(
                            //     "user",
                            //     JSON.stringify(user)
                            // );
                            console.log(2323)
                            this.$router.push({ path: "/admin/table" });
                        }
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.login{
  -webkit-font-smoothing: antialiased; //让页面里的字体变清晰，变细
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.container {
    border-radius: 5px;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
}
</style>
