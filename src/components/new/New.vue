<!--New.vue -->
<template>
	<div class="new-warp">
		<span class="glyphicon glyphicon-plus-sign" id='iconfont'></span>
		<h3 class="title">create a new questionare</h3>
		<router-link to='/edit' class='create'>create</router-link>
	</div>
</template>
<script>
export default {
  methods: {
    setMode () {
      window.sessionStorage.setItem('edit-mode', 'create')
    }
  }
}
</script>
<style>
@import "../../scss/mixin/mixin.scss";
@import "../../scss/variable.scss";
#iconfont {
	font-size: 1rem;
	display: inline-block;
}
.title {
	font-size: $font-size-xxl;
    letter-spacing: .2rem;
}
#iconfont, 
.title, {
	float: left;
}
.create {
	text-align: center;
}
</style>