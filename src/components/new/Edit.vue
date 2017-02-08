<!--Edit.vue -->
<template>
	<div class='warp'>
		<div class='qnwarp'>
			<header class="header">
				<input type="text" class="title" placeholder="questionare title" v-model="title">
			</header>
			<div class='qn'>
				<div class='body'>
					<div class="body-wrap">
						<ol v-if="questions.length !== 0" class="questions">
							<li is="question" v-for="(qIndex, q) in questions" track-by="$index" 
							:q-index="q" :question="qIndex" class="question qIndex.type">
							</li>
						</ol>
						<div class='tools'>
							<div class="toolbar">
								<span @click="addQuestion('radio')"><span class="glyphicon glyphicon-record" id='iconfont'></span>radio</span>
								<span @click="addQuestion('checkbox')"><span class="glyphicon glyphicon-unchecked" id='iconfont'></span>checkbox</span>
								<span @click="addQuestion('text')"><span class="glyphicon glyphicon-comment" id='iconfont'></span>text</span>
							</div>
							<div class="add-btn"><span class="glyphicon glyphicon-plus" id='iconfont'></span>add question</div>
						</div>
					</div>
				</div>
			</div>
			<footer class="footer">
				<div class="pick-date">
					<span class="msg">questionare expire date</span>
					<input type="date" :value='expires'>
				</div>
				<div class="operation">
					<span class="btn" :class="{ disabled: isLoading }" @click="saveBtnHandler">save questionare</span>
					<span class="btn" :class="{ disabled: isLoading }" @click="publishBtnHandler">publish questionare</span>
				</div>
			</footer>
		</div>
		<div>
			<alert :show="showAlert" placement="top" duration="3000" type="warning" width="400px" dismissable>
				<strong>You are leaving present page ...</strong>
				<p>Do you need to save the page£¿</p>
			</alert>
			<model
				:show="showModal"
				cancel-text="cancel"
				ok-text="confirm"
				:callback="modalCallback"
				title="hint" >
				<div slot="modal-body">
					<div>You have not saved the page, are you sure to give up£¿</div>
				</div>
			</model>
		</div>
	</div>
