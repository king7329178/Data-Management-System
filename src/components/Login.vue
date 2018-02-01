<template>
  <div class="login">
     <div class="login_wrapper">
          <div class="animate form login_form">
            <section class="login_content">
              <form>
                <h1>管理员登录</h1>
                <div>
                  <input type="text" class="form-control" placeholder="管理员登录名" required v-model="userName" />
                </div>
                <div>
                  <input type="password" class="form-control" placeholder="管理员登录密码" required v-model="userPwd" />
                </div>
                <div>
                  <a class="btn btn-default submit" @click="loginToIndex">&nbsp;登&nbsp;录&nbsp;</a>

                </div>

                <div class="clearfix"></div>

                <div class="separator">
                  <div class="clearfix"></div>
                  <br />


                  <div>
                    <h1><i><img src="../assets/img/favicon.ico"></i> 学子商城后台管理系统</h1>
                    <p>©2017 版权所有，CODEBOY.COM</p>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
  </div>
</template>

<script>
  export default{
    data:function(){
      return {
        msg:'Hello Login',
        userName:'',
        userPwd:''
      }
    },
    methods:{
      loginToIndex:function(){
        this.$http
          .get('http://localhost:8081/data_vue_admin/user/login.php?uname='+this.userName+"&upwd="+this.userPwd)
          .then(function(response){
            console.log(response.data);
            if(response.data.code == 200)
            {
              this.$router.push('/index')
            }else{
              alert("账号或者密码错误！！！")
            }
          })
        }
    }
  }
</script>
<style>

</style>
