<template>
  <div role="dialog" v-if="show">
    <div v-bind:class="{'modal-dialog':true}" v-bind:style="{width: optionalWidth}">
      <div v-if="structure.header" class="modal-content">
        <div class="modal-header">
          <span class="close" @click="close">&times;</span>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <div v-if="structure.body" class="modal-body">
          <slot name="modal-body"></slot>
        </div>
        <div v-if="structure.footer" class="modal-footer">
          <button type="button" class="btn btn-default" @click="close">{{ cancelText }}</button>
          <button type="button" class="btn btn-primary" @click="callback">{{ okText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    structure: {
      type: Object,
      default () {
        return {
          header: true,
          body: true,
          footer: true
        }
      }
    },
    okText: {
      type: String,
      default: 'Save changes'
    },
    cancelText: {
      type: String,
      default: 'Close'
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      default: null
    },
    callback: {
      type: Function,
      default () {}
    },
    effect: {
      type: String,
      default: null
    },
    backdrop: {
      type: Boolean,
      coerce: function (val) {
        return !!val
      },
      default: true
    }
  },
  computed: {
    optionalWidth () {
      if (this.width === null) {
        return null
      } else if (Number.isInteger(this.width)) {
        return this.width + 'px'
      }
      return this.width
    }
  },
  methods: {
    close () {
      this.show = false
    }
  }
}
</script>
<style>
</style>