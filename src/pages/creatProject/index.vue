<template lang="html">
  <section class="df-feedback">
    <div class="main-wrapper">
      <div class="main">
        <h2 id="newSubject">创建新项目</h2>
        <div>
          <h3>项目名称</h3>
          <el-input v-if="creat" v-model="project.projectName" placeholder="请输入项目名称"></el-input>
          <div v-else>{{project.projectName}}</div>
          <h3>项目月费</h3>
          <el-input v-if="creat" v-model="project.monthFee" type="number" min="0" placeholder="请输入项目月费"></el-input>
          <div v-else>{{project.monthFee}}</div>
          <h3 v-show="creatPic">项目图片</h3>
          <el-upload
            v-show="creatPic"
            class="upload"
            :action="pictureUploadUrl"
            :on-preview="handlePreview"
            :file-list="fileList"
            :on-error="uploadError"
            :before-upload="quillImgBefore"
            :multiple="false"
            name="picture"
            accept='.jpg,.jpeg,.png,.gif'
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <h3>项目描述</h3>
          <el-input
            v-if="creat"
            type="textarea"
            :autosize="{ minRows: 16, maxRows: 100}"
            placeholder="请输入项目描述信息"
            v-model="project.describe">
          </el-input>
          <div v-else>{{project.describe}}</div>
          <div v-show="creat" id="button">
            <el-button type="info" size="small" @click="submitProject">提交</el-button>
          </div>
          <!--编辑返回弹窗-->
          <el-dialog
            title="提示"
            :visible.sync="addPicture"
            size="tiny">
            <span>是否要添加项目图片？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addPicture = false">取 消</el-button>
            <el-button type="primary" @click="addPic" >确 定</el-button>
          </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '@/api'
import editor from '@/components/editor'
import {BASE_URL, UPLOAD_PICTURE_URL,SPONSORED_URL} from "../../store/mutation-types";
import {mapMutations} from "_vuex@2.5.0@vuex";
export default {
  name: 'creatProject',
  components: {
    editor
  },
  data() {
    return {
      fileList: [],
      pictureUploadUrl: SPONSORED_URL+'/Project/addPicCon?id=',
      submitUrl: SPONSORED_URL+'/Project',
      project:{
        projectName	: '',
        organization: '',
        describe: '',
        monthFee: '',
      },
      picture: '',
      projectId: '',
      creatPic: false,
      addPicture: false,
      creat: true,
    }
  },
  create(){

  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 发送反馈邮件
    submitProject() {
      if(this.project.projectName==='') {
        this.$message({
          message:'项目名称未填写/(ㄒoㄒ)/~~',
        })
      }else if(this.project.monthFee===''){
        this.$message({
          message: '项目月费未填写/(ㄒoㄒ)/~~',
          type: 'error',
        })
      }else if(this.project.describe===''){
        this.$message({
          message: '项目描述未填写/(ㄒoㄒ)/~~',
          type: 'error',
        })
      }else{

        this.project.organization="green"
        this.axios({
          method: 'post',
          params: {
            projectName	: this.project.projectName,
            organization: this.project.organization,
            describe: this.project.describe,
            monthFee: this.project.monthFee,
          },
          url: this.submitUrl
        }).then(response => {

              this.projectId=response.data
              console.log(this.projectId)
              this.$message({
                message: '提交成功。感谢你的支持，拜谢!',
                type: 'success',
              })
          this.addPicture=!this.addPicture
          this.creat=!this.creat
            }).catch(error => {
              this.$message({
                message: 'error/(ㄒoㄒ)/~~提交失败',
                type: 'error',
              })
              Promise.reject(error)
            })
      }
    },
    //添加图片
    addPic(){
      this.creatPic=!this.creatPic
      this.addPicture=!this.addPicture
      this.pictureUploadUrl=this.pictureUploadUrl+this.projectId
    },
    quillImgBefore(file) {
      let fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        return true;
      } else {
        this.$message.error('请插入图片类型文件(jpg/jpeg/png)');
        return false;
      }
    },
    // 图片上传失败
    uploadError() {
      // loading动画消失
      this.$message.error("图片插入失败");
    },
  }
}

</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-feedback
  margin-top 20px
  .main-wrapper
    fj(center)
    .main
      width 70%
      height 800px
      padding-top 30px
      #newSubject
        background-color #eaf5df
        margin-bottom 20px
      #button
        padding-bottom 10px
        margin-top 20px

</style>
