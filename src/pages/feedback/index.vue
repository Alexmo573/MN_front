<template lang="html">
  <div class="df-poem">
    <div class="main">
      <div v-for="(item,index) in feedbackList">
        <div class="feedback">
          <el-button class="feedbackDel" size="mini" icon="delete" @click="removeFeedback(item)"></el-button>
          <div class="feedbackContent" v-html="item.content" :key="index"></div>
          <div id="feedbackFoot">{{item.projectName}}&nbsp;{{item.createTime}}</div>
        </div>
      </div>
      <el-button
        class="spinner btn-default"
        v-show="spinnerVisible"
        :loading="isLoading"
      >Loading...</el-button>
      <el-pagination
        small
        layout="prev, pager, next"
        @current-change="change"
        :pager-count="7"
        :page-size="3"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="checkDel"
      size="tiny">
      <span>确定删除该反馈？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="checkDel = false">取 消</el-button>
    <el-button type="primary" @click="remove(thisFeedback.id)" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {SPONSORED_URL} from "../../store/mutation-types"
import {
  mapGetters,
  mapActions
} from 'vuex'
import axios from "_axios@0.16.2@axios";
export default {
  name: 'feedback',
  data() {
    return {
      organization: 'green',
      getFeedbackUrl: SPONSORED_URL+'/FeedBack/AllByOrg',
      delFeedbackUrl: SPONSORED_URL+'/FeedBack/Id',
      feedbackList: [],
      total: 0,
      feedbackResult:{
        feedback:[]
      },
      spinnerVisible: false,  // 是否显示加载按钮
      isLoading: false,         // 加载按钮是否正在加载
      isLastPage: false, // 是否为最后一页
      checkDel: false,
      thisFeedback: [],
      fullscreenLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'poems',
      'poemLastPage',
      'poemCurrentPage'
    ])
  },
  // 当离开页面时,去除页面 scroll 事件
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.next, false)
    next()
  },
  created() {
    this.organization=window.localStorage.getItem('ID')
    this.getFeedback()

      // 重置分页参数
    this.resetPagination()
    // 加载诗文列表
  },
  methods: {
    change(val){
      this.axios({
        method: 'get',
        params: {
          organization: this.organization,
          index: val,
          pageSize: '3',
        },
        url: this.getFeedbackUrl
      }).then(response => {
        this.feedbackList=response.data.List
        this.total=response.data.Total
        console.log('feedback')
        console.log(response.data)
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~获取反馈失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    removeFeedback(item){
      this.checkDel=!this.checkDel
      this.thisFeedback=item
    },
    remove(id){
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 500);
      console.log(id)
      //post
      this.axios({
        method: 'delete',
        params: {
          id: id
        },
        url: this.delFeedbackUrl
      }).then(response => {
        console.log("delete")
        this.getFeedback()
        this.checkDel=!this.checkDel
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        });
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~删除失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    getFeedback() {
      this.axios({
        method: 'get',
        params: {
          organization: this.organization,
          index: '1',
          pageSize: '3',
        },
        url: this.getFeedbackUrl
      }).then(response => {
        this.feedbackList=response.data.List
        this.total=response.data.Total
        console.log('feedback')
        console.log(response.data)
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~获取反馈失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    resetPagination() {
      this.storePoemCurrentPage(0)
      this.storePoemLastPage(0)
    },
    // 下拉加载诗文列表
    async next() {
      // 当滚动到底部时 且 小于最后一页 且 没有正在加载中
      if (document.body.scrollTop + window.innerHeight >= document.body.scrollHeight &&
        this.poemCurrentPage < this.poemLastPage && !this.isLoading) {
        // 给加载按钮腾出50px空间
        document.querySelector('.df-poem').style.marginBottom = '50px'
        // 显示加载按钮 并 显示正在加载的 spinner
        this.spinnerVisible = this.isLoading = true
        // 获取诗文分页数据，去掉全局 Loading 事件
        await this.loadPoemList(true)
        // 隐藏加载按钮 与 停止 spinner
        this.spinnerVisible = this.isLoading = false
        // 归还腾出的空间
        document.querySelector('.df-poem').style.marginBottom = '0'
      } else if (this.poemCurrentPage === this.poemLastPage && !this.isLastPage) {
        // 若分页达最后一页，则抛出提醒信息
        this.$message({
          message: '到底啦。:)',
          type: 'warning',
          customClass: 'c-msg'
        })
        // 腾出50px的空间，显示提醒信息
        document.querySelector('.df-poem').style.marginBottom = '50px'
        this.isLastPage = true
      }
    },
    ...mapActions([
      'loadPoemList',
      'storePoemCurrentPage',
      'storePoemLastPage'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-poem
  fj(center,center)
  margin-top 20px
  .main
    width 70%
    position relative
    .spinner
      position absolute
      width 100%
    .last-page
      color Red
    .feedback
      background-color #eaf5df
      margin-bottom 12px
      margin-top 8px
      padding 10px
      border-radius 15px
      img
        width 60%
      .feedbackDel
        float right
      .feedbackContent
        margin 20px
        margin-top 30px
      #feedbackFoot
        font-size small
        margin-left 25px
        margin-bottom 20px
</style>
