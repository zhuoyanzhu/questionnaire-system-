<!--Question.vue -->
<template>
	  <div>
		<div class="content">
			<p @keyup="changeQuestionTitle(qIndex, $event)" class="input title" contenteditable="true">{{ question.title }}</p>
			<ol v-if="question.type !== 'text'" class="answers">
				<li v-for="answer in question.answers" class="answer">
					<input class="select" :type='question.type' name="question qIndex + 1">
					<div class="option">
						<div class="input-fix">
							<p
							@keyup="changeOptionValue(qIndex, $index, $event)"
							@change="changeOptionValue(qIndex, $index, $event)"
							class="input"
							contenteditable="true">{{ answer }}</p>
						</div>
						<ul class="option-panel">
							<li
							@click="optionPositionFront(qIndex, $index)" class="iconfont">
								<span class='glyphicon glyphicon-arrow-up'>
								</span>
							</li>
							<li
							@click="optionPositionBack(qIndex, $index)" class="iconfont">
								<span class='glyphicon glyphicon-arrow-down'>
								</span>
							</li>
							<li
							v-show="question.answers.length > 2"
							@click="deleteOption(qIndex, $index)"  class="iconfont">
								<span class='glyphicon glyphicon-remove'>
								</span>
							</li>
						</ul>
					</div>
				</li>
			</ol>
			<div @click="addOption(qIndex)" v-if="question.type !== 'text'" class="add-option">
				<span class="glyphicon glyphicon-plus"></span>add option
			</div>
			<div v-else class="option">
				<textarea class="textarea"></textarea>
				<label for="isRequired"><input
				@change="changeTextRequired(qIndex, $event)"
				:checked="question.required"
				class="required"
				id="isRequired"
				type="checkbox">required</label>
			</div>
		</div>
		<div class="side">
			<div class="order">Q{{ qIndex + 1 }}</div>
			<ul class="opertions">
				<li@click="questionPositionFront(qIndex)">
					<span class='glyphicon glyphicon-arrow-up'>
					</span>
					move front
				</li>
				<li @click="questionPositionBack(qIndex)">
					<span class='glyphicon glyphicon-arrow-down'>
					</span>
					move back
				</li>
				<li @click="copyQuestion(qIndex)">
					<span class='glyphicon glyphicon-copy'>
					</span>
					copy
				</li>
				<li @click="deleteQuestion(qIndex)">
					<span class='glyphicon glyphicon-remove'>
					</span>
					delete
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
export default {
  props: {
    qIndex: {
      type: Number,
      required: true
    },
    question: {
      type: Object,
      required: true
    }
  },
  methods: {
    changeQuestionTitle (qIndex, e) {
      window.bus.$emit('change-question-title', qIndex, e.target.textContent)
    },
    questionPositionFront (oldIndex) {
      window.bus.$emit('question-pos-change', oldIndex, oldIndex - 1)
    },
    questionPositionBack (oldIndex) {
      window.bus.$emit('question-pos-change', oldIndex, oldIndex + 1)
    },
    deleteQuestion (qIndex) {
      window.bus.$emit('delete-question', qIndex)
    },
    changeOptionValue (qIndex, oIndex, e) {
      window.bus.$emit('change-option-value', qIndex, oIndex, e.target.textContent)
    },
    addOption (qIndex) {
      window.bus.$emit('add-option', qIndex)
    },
    deleteOption (qIndex, oIndex) {
      window.bus.$emit('delete-option', qIndex, oIndex)
    },
    copyQuestion (qIndex) {
      window.bus.$emit('copy-question', qIndex)
    },
    changeTextRequired (qIndex, e) {
      window.bus.$emit('change-text-required', qIndex, e.target.checked)
    },
    optionPositionFront (qIndex, oIndex) {
      window.bus.$emit('option-pos-change', qIndex, oIndex, oIndex - 1)
    },
    optionPositionBack (qIndex, oIndex) {
      window.bus.$emit('option-pos-change', qIndex, oIndex, oIndex + 1)
    }
  }
}
</script>
<style lang="scss">
@import "../../scss/base";
@import "../../scss/mixin/mixin";
.question {
  @include clearfix;
  padding: 1rem;
  border-radius: .4rem;
  list-style: none;
  &:hover {
    background-color: $bg-gray;
    .side {
      .opertions {
        visibility: visible !important;
      }
    }
    .add-option {
      visibility: visible !important;
    }
  }
  .side {
    float: left;
    margin-left: -100%;
    width: 3rem;
    font-size: $font-size-default;
    cursor: pointer;
    line-height: 1.5;
    text-align: center;
    .order {
      line-height: 2.4rem;
    }
    .opertions {
      margin-top: .3rem;
      list-style: none;
      padding: 0;
      visibility: hidden;
      line-height: 2;
      color: $gray;
      .iconfont:hover {
        color: $blue;
      }
    }
  }
  .content {
    float: left;
    width: 100%;
    padding-left: 4rem;
    .textarea,
    .input {
      border: 1px solid transparent;
      background-color: transparent;
      margin: 0;
      outline: none;
      &:hover {
        border-color: $blue;
        background-color: $bg-yellow;
      }
    }
    .title {
      font-size: $font-size-default;
      line-height: 1.5;
      width: 100%;
      max-width: 100%;
      border-radius: .3rem;
      line-height: 2.4rem;
      &:hover {
        border-color: $light-black;
        background-color: $bg-yellow;
      }
    }
    .answers {
      list-style: none;
      padding: 0;
      line-height: 2;
      font-size: $font-size-sm;
      color: $light-black;
      margin-top: .4rem;
      .answer {
        display: flex;
        align-items: flex-start;
        margin-bottom: .4rem;
        @include clearfix;
        .select {
          display: inline-block;
          height: 2.4rem;
          width: 2rem;
          float: left;
          position: relative;
        }
        .option {
          font-size: $font-size-default;
          float: left;
          width: 100%;
          margin-left: -2rem;
          padding-left: 2rem;
          @include clearfix;
          .input-fix {
            float: left;
            width: 100%;
            padding-right: 10rem;
            .input {
              line-height: 2.4rem;
              border: 1px solid transparent;
              background-color: transparent;
              margin: 0;
              outline: none;
              padding: 0 .2rem;
              border-radius: .3rem;
              color: #777;
            }
          }
          .option-panel {
            display: none;
            float: left;
            width: 10rem;
            margin-left: -12rem;
            font-size: $font-size-default;
            .iconfont {
              list-style: none;
              float: left;
              width: 2rem;
              line-height: 2.4rem;
              color: $blue;
              padding: 0;
              text-align: center;
              &:hover {
                color: lighten($blue, 30%);
              }
            }
          }
          &:hover {
            .input-fix {
              .input {
                border-color: $blue;
                background-color: $bg-yellow;
              }
            }
            .option-panel {
              display: block;
            }
          }
        }
      }
    }
    .add-option {
      margin-top: 1rem;
      font-size: $font-size-default;
      cursor: pointer;
      color: $gray;
      display: inline-block;
      line-height: 2;
      text-align: center;
      border-radius: .4rem;
      visibility: hidden;
      &:hover {
        color: $blue;
      }
      .iconfont {
        margin-right: .6rem;
      }
    }
    .option {
      .textarea {
        width: 100%;
        height: 10rem;
        margin-top: .8rem;
        border: 1px solid $light-black;
      }
      [for="isRequired"] {
        margin-top: 1rem;
        display: block;
        .required {
          margin-right: .4rem;
        }
      }
    }
  }
}
</style>