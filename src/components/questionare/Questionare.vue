<!--Questionare.vue -->
<template>
	 <div class="wrap">
		<table class="table" v-if="qnData.length !== 0">
		    <thead>
				<th></th>
				<th>questionare name</th>
				<th>expire time</th>
				<th>status</th>
				<th>edit</th>
			</thead>
			<tbody>‘
				<tr v-for="qn in qnData">
					<td><span @click="toggleSelect(qn.qnId)" :class="chooseIcon(qn.qnId)"></span></td>
					<td>{{qn.title}}</td>
					<td><time class="time">{{qn.expires}}</time></td>
					<td><span class="status">{{ judgeStatus(qn) }}</span></td>
					<td>
						<div class="tools">
							<span @click="deleteBtnClickHandler(qn)" class="glyphicon glyphicon-remove"></span>
							<span class="btn btn-primary btn-block" @click="editQn(qn)"> edit</span>
							<span class="btn btn-primary btn-block">{{ 'show data' }}</span>
							<span>{{showDeleteSelectedModal}}</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="btn-group" v-if="qnData.length !== 0">
			<button class="btn btn-primary btn-block" @click="selectAll">{{isSelectAll}}</button>
			<button class="btn btn-primary btn-block" @click="deleteSelectedBtnHandler">delete</button>
		</div>
		<div v-else class='default'>
			<p><span class="glyphicon glyphicon-question-sign" id='iconfont'></span></p>
			<p class='show'>You have not created any questionare</p>
		</div>
    <!-- delete one questionare-->
		<modal
		  :show="showDeleteModal"
		  cancel-text="cancel"
		  ok-text="confirm"
		  :callback="deleteQnModalHandler"
		  title="hint" >
			<div slot="modal-body">
				<p>Are you sure to delete <span :style="{ color: '#999' }">{{qnTitleIfDelete}}</span>this questionare？</p>
			</div>
		</modal>
	
    <!-- delete multi questionare -->
		<modal
		  :show="showDeleteSelectedModal"
		  cancel-text="cancel"
		  ok-text="confirm"
		  :callback="deleteSelectedHandler"
		  title="hint" >
			<div slot="modal-body">
				<p>Are you sure to delete  <span :style="{ color: '#999' }">{{qnSelected.length}}</span> questionares?</p>
			</div>
		</modal>
	 </div>
</template>
<script>
import Modal from '../common/Model'
export default {
  components: {
    Modal
  },
  data () {
    return {
      qnData: [],
      qnSelected: [],
      showDeleteModal: false,
      qnTitleIfDelete: '',
      qnIdIfDelete: -1,
      showDeleteSelectedModal: false,
      isSelectAll: 'select all'
    }
  },
  created () {
    this.getQnData()
  },
  methods: {
    getQnData () {
      window.fetch('/getUserQnData', {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json
      })
      .then(result => {
        if (result.code === 0) {
          this.qnData = result.data
        }
        if (result.code === -2) {
          this.$router.push({ path: '/' })
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    inArray (arr, val) {
      return arr.some(v => v === val)
    },
    chooseIcon (id) {
      return this.inArray(this.qnSelected, id) ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'
    },
    addSelect (id) {
      this.qnSelected.push(id)
    },
    deleteSelect (id) {
      this.qnSelected.some((item, index) => {
        if (item === id) {
          this.qnSelected.splice(index, 1)
          return true
        }
      })
    },
    toggleSelect (id) {
      if (this.inArray(this.qnSelected, id)) {
        this.deleteSelect(id)
      } else {
        this.addSelect(id)
      }
    },
    deleteBtnClickHandler (qn) {
      this.showDeleteModal = true
      this.qnTitleIfDelete = qn.title
      this.qnIdIfDelete = qn.qnId
    },
    deleteQnModalHandler () {
      this.showDeleteModal = false
      this.deleteQn(this.qnIdIfDelete)
    },
    deleteSelectedBtnHandler () {
      if (this.qnSelected.length !== 0) {
        this.showDeleteSelectedModal = true
      }
    },
    deleteSelectedHandler () {
      this.showDeleteSelectedModal = false
      this.deleteAll()
    },
    deleteQn (qnId) {
      window.fetch('/deleteUserQn', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `qnId=${qnId}`,
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json
      })
      .then(result => {
        if (result.code === 1) {
          this.getQnData()
          this.qnSelected = []
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    deleteAll () {
      window.fetch('/deleteUserQn', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `qnList=${JSON.stringify(this.qnSelected)}`,
        credentials: 'same-origin'
      })
      .then(res => {
        return res.json
      })
      .then(result => {
        if (result.code === 0) {
          this.getQnData()
          this.qnSelected = []
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    editQn (qn) {
      window.sessionStorage.setItem('edit-mode', 'modify')
      window.sessionStorage.setItem('current-qn-id', qn.qnId)
      this.$router.push({ path: '/edit' })
    },
    judgeStatus (qn) {
      let qnExpires = new Date(qn.expires).getTime()
      if (qnExpires < new Date().getTime()) {
        return 'overdue'
      } else if (qn.publish) {
        return 'published'
      } else {
        return 'unpublished'
      }
    },
    selectAll () {
      if (this.qnSelected.length === this.qnData.length) {
        this.qnSelected = []
        this.isSelectAll = 'select all'
      } else {
        this.qnSelected = []
        let len = this.qnData.length
        let i = 0
        while (i < len) {
          this.qnSelected.push(this.qnData[i].qnId)
          i++
        }
        this.isSelectAll = 'cancel all'
      }
    }
  }
}
</script>
<style>
@import "../../scss/mixin/mixin.scss";
@import "../../scss/variable.scss";
#iconfont {
	font-size: 2rem;
	display: inline-block;
}
.show {
	font-size: $font-size-xxl;
    letter-spacing: .2rem;
}
#iconfont,
.show {
	float: left;
}
.default {
	padding-left: 10rem;
}
</style>