<template lang="html">
  <div class="df-home">
    <div class="main">
      <div class="billboard">
        <h3><i class="fa fa-fire"></i>我的项目</h3>
      </div>
      <!--展示所有项目-->
      <div v-if="showAll" class="allPro">
        <div>
          <div id="block" v-for="(item,index) in projectList" :key="index" @click="showDetail(item)">
            <!--img :src=item.picPaths[0] alt="loading" id="picture"-->
            <el-carousel height="350px">
              <el-carousel-item v-for="(pic,index2) in item.picPaths" :key="index2">
                <img :src="pic">
              </el-carousel-item>
            </el-carousel>
            <h2>{{ item.projectName }}</h2>
            <div id="proDescribe">
              描述：{{ item.describe }}
              <div id="status">状态：{{ item.status }}</div>
            </div>
            <div id="fee">月费：{{ item.monthFee }}</div>
            <div id="time">创建时间：{{ item.createTime }}</div>
          </div>
        </div>
        <el-pagination
          class="page"
          small
          layout="prev, pager, next"
          @current-change="changePage"
          :pager-count="9"
          :page-size="4"
          :total="total">
        </el-pagination>
      </div>
      <!--展示项目详情-->
      <div v-else id="detail">
        <div id="option" v-show="showOption">
          <el-button type="success" @click="detailGoback">返回</el-button>
          <el-button @click="edict" type="success">编辑项目</el-button>
          <el-button @click="feedback" type="success">发布反馈</el-button>
          <el-button @click="notice" type="success">发布公告</el-button>
        </div>
        <!--项目详情、公告-->
        <div class="subject" v-if="option==='subjectOption'">
          <h2>{{ thisProject.projectName }}</h2>
          <div >
            描述：{{ thisProject.describe }}
            <div >状态：{{ thisProject.status }}</div>
          </div>
          <div >月费：{{ thisProject.monthFee }}</div>
          <div >创建时间：{{ thisProject.createTime }}</div>
          <div v-for="(pic,index) in thisProject.picPaths">
            <img id="pic" :src=pic alt="loading" :key="index">
          </div>
          <div>
            <div id="noticeLis" v-for="(item,index) in noticeList">
              <div id="noticeBlock" :key="index">
                <div>{{item.content}}</div>
                <div id="motTime">{{item.createTime}}</div>
              </div>
            </div>
            <el-pagination
              class="page"
              small
              layout="prev, pager, next"
              @current-change="changePageNotice"
              :pager-count="9"
              :page-size="4"
              :total="totalNotice">
            </el-pagination>
          </div>
        </div>
        <!--编辑项目-->
        <div v-else-if="option==='edictOption'">
          <div id="button">
            <el-button type="info" size="small" @click="edictGoback">返回</el-button>
            <el-button type="info" size="small" @click="submitEdict">提交</el-button>
          </div>
          <h3>项目名称</h3>
          <el-input v-model="projectName " placeholder="请输入项目名称"></el-input>
          <h3>项目月费</h3>
          <el-input v-model="monthFee" type="number" min="0" placeholder="请输入项目月费"></el-input>
          <h3>项目状态</h3>
          <el-radio-group v-model="radio" v-if="!isCheck">
            <el-radio :label="1" :disabled="isCheck">进行中</el-radio>
            <el-radio :label="2" :disabled="isCheck">结束</el-radio>
          </el-radio-group>
          <el-radio :label="3" disabled v-else>审核中</el-radio>
          <h3>项目图片</h3>
          <el-upload
            class="upload"
            :action="contentPictureUrl"
            :data="pictureData"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list=" fileList"
            name="picture"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <div v-for="(pic,index) in picPaths">
            <img id="edictPic" :src=pic alt="loading" :key="index">
          </div>

          <h3 id="subjectDescribe">项目描述</h3>
          <el-input
            type="textarea"
            :autosize="{ minRows: 16, maxRows: 100}"
            placeholder="请输入项目描述信息"
            v-model="describe">
          </el-input>

        </div>
        <!--发布项目公告、反馈-->
        <div id="release" v-else>
          <h3>发布 {{ thisProject.projectName }} 项目反馈</h3>
          <div id="button">
            <el-button type="success" size="small" @click="releaseGoback">返回</el-button>
            &nbsp;
            <!--el-button type="success" size="small" @click="saveRelease">保存</el-button-->
            &nbsp;&nbsp;
            <el-button type="info" size="small" @click="submitRelease">提交</el-button>
          </div>
          <editor v-model:value="feedbackContent" :pictureUrl="feedbackPictureUrl" :dataTr="dataTrans"></editor>
        </div>
        <!--编辑返回弹窗-->
        <el-dialog
          title="提示"
          :visible.sync="edictBack"
          size="tiny">
          <span>编辑内容未提交，确认离开？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="edictBack = false">取 消</el-button>
            <el-button type="primary" @click="edictGobackSure" >确 定</el-button>
          </span>
        </el-dialog>
        <!--发布反馈返回弹窗-->
        <el-dialog
          title="提示"
          :visible.sync="releaseBack"
          size="tiny">
          <span>编辑内容未保存，确认离开？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="releaseBack = false">取 消</el-button>
            <el-button type="primary" @click="releaseGobackSure" >确 定</el-button>
          </span>
        </el-dialog>
        <!--发布公告-->
        <el-dialog
          title="发布公告"
          :visible.sync="addNotice"
          >
          <h3>公告内容</h3>
          <el-input
            type="textarea"
            :autosize="{ minRows: 16, maxRows: 20}"
            placeholder="请输入公告内容"
            v-model="noticeContent">
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addNotice = false">取 消</el-button>
            <el-button type="primary" @click="submitNotice" >发 布</el-button>
          </span>
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import api from '@/api'
import Qs from 'qs'
import editor from "@/components/editor";
import {BASE_URL, UPLOAD_PICTURE_URL, PROJECT_NOTICE, SPONSORED_URL} from "../../store/mutation-types";

