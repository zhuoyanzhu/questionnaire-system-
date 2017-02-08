<template>
	<div class="container">
	    <div class="welcome">
          <h4>welcome {{ userName }}</h4>
		</div>
		<ul class="panel">
          <li v-for="item in routeItems">
			<div class='element'>
              <span :class=item.icon id='iconfont'></span>
			  <a @click=changeChosen(item.choose)>{{item.text}}</a>
			</div>
		  </li>
		</ul>
		<div v-if='chosen=="my"'>
			<questionare></questionare>
		</div>
		<div v-else>
			<new></new>
		</div>
	</div>
</template>
<script>
import New from '../new/New'
import Questionare from '../questionare/Questionare'
export default {
  data () {
    return {
      chosen: 'my',
      userName: '',
      routeItems: [
        {
          choose: 'my',
          icon: {
            'glyphicon glyphicon glyphicon-zoom-in': true
          },
          text: 'my questionare'
        },
        {
          choose: 'new',
          icon: {
            'glyphicon glyphicon-plus-sign': true
          },
          text: 'new questionare'
        }
      ]
    }
  },
  methods: {
    changeChosen (chosen) {
      this.chosen = chosen
    }
  },
  created: function () {
    window.fetch('/getUserName', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(res => {
      return res.json
    })
    .then(result => {
      if (result.code === 0) {
        this.userName = result.userName
      }
      if (result.code === -1) {
        this.$router.push({ path: '/' })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  components: {
    New,
    Questionare
  }
}
</script>
<style lang="scss" scoped>
@import "../../scss/mixin/mixin.scss";
@import "../../scss/variable.scss";
.container {
    width: 100%;
	height: 100%;
    padding-left: 30rem;
    margin-left: -30rem;
	float: left;
	.welcome {
		font-size: $font-size-xxl;
		text-align: center;
	}
	#iconfont {
		font-size: 1.5rem;
		display: inline-block;
    }
	.panel {
		text-align: left;
	}
	.element {
		margin-bottom: 2em;
		margin-top: 2em;
	}
}
</style>