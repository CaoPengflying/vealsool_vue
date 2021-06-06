<template>
    <div class="login">
        <div class="from-wrap">
            <h2>登录</h2>
            <Form ref="loginData" :model="loginData" :rules="ruleLogin" :label-width="80">
                <FormItem label="用户名" prop="username">
                    <Input type="username" v-model="loginData.username" placeholder="请输入用户名"/>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="loginData.password" placeholder="请输入密码"/>
                </FormItem>
                <FormItem class="form-footer">
                    <Button type="primary" @click="handleSubmit()">登陆</Button>
                    <Button type="ghost" @click="handleReset('loginData')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                loginData: {
                    username: '',
                    password: ''
                },
                ruleLogin: {
                    username: [
                        {required: true, message: '账号不能为空', trigger: 'blur'},
                        {min: 3, max: 16, message: '账号长度3-16个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, max: 16, message: '密码长度6-16个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                let url = this.CommonUtil.LOCAL_BASE_URL + 'user/login';
                let params = {
                    phoneNumber: this.loginData.username,
                    password: this.loginData.password
                }
                this.$http({
                    url: url,
                    method: 'post',
                    data: params,
                    withCredentials: true,//表示跨域请求时是否需要使用凭证
                }).then(res => {
                    if (res.data.status === '00000') {
                        window.sessionStorage.setItem("user", JSON.stringify(res.data.t));
                        let path = this.$route.query.redirect;
                        this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                    } else {
                        this.$Message.error(res.data.text);
                    }
                })
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!')
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>
    html, body {
        width: 100%;
        height: 100%;
        background-color: #1c2438;
    }

    .login {
        width: 100%;
        height: 100%;
        background-color: #1c2438;
        position: relative;
    }

    .login .from-wrap {
        position: fixed;
        left: 50%;
        margin-left: -200px;
        top: 50%;
        margin-top: -150px;
        width: 400px;
        height: 240px;
        border-radius: 10px;
        background-color: #fff;
        padding: 20px 30px;
    }

    .login h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .login FormItem {
        margin-bottom: 15px;
    }

    .login .form-footer {
        text-align: right;
    }

    .ivu-form-item-required .ivu-form-item-label:before {
        display: none;
    }
</style>