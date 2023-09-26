<template>
  <div class="login">
    <el-card>
      <img style="margin-top:10px;margin-bottom:10px" src="/logo-eva.png"/>
      <el-form
        @keyup.enter.native="login"
        class="login-form"
        :model="model"
        :rules="rules"
        ref="form"
      >
        <el-form-item prop="username">
          <el-input auto-complete="username" v-model="model.username" placeholder="Username" prefix-icon="fas fa-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
          auto-complete="password"
            v-model="model.password"
            placeholder="Password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @keyup.enter.native="login"
            @click.prevent="login"
            :loading="loading"
            class="login-button"
            type="primary"
            block
          >Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "login",
  layout: "centered",
  data() {
    return {
      model: {
        username: "",
        password: ""
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "Username è richiesto",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "Password è richiesta", trigger: "blur" },
        ]
      }
    };
  },
  methods: {
    async login() {
      if(!this.model.username && !this.model.password) return this.$message.error("Username e la password sono obbligatorie");
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;
      this.$axios.post('/api/auth/login', {username: this.model.username,password:this.model.password}).then(async (res)=> {
        this.$message.success("Login effettuato con successo");
        await this.$store.commit('setAuthToken', res.data.data.token)
        await this.$store.commit('setAuthPermissions', res.data.data.permissions)
        await this.$store.commit('setAuthMemberOf', res.data.data.member_of)
        await this.$store.commit('setAuthRcuTenants', res.data.data.member_of)
        await this.$store.commit('setAuthName', res.data.data.name)
        await this.$cookies.set('token',res.data.data.token, {path: '/'})
        await this.$cookies.set('name',res.data.data.name, {path: '/'})
        await this.$store.commit('setViewRcu', 'reale')
        await this.$cookies.set('view_rcu','reale', {path: '/'})
        this.$router.push('/')
      }).catch((e)=>{
        console.log("e",e)
        this.$message.error("Username o la password sono errate");
      })
      this.loading = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-button--primary {
  background: rgb(0, 124, 137);
  border-color: rgb(0, 124, 137);
}
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.login-form {
  width: 320px;
  margin-top: 20px;
}
.forgot-password {
  margin-top: 10px;
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
</style>
