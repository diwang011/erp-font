<template>
    <div label-position="left" label-width="0px"
         class="demo-ruleForm login-container">
        <h3 class="title">walmart</h3>
        <el-tabs type="border-card" >
            <el-tab-pane>
                <span slot="label" > <i class="login-label"></i>Sign in</span>
                <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
                    <el-form-item prop="username">
                        <el-input type="text" v-model="ruleForm2.username" auto-complete="off"
                                  placeholder="username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="ruleForm2.password" auto-complete="off"
                                  placeholder="password"></el-input>
                    </el-form-item>
                    <el-form-item></el-form-item>
                    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
                    <el-form-item style="width:100%;">
                        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2"
                                   :loading="logining">Sign in
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label" >Register <i class="register-label"></i></span>
                <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1">
                    <el-form-item prop="username">
                        <el-input type="text" v-model="ruleForm1.username" auto-complete="off"
                                  placeholder="username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="ruleForm1.password" auto-complete="off"
                                  placeholder="password"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input type="password" v-model="ruleForm1.checkPass" auto-complete="off"
                                  placeholder="checkPass"></el-input>
                    </el-form-item>
                    <el-form-item prop="consumerId">
                        <el-input type="text" v-model="ruleForm1.consumerId" auto-complete="off"
                                  placeholder="consumerId"></el-input>
                    </el-form-item>
                    <el-form-item prop="privateKey">
                        <el-input type="text" v-model="ruleForm1.privateKey" auto-complete="off"
                                  placeholder="privateKey"></el-input>
                    </el-form-item>
                    <el-form-item></el-form-item>
                    <el-form-item style="width:100%;">
                        <el-button type="primary" style="width:100%;" @click.native.prevent="handRegister"
                                   :loading="registering">Register
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {requestLogin,requestRegister} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password again'));
                } else if (value !== this.ruleForm1.password) {
                    callback(new Error('Two passwords are not consistent!'));
                } else {
                    callback();
                }
            };
            return {
                logining: false,
                registering: false,
                isActive:false,
                ruleForm1: {
                    username: '',
                    password: '',
                    checkPass: '',
                    consumerId: '',
                    privateKey: ''
                },
                ruleForm2: {
                    username: '',
                    password: ''
                },
                rules2: {
                    username: [
                        {required: true, message: 'Please input Username', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: 'Please input Password', trigger: 'blur'},
                    ]
                },
                rules1: {
                    username: [
                        {required: true, message: 'Please input Username', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: 'Please input Password', trigger: 'blur'},
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    consumerId: [
                        {required: true, message: 'Please input Consumer Id', trigger: 'blur'},
                    ],
                    privateKey: [
                        {required: true, message: 'Please input PrivateKey', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ],
                },
                checked: true
            };
        },
        methods: {
            handRegister(ev) {
                this.$refs.ruleForm1.validate((valid) => {
                    if (valid) {
                        this.registering = true;
                        let params = {
                            data: {
                                username: this.ruleForm1.username,
                                password: this.ruleForm1.checkPass,
                                consumerId: this.ruleForm1.consumerId,
                                privateKey: this.ruleForm1.privateKey,
                            }
                        };
                        requestRegister(params).then(res => {
                            this.registering = false;
                            if (res.data == null) {
                                this.$message({
                                    message: res.error,
                                });
                            } else {
                                this.$message({
                                    message: 'Register success',
                                });
                                let user = {
                                    name: this.ruleForm1.username,
                                    token: res.data
                                };
                                sessionStorage.setItem('user', JSON.stringify(user));
                                this.$router.push({path: '/table'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSubmit2(ev) {
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var loginParams = {
                            "data": {
                                "username": this.ruleForm2.username,
                                "password": this.ruleForm2.password
                            }
                        };
                        requestLogin(loginParams).then(res => {
                            this.logining = false;
                            //NProgress.done();
                            //alert(JSON.stringify(data));
                            //let { msg, code, user } = data;
                            if (res.data == null) {
                                this.$message({
                                    message: res.error,
                                });
                            } else {
                                let user = {
                                    name: this.ruleForm2.username,
                                    token: res.data
                                };
                                sessionStorage.setItem('user', JSON.stringify(user));
                                this.$router.push({path: '/table'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 90px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .remember {
        margin: 0px 0px 35px 0px;
    }
    .login-label{
        width: 175px;
        margin-left: 94px;
    }
    .register-label{
        width: 175px;
        margin-right: 95px;
    }
</style>