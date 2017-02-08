<template>
	<div
		v-show="show"
		v-bind:class="{
		  'alert': true,
		  'alert-success':(type == 'success'),
		  'alert-warning':(type == 'warning'),
		  'alert-info':	(type == 'info'),
		  'alert-danger':	(type == 'danger'),
		  'top': (placement === 'top'),
		  'top-right': (placement === 'top-right')
		}"
		v-bind:style="{width:width}"
		role="alert">
		<span v-show="dismissable" class="alert-dismissible"><span class="close"
		  @click="show = false">&times;</span></span>
		<slot></slot>
	</div>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    dismissable: {
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      default: false
    },
    show: {
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      default: true,
      twoWay: true
    },
    duration: {
      type: Number,
      coerce: function (val) {
        return Number(val)
      },
      default: 0
    },
    width: {
      type: String
    },
    placement: {
      type: String
    }
  },
  watch: {
    show (val) {
      if (this._timeout) clearTimeout(this._timeout)
      if (val && Boolean(this.duration)) {
        this._timeout = setTimeout(() => { this.show = false }, this.duration)
      }
    }
  }
}
</script>
<style>
</style>