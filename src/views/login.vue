<template>
  <div class="text-center">
    <div class="container-sm">
      <form class="form-signin" action="POST" @submit.prevent="loginUser">
        <img class="mb-4" src="@/assets/images/logo.png" alt="" width="150" height="120">
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label for="identifier" class="sr-only">User</label>
        <input type="text" id="identifier" class="form-control" placeholder="User" v-model="authDetails.identifier" required autocomplete="off">
        <b-input-group>
          <b-form-input type="password" id="password" class="form-control passwd" placeholder="Password" v-model="authDetails.password" required autocomplete="off">
          </b-form-input>
          <label for="inputPassword" class="sr-only">Password</label>
          <b-input-group-append class="eyeButton">
            <b-button v-if="showPassword" variant="link" size="sm" @click="show_hidePassword">
              <font-awesome-icon class="icon" icon="eye" />
            </b-button>
            <b-button v-else variant="link" size="sm" @click="show_hidePassword">
              <font-awesome-icon class="icon" icon="eye-slash" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      showPassword: false,
      authDetails: {
        identifier: '',
        password: ''
      }
    }
  },
  methods: {
    show_hidePassword() {
      this.showPassword = !this.showPassword;
      document.getElementById("password").type = (this.showPassword) ? 'text' : 'password';
    },
    ...mapActions(['login']),
    loginUser() {
      this.login(this.authDetails)
        .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
  margin-top: 35%;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="username"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.passwd {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.eyeButton {
  border: none;
  margin-left: -35px;
  height: 40px;
  cursor: pointer;
  margin-top: 1.25%;
}
</style>