</template>
<script>
import Question from './Question'
import Alert from '../common/Alert'
import Model from '../common/Model'
import uuid from 'uuid'
export default {
  data () {
    let editMode
    if (!window.sessionStorage.getItem('edit-mode')) {
      editMode = 'create'
      window.sessionStorage.setItem('edit-mode', 'create')
    } else {
      editMode = window.sessionStorage.getItem('edit-mode')
    }
    let defaults = {
      title: 'questionare title',
      questions: [],
      showAlert: false,
      publish: false,
      showModal: false,
      routerCanDeactivate: false,
      expires: '',
      qnId: -1,
      isLoading: false
    }
    if (editMode === 'create') {
      Object.assign(defaults, { qnId: this.createId() })
    }
    return defaults
  },
  computed: {
    questionaire () {
      return {
        title: this.title,
        questions: this.questions,
        expires: this.expires,
        publish: this.publish,
        qnId: this.qnId
      }
    }
  },
  created: function () {
    window.bus.$on('change-option-value', this.changeOptionValue)
    window.bus.$on('change-option-title', this.changeOptionTitle)
    window.bus.$on('question-pos-change', this.questionPosChange)
    window.bus.$on('add-option', this.addOption)
    window.bus.$on('delete-option', this.deleteOption)
    window.bus.$on('delete-question', this.deleteQuestion)
    window.bus.$on('copy-question', this.copyQuestion)
    window.bus.$on('change-text-required', this.changeTextRequired)
    window.bus.$on('option-pos-change', this.optionPosChange)
    window.bus.$on('date-change', this.dateChange)
    let editMode = window.sessionStorage.getItem('edit-mode')
    let currentQnId = window.sessionStorage.getItem('current-qn-id')
    if (editMode === 'modify') {
      window.fetch(`/getUserQnData?qnId=${currentQnId}`, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => {
        return response.json()
      })
      .then(result => {
        if (result.code === 1) {
          let qnData = result.data
          this.title = qnData.title
          this.questions = qnData.questions
          this.publish = qnData.publish
          this.expires = qnData.expires
          this.qnId = qnData.qnId
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  beforeDestory: function () {
    window.bus.$off('change-option-value', this.changeOptionValue)
    window.bus.$off('change-option-title', this.changeOptionTitle)
    window.bus.$off('question-pos-change', this.questionPosChange)
    window.bus.$off('add-option', this.addOption)
    window.bus.$off('delete-option', this.deleteOption)
    window.bus.$off('delete-question', this.deleteQuestion)
    window.bus.$off('copy-question', this.copyQuestion)
    window.bus.$off('change-text-required', this.changeTextRequired)
    window.bus.$off('option-pos-change', this.optionPosChange)
    window.bus.$off('date-change', this.dateChange)
  },
  components: {
    Question,
    Model,
    Alert
  },
  methods: {
    saveData () {
      if (!this.isLoading) {
        let editMode = window.sessionStorage.getItem('edit-mode')
        this.isLoading = true
        window.fetch('/updateUserQnData', {
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `qnData=${JSON.stringify(this.questionaire)}&editMode=${editMode}`,
          credentials: 'same-origin'
        })
        .then(res => {
          return res.json()
        })
        .then(result => {
          if (result.code === 0 || result.code === 1) {
            this.canDeactivate = true
            this.$router.push({ path: '/main' })
          } else if (result.code === -1) {
            this.canDeactivate = true
            this.$router.push({ path: '/' })
          }
        })
      }
    },
    canDeactivate () {
      if (!this.canDeactivate) {
        this.showModal = true
        return false
      }
      return true
    },
    saveBtnHandler () {
      this.saveData()
    },
    modalCallback () {
      this.canDeactivate = true
      this.$router.push({ path: '/main' })
    },
    publishBtnHandler () {
      this.publish = true
      this.saveBtnHandler()
    },
    addQuestion (type) {
      let option = {
        title: 'question title',
        type: type
      }
      if (type !== 'text') {
        option.answers = ['option1', 'option2']
        option.answersData = [this.getRandomNumber(), this.getRandomNumber()]
      } else {
        option.required = false
        option.text = ''
      }
      this.questions.push(option)
    },
    createId () {
      return uuid.v1()
    },
    getRandomNumber () {
      return Math.floor(Math.random() * 30)
    },
    transposition (arr, oldIndex, newIndex) {
      let value = arr.splice(oldIndex, 1)[0]
      arr.splice(newIndex, 0, value)
    },
    changeOptionValue: function (qIndex, oIndex, value) {
      this.questions[qIndex].answers[oIndex] = value
    },
    changeOptionTitle: function (qIndex, value) {
      this.questions[qIndex].title = value
    },
    questionPosChange: function (oldIndex, newIndex) {
      this.transposition(this.questions, oldIndex, newIndex)
    },
    addOption: function (qIndex) {
      this.questions[qIndex].answers.push('option' + (this.questions[qIndex].answers.length + 1))
      this.questions[qIndex].answersData.push(this.getRandomNumber())
    },
    deleteOption: function (qIndex, oIndex) {
      this.questions[qIndex].answers.splice(oIndex, 1)
      this.questions[qIndex].answersData.pop()
    },
    deleteQuestion: function (qIndex) {
      this.questions.splice(qIndex, 1)
    },
    copyQuestion: function (qIndex) {
      let temp = JSON.stringify(this.questions[qIndex])
      let newQ = JSON.parse(temp)
      this.questions.push(newQ)
    },
    changeTextRequired: function (qIndex, required) {
      this.questions[qIndex].required = required
    },
    optionPosChange: function (qIndex, oOldIndex, oNewIndex) {
      this.transposition(this.questions[qIndex].answers, oOldIndex, oNewIndex)
      this.transposition(this.questions[qIndex].answersData, oOldIndex, oNewIndex)
    },
    dateChange: function (dateValue) {
      this.expires = dateValue
    }
  }
}
</script>
<style lang="scss">
@import "../../scss/base";
@import "../../scss/mixin/mixin";
.disabled {
  @include btn-disabled;
}
.qnwarp {
  padding: 3rem 6rem;
  border-top: 1px solid $line-color;
  background: $bg-gray;
  height: 100%;
  overflow: auto;
  @at-root {
    .qn {
      background-color: #fff;
      border-radius: .4rem;
      box-shadow: .1rem .1rem .4rem 0 #aaa;
      display: inline-block;
      width: 100%;
      .header {
        @include placeholder-style {
          text-align: center;
        };
        text-align: center;
        .title {
          text-align: center;
          width: 80%;
          outline: none;
          padding: 0 1rem;
          margin: 2rem auto;
          border: 1px solid transparent;
          font-size: $font-size-lg;
          line-height: 3rem;
          &:focus {
            border-color: $light-black;
            background: $bg-yellow;
          }
        }
      }
      .body {
        padding: 0 1rem;
        .body-wrap {
		  overflow: scroll;
		  height: 600px;
          border-top: 1px solid $line-color;
          border-bottom: 1px solid $line-color;
          margin-bottom: 2rem;
          @at-root .questions {
            padding: 2rem 0;
          }
          .tools {
            text-align: center;
            border-radius: 0;
            margin: 1rem auto;
            border: 1px solid $gray;
            &:hover {
              .toolbar {
                height: 4.4rem;
              }
              .add-btn {
                background: $light-gray;
              }
            }
            @at-root .toolbar {
              height: 0;
              overflow: hidden;
              transition: height .3s ease;
              .btn {
                @include button(.5rem, .2rem, $light-black);
                margin: 1rem .5rem;
                display: inline-block;
                line-height: 1.8rem;
                .iconfont {
                  margin-right: .3rem;
                }
              }
            }
            @at-root .add-btn {
              .iconfont {
                margin-right: .5rem;
              }
              background: $bg-gray;
              cursor: pointer;
              font-size: $font-size-default;
              color: $light-black;
              line-height: 3;
              width: 100%;
            }
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    .pick-date {
      display: inline-block;
      .msg {
        margin-right: 1rem;
      }
    }
    .operation {
      flex-grow: 1;
      text-align: right;
      .btn {
        border: 1px solid $light-black;
        padding: .2rem 1rem;
        border-radius: .4rem;
        cursor: pointer;
        margin-left: 1rem;
        &:last-child {
          margin-right: 10rem;
        }
        &:hover {
          background-color: $blue;
          color: #fff;
        }
      }
    }
  }
}
</style>