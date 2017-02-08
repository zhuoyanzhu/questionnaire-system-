<!--Main.vue -->
<template>
	<div class="layout">
		<layout-header class='header'></layout-header>
		<layout-body></layout-body>
	</div>
</template>
<script>
import LayoutHeader from './Lheader'
import LayoutBody from './Lbody'
export default {
  components: {
    LayoutHeader,
    LayoutBody
  }
}
</script>
<style lang="scss" scoped>
.layout {
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}

</style>