export default {
  name: 'home',
  components: {
    editor,
  },
  data() {
    return {
      localData: {},
      fileList: [],
      delFeedbackUrl: SPONSORED_URL+'/FeedBack',
      getProjectUrl: SPONSORED_URL+'/projects/Org',
      getProjectUrlByPage: SPONSORED_URL+ '/projects/OrgPlusPage',
      feedbackPictureUrl: SPONSORED_URL +'/FeedBack/addPicCon',
      changeProjectUrl: SPONSORED_URL+'/Project',
      submitNoticeUrl: SPONSORED_URL+'/Notice/sim',
      addFeedback: SPONSORED_URL+'/FeedBack',
      submitFeedbackUrl: SPONSORED_URL+'/FeedBack/savePlusSubmit',
      projectNoticeUrl: SPONSORED_URL+'/Notice/SBPlusPage',
      contentPictureUrl:SPONSORED_URL+'/Project/addPicCon',
      content: '',
      option: 'subjectOption',
      showOption: true,
      showAll: true,
      isCheck: false,
      thisProject: {},
      edictProject: {},
      organization: 'green',
      projectList: [],
      total: 0,
      totalNotice: 0,
      noticeList: [],
      //发布公告相关
      addNotice: false,
      noticeContent: '',
      noticeTime: '',
      //编辑项目相关
      pictureData: {id:''},
      radio: 1,
      id: '',
      projectName: '',
      monthFee: '',
      describe: '',
      picPaths: [],
      //反馈相关
      feedbackTime: '',
      feedbackContent: '',
      dataTrans:{
        subjectId: '',
        createTime: '',
      },
      //返回相关
      edictBack: false,
      releaseBack: false,
    }
  },
  created() {
    this.organization=window.localStorage.getItem('ID')
    this.getSubject()
  },
  methods: {
    //自定义休眠函数
    sleep(delay) {
      var start = (new Date()).getTime();
      while((new Date()).getTime() - start < delay) {
        continue;
      }
    },
    //提交反馈
    submitRelease() {
      console.log(this.feedbackTime)
      console.log(this.thisProject.id)
      console.log(this.feedbackContent)
      if(this.feedbackContent===''){
        this.$message({
          message: 'error/(ㄒoㄒ)/~~反馈内容不能为空',
          type: 'error',
        })
      }else{
        let formData = new URLSearchParams()
        formData.append('subjectId',this.thisProject.id);
        formData.append('createTime',this.feedbackTime);
        formData.append('content',this.feedbackContent);
        formData.append('status','complete');
        console.log(formData)
        this.axios({
          method: 'post',
          data: formData,
          url: this.submitFeedbackUrl
        }).then(response => {
          this.$message({
            message: '提交成功。感谢你的支持，拜谢!',
            type: 'success',
          })
          this.sleep(500)
          //返回项目详情
          /*   this.option='subjectOption'
             this.showOption=!this.showOption
             //从项目详情返回
             this.detailGoback()*/
          //刷新
          location.reload()
        }).catch(error => {
          this.$message({
            message: 'error/(ㄒoㄒ)/~~反馈失败',
            type: 'error',
          })
          Promise.reject(error)
        })
      }
    },
    //提交公告
    submitNotice(){
      console.log(this.thisProject.id)
      console.log(this.noticeContent)
      if(this.noticeContent===''){
        this.$message({
          message: 'error/(ㄒoㄒ)/~~公告内容不能为空',
          type: 'error',
        })
      }else{
        let formData = new URLSearchParams()
        formData.append('subjectId',this.thisProject.id);
        formData.append('content',this.noticeContent);
        this.axios({
          method: 'post',
          params:formData,
          url: this.submitNoticeUrl
        }).then(response => {
          this.$message({
            message: '公告发布成功。感谢你的支持，拜谢!',
            type: 'success',
          })
          this.sleep(300)
          this.addNotice=!this.addNotice
          location.reload()
        }).catch(error => {
          this.$message({
            message: 'error/(ㄒoㄒ)/~~公告发布失败',
            type: 'error',
          })
          Promise.reject(error)
        })
      }
    },
    //提交编辑
    submitEdict(){
      if(this.radio===1){
        this.status='on'
      }else if(this.radio===2){
        this.status='off'
      }else{
        this.status='created'
      }
      //post
      this.axios({
        method: 'put',
        params: {
          id: this.id,
          projectName	: this.projectName,
          organization: this.organization,
          status: this.status,
          describe: this.describe,
          monthFee: this.monthFee,
        },
        url: this.changeProjectUrl
      }).then(response => {
        this.$message({
          message: '提交成功。感谢你的支持，拜谢!',
          type: 'success',
        })
        this.sleep(500)
        //返回项目详情
     /*   this.option='subjectOption'
        this.showOption=!this.showOption
        //从项目详情返回
        this.detailGoback()*/
        //重新加载
        location.reload()
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    //反馈编辑界面返回上一级
    releaseGoback(){
      this.releaseBack=true
    },
    releaseGobackSure(){
      this.axios({
        method: 'delete',
        params: {
          subjectId: this.thisProject.id,
          time: this.feedbackTime,
        },
        url: this.delFeedbackUrl
      }).then(response => {
        this.option='subjectOption'
        this.showOption=!this.showOption
        this.releaseBack=false
      }).catch(error => {
        this.$message({
          message: 'sorry,网络卡顿，请稍等/(ㄒoㄒ)/~~',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    //编辑界面返回上一级
    edictGoback(){
      this.edictBack=true
    },
    edictGobackSure(){
      this.option='subjectOption'
      this.showOption=!this.showOption
      this.edictBack=false
    },
    //删除图片
    deletePic(pic){
      alert("click"+pic)
    },
    //编辑项目
    edict(){
      //进入编辑模式，控制页面的显示信息
      this.option='edictOption'
      this.showOption=!this.showOption
      //所选项目的信息传到临时变量
      this.pictureData.id=this.thisProject.id
      this.projectName=this.thisProject.projectName
      this.monthFee=this.thisProject.monthFee
      this.describe= this.thisProject.describe
      this.picPaths= this.thisProject.picPaths
      this.id=this.thisProject.id
      if(this.thisProject.status==='created'){
        this.isCheck=true
      }else if(this.thisProject.status==='on'){
        this.radio=1
      }else{
        this.radio=2
      }
    },
    //项目详情
    showDetail(project) {
      this.showAll = !this.showAll
      this.option='subjectOption'
      this.thisProject = project
      console.log(project)
      this.axios({
        method: 'get',
        params: {
          subjectId: this.thisProject.id,
          index: '1',
          pageSize: '4',
        },
        url: this.projectNoticeUrl
      }).then(response => {
        console.log("notice")
        console.log(response.data)
        this.noticeList=response.data.List.content
        this.totalNotice=response.data.Total
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~获取项目公告失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    //发布反馈
    feedback() {
      this.option=''
      this.showOption=!this.showOption
      //创建空反馈
      this.axios({
        method: 'post',
        params: {
          subjectId	: this.thisProject.id,
        },
        url: this.addFeedback
      }).then(response => {
        console.log("feedback data")
        console.log(response.data)
        this.feedbackTime=response.data
        this.dataTrans.createTime=response.data
        this.dataTrans.subjectId=this.thisProject.id
        console.log(this.feedbackTime)
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~无法发布反馈',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    //发布公告
    notice() {
        this.addNotice=!this.addNotice
    },
    //从项目详情返回
    detailGoback(){
      this.showAll = !this.showAll;
    },
    //保存反馈、公告
    saveRelease() {

    },
    changePageNotice(val){
      this.axios({
        method: 'get',
        params: {
          subjectId: this.thisProject.id,
          index: val,
          pageSize: '4',
        },
        url: this.projectNoticeUrl
      }).then(response => {
        this.noticeList=response.data.List.content
        this.totalNotice=response.data.Total
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~获取项目公告失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    changePage(val){
      this.axios({
        method: 'get',
        params: {
          organization: this.organization,
          index: val,
          pageSize: '4',
        },
        url: this.getProjectUrlByPage
      }).then(response => {
        this.projectList=response.data.List.content
        this.total=response.data.Total
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~获取项目失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    getSubject() {
      this.axios({
        method: 'get',
        params: {
          organization: this.organization,
          index: '1',
          pageSize: '4',
        },
        url: this.getProjectUrlByPage
      }).then(response => {
        console.log(response.data.List)
        console.log("getsubject")
        console.log(response.data)
        this.projectList=response.data.List.content
        this.total=response.data.Total
      }).catch(error => {
        this.$message({
          message: 'error/(ㄒoㄒ)/~~获取项目失败',
          type: 'error',
        })
        Promise.reject(error)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    ...mapMutations([
      'TOGGLE_LOADING_STATUS'
    ])
  }

}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-home
  margin: 0 auto
  fj(center)
  margin-top 20px
  .billboard
    border-bottom 1px solid Extra-Light-Grey
    color Silver
    width 90%
    margin-left 3%
    i
      margin-right 20px
      color Red
  .main
    width 80%
    margin-right 50px

  .side
    width 20%
.allPro{
  margin-left 3%
}
#noticeLis{
  clear left
  margin-top 15px
}
#noticeBlock{
  border-style: inset;
  border-radius: 8px;
  border-width: 2px;
  padding: 12px;
  margin-top: 20px;
  margin-bottom 15px
}
#motTime{
  font-size small
  margin-top 8px
  margin-left 75%
}

#detail{
  width 80%
  margin: 0 auto;
}
#subject {
  background-color #c5efbe
  padding 10px
  margin-bottom 12px
  margin-top 12px
  border-radius 15px
}

#proDescribe {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
}

#button {
  margin-bottom 10px
  margin-top 15px
}
#option{
  margin-top 15px
}
#subjectDescribe{
  clear left
  margin-top 10px
}
#picture {
  display: block;
  margin: 10px
  width: 98%;
  height: 380px;
}
#pic{
  display: block;
  margin: 10px
  width: 31%;
  height: 220px;
  float left
}
#edictPic{
  display: block;
  margin: 10px
  width: 31%;
  height: 220px;
  float left
}
#edictPic:hover{
  cursor: pointer;
  filter: brightness(120%);
}
#block {
  border-style: inset;
  border-radius: 15px;
  border-width: 5px;
  padding: 12px;
  background-color: #eaf5df;
  height 500px
  width: 42%;
  float left
  margin 15px
}
.page{
  clear left
}
#block:hover {
  border-style: inset;
  border-radius: 15px;
  border-width: 5px;
  transition-duration: 300ms;
  padding: 12px;
  background-color: #eaf5df;
  cursor: pointer;
  filter: brightness(105%);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
