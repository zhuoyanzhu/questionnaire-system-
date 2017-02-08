<template>
	<header>
		<div class='side'>
			<div class="title-wrap">
				<h1 class="title">{{ msg }}</h1>
			</div>
			<div class="home">
				<input type="submit" class="btn btn-small btn-primary" value="logout" @click="signout">
			</div>
		</div>
	</header>
</template>
<script>
export default {
  data () {
    return {
      msg: 'questionnaire survey platform'
    }
  },
  methods: {
    signout () {
      window.fetch('/signout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json()
      })
      .then(result => {
        if (result.code === 0) {
          this.$router.push({ path: '/' })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../scss/mixin/mixin.scss";
@import "../../scss/variable.scss";
.side {
	width: 30rem;
	height: 80rem;
    background: $blue;
    text-align: center;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      color: $light-gray;
      font-size: $font-size-xxl;
      text-align: center;
      margin: 3rem 0 3em 0;
      letter-spacing: .2rem;
	  
    }
	float: left;
}
</style>