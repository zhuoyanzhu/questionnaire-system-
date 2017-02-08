<!--Login.vue -->
<template>
	<div class="login">
		<div class="side">
			<span class="glyphicon glyphicon-file" id='iconfont'></span>
			<h3 class="title">questionnaire survey platform</h3>
		</div>
		<div class="main">
			<div class="form-wrap">
				<div class="type">
					<p @click="changeMode('loginForm')">login</p>
					<p @click="changeMode('signupForm')">register</p>
				</div>
					<div  v-show='mode=="loginForm"'>
						<form id='loginForm' data-vv-scope="form1">
							<label class="control-label" for="email2">Email</label>
							<input v-validate data-vv-rules="required|email" class="form-control" type="text" name="email2">
							<p class="text-danger" v-show="errors.has('email2')">{{ errors.first('email2') }}</p>
			
							<label class="control-label" for="secret">Secret</label>
							<input v-validate data-vv-rules="required" class="form-control" type="password" name="secret">
							<p class="text-danger" v-show="errors.has('secret')">{{ errors.first('secret') }}</p>
							<button class="btn btn-primary btn-block" type="submit" @click='postLogin'>Login</button>
							{{loginTipMsg}}
						</form>
					</div>
					<div v-show='mode=="signupForm"'>
						<form id='signupForm' data-vv-scope="form2">
							<label class="control-label" for="name">Name</label>
							<input v-validate data-vv-rules="required|alpha|min:5" class="form-control" type="text" name="name">
							<p class="text-danger" v-show="errors.has('name')">{{ errors.first('name') }}</p>
							
							<label class="control-label" for="email">Email</label>
							<input v-validate data-vv-rules="required|emailvalidate" class="form-control" type="text" name="email">
							<p class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</p>
							
							<label class="control-label" for="password">Secret</label>
							<input v-validate data-vv-rules="required|passphrase|confirmed:password_confirmation" class="form-control" type="password" name="password">
							<p class="text-danger" v-show="errors.has('password')">{{ errors.first('password') }}</p>
							
							<label class="control-label" for="password_confirmation">Secret</label>
							<input v-validate data-vv-rules="required" class="form-control" type="password" name="password_confirmation">
							<button class="btn btn-primary btn-block" type="submit" @click='postSignup'>Register</button>
						</form>
					</div>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)
VeeValidate.Validator.extend('passphrase', {
  getMessage: field => 'The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (E.g. , . _ & ? etc)',
  validate: value => {
    var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})')
    return strongRegex.test(value)
  }
})
VeeValidate.Validator.extend('emailvalidate', {
  getMessage: field => 'Email has existed',
  validate: val => {
    let url = '/getdatabyemail?email=' + val
    return window.fetch(url)
      .then(res => {
        return res.json()
      })
      .then((json) => {
        return json.code === 0
          ? Promise.reject()
          : Promise.resolve()
      })
  }
})
export default {
  data () {
    return {
      mode: 'loginForm',
      showLoginTip: false,
      loginTipMsg: '',
      isLoading: false,
      code: -10
    }
  },
  methods: {
    changeMode (mode) {
      this.mode = mode
    },
    postLogin (e) {
      e.preventDefault()
      var self = this
      if (!self.isLoading) {
        this.$validator.validateAll('form1')
        if (this.errors.any('form1')) {
          return
        }
        let formDataStr = self.getFormDataStr('loginForm')
        window.fetch('/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formDataStr,
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json()
        })
        .then(function (result) {
          if (result.code === 0) {
            this.$router.push('/#/main')
          }
          if (result.code === -1 || result.code === -2) {
            if (result.code === -1) {
              self.loginTipMsg = 'email has not registered！'
              self.isLoading = false
            } else {
              self.loginTipMsg = 'password error！'
              self.isLoading = false
            }
            self.showLoginTip = true
            window.setTimeout(function () {
              self.showLoginTip = false
            }, 5000)
          }
        })
        .catch((err) => {
          self.isLoading = false
          console.log(err)
        })
      }
    },
    postSignup (e) {
      var self = this
      if (this.isLoading === false) {
        this.$validator.validateAll('form2')
        if (this.errors.any('form2')) {
          e.preventDefault()
          return
        }
        let formDataStr = self.getFormDataStr('signupForm')
        self.isLoading = true
        window.fetch('/signup', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formDataStr,
          credentials: 'same-origin'
        })
        .then(function (response) {
          return response.json()
        })
        .then(function (result) {
          if (result.code === 0) {
            return this.$router.push('/main')
          }
        })
        .catch((err) => {
          self.isLoading = false
          console.log(err)
        })
      }
    },
    getFormDataStr (id) {
      let form = document.getElementById(id)
      let signupFormData = {}
      Array.prototype.forEach.call(form.elements, field => {
        if (field.name !== '') {
          signupFormData[field.name] = field.value
        }
      })
      let tmpArr = []
      Object.keys(signupFormData).forEach(key => {
        tmpArr.push(key + '=' + signupFormData[key])
      })
      return tmpArr.join('&')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../scss/mixin/mixin.scss";
@import "../../scss/variable.scss";
.login {
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}
.side,
.main {
	float: left;
}
.side {
	width: 30rem;
    background: $blue;
    height: 100%;
    text-align: center;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
	#iconfont {
		font-size: 6rem;
		display: inline-block;
    }
	.title {
		font-size: 2rem;
	}
}
.main {
    width: 100%;
    height: 100%;
    padding-left: 30rem;
    margin-left: -30rem;
    .form-wrap {
      padding: 4rem;
      height: 100%;
      overflow: auto;
		.tip {
			color: red;
		}
		.type {
			font-size: 2rem;
			color: $gray;
			cursor: pointer;
			margin-bottom: 4rem;
			.is-active {
			color: $blue;
			}
		}
    }
}
</style>
