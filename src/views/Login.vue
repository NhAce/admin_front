<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">智能管理后台</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="validateCode">
        <el-input name="validateCode" v-model="ruleForm2.validateCode"
          placeholder="验证码"></el-input>
        <el-button @click="sendMessage">
          <span v-if="sendMsgDisabled">{{time + '秒后获取'}}</span>
          <span v-if="!sendMsgDisabled">发送验证码</span>
        </el-button>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin, msgSend } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      var validPhone = (rule, value, callback)=>{
        if(!value){
          callback(new Error('请输入手机号'))
        }else if(!reg.test(value)){
          callback(new Error('请输入正确的11位手机号码'))
        }else {
          callback()
        }
      };
      var validCode = (rule, value, callback)=>{
        if(!value){
          callback(new Error('请输入验证码'))
        }else if(this.vcode !== value){
          callback(new Error('请输入正确的验证码'))
        }else{
          callback()
        }
      };
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: '',
          validateCode: '',
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { validator: validPhone }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          validateCode: [
            { required: true, message: '请输入验证码', trigger: 'blur'},
            {validator: validCode}
          ]
        },
        checked: true,
        time: 60,
        sendMsgDisabled: false,
        vcode: '',
        validCodeTime: 5
      };
    },
    //页面加载时获取cookie值
    mounted(){
      this.getCookie()
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      setCookie(c_name, c_pwd, exdays){
        let exdate = new Date()//当前时间
        exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays)//保存的天数
        //字符串拼接 cookie
        window.document.cookie="userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
        window.document.cookie="userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      },
      getCookie(){
        if(document.cookie.length > 0){
          var arr = document.cookie.split('; ')
          for(var i = 0; i < arr.length; i++){
            var arr2 = arr[i].split('=')
            if(arr2[0] == 'userName'){
              this.ruleForm2.account = arr2[1]
            }else if(arr2[0] == 'userPwd'){
              this.ruleForm2.checkPass = arr2[1]
            }
          }
        }
      },
      //清空cookie
      clearCookie: function() {
        this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
      },
      sendMessage(){
        let me = this
        if(!me.sendMsgDisabled){
          const reg1 = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg1.test(me.ruleForm2.account)){
            let param = new URLSearchParams()
            param.append('mobile', me.ruleForm2.account)
            msgSend(param).then(data => {
              let {msg, code, vcode} = data
              if(code !== 200){
                this.$message({
                    message: msg,
                    type: 'error'
                  });
              }else{
                me.vcode = vcode
                me.sendMsgDisabled = true
                //发送短信按钮倒计时60s
                let interval = window.setInterval(function(){
                  if ((me.time--) <= 0) {
                    me.time = 60
                    me.sendMsgDisabled = false
                    window.clearInterval(interval)
                  }
                }, 1000)
                //短信验证码保留5分钟
                let validInterval = window.setInterval(function(){
                  if((me.validCodeTime--) <= 0){
                    me.validCodeTime = 5
                    me.vcode = ''
                    window.clearInterval(validInterval)
                  }
                }, 60000)
              }
            })
          }else{
            alert("请先输入正确的手机号")
          }
        }
    },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { mobile: this.ruleForm2.account, password: this.ruleForm2.checkPass};
            let params = new URLSearchParams()
            for (var key in loginParams) {
                params.append(key, loginParams[key])
            }
            requestLogin(params).then(data => {
              this.logining = false;
              //NProgress.done();
              let { msg, code, user } = data;
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                if(this.checked){
                  //记住用户名密码
                  this.setCookie(user.mobile, user.password, 7)
                }else{
                  //清楚用户名密码
                  this.clearCookie()
                }
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/table' });
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
    margin: 180px auto;
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
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>