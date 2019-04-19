<template>
  <div class="main" :fileType="fileType">
    <el-upload
      v-loading="isLoading"
      class="upload-demo"
      enctype="multipart/form-data"
      :action='src'
      :headers="headers"
      :limit="limitNumber"
      :name="propName"
      :multiple="isMultiple"
      :accept="acceptType"
      :list-type="listType"
      :drag="isDrap"
      :file-list="hasUpList"
      :disabled='isDisabled'
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :on-exceed="handleExceed"
      :before-remove="beforeRemove"
      :on-preview="handlePictureCardPreview">
      <!-- 拖拽上传 -->
      <div v-if="isDrap" :disabled="isDisabled">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <!-- 照片墙格式上传 -->
      <div v-if="listType === 'picture-card'">
        <i class="el-icon-plus" :disabled="isDisabled"></i>
      </div>
      <!-- 点击上传按钮 -->
      <el-button size="small" type="primary" :disabled="isDisabled" v-if="isBtn">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{message}}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import { isEmptyObj } from '@/utils/auth'

@Component
export default class FileUpload extends Vue {
  /**
   * @global
   * isDisabled: 是否禁用上传 以及禁止删除，boolean， 默认为：false
   */
  private isDisabled: boolean = false
  dialogVisible: boolean = false
  dialogImageUrl: string = ''

  /**
   * @Props
   * fileType: 提示文件类型，用于做上传二次验证，string，默认为：'jpg/jpeg/png'
   * isLoading: v-loading，boolean，默认为：true
   * src: 文件上传地址，string，默认为：'http://localhost:7072/user/upload'
   * fileSize: 上传大小限制 单位K，number，默认为：500
   * headers: 请求头信息，object，默认为：{}
   * limitNumber: 上传数量限制，number，默认为：30
   * propName: 上传的文件字段名，string，默认为：'file'
   * isMultiple: 是否可多选，boolean，默认为：false
   * acceptType: 可接受的上传文件类型 上传验证，string，默认为：'image/png,image/jpeg'
   * listType: 文件列表类型，string，默认为：'text'
   * isDrap: 是否可拖拽上传，boolean，默认为：false
   * hasUpList: 已上传的列表，array，默认为：[]
   * message: 上传提示信息，string，默认为：''
   * exceedTip: 上传数量超过限制时的提示语，string， 默认为：'最多只能上传30份文件'
   * showNum: 已上传列表显示的个数，number， 默认为：1
   * isBtn: 是否只显示一个点击上传按钮，boolean， 默认为：false
   */
  @Prop({ default: 'jpg/jpeg/png' }) private fileType!: string
  @Prop({ default: true }) private isLoading!: boolean
  @Prop({ default: 'http://localhost:7072/user/upload' }) private src!: string
  @Prop({ default: 500 }) private fileSize!: number
  @Prop({ default: () => {} }) private headers!: {}
  @Prop({ default: 30 }) private limitNumber!: number
  @Prop({ default: 'file' }) private propName!: string
  @Prop({ default: false }) private isMultiple!: boolean
  @Prop({ default: 'image/png,image/jpeg' }) private acceptType!: string
  @Prop({ default: 'text' }) private listType!: string
  @Prop({ default: false }) private isDrap!: boolean
  @Prop({ default: () => [] }) private hasUpList!: []
  @Prop({ default: '' }) private message!: ''
  @Prop({ default: '最多只能上传30份文件' }) private exceedTip!: ''
  @Prop({ default: 1 }) private showNum!: number
  @Prop({ default: false }) private isBtn!: boolean

  /**
   * @Events
   * beforeAvatarUpload 文件上传之前的钩子
   * handleAvatarSuccess 文件上传成功的钩子
   * handleExceed  上传文件超过限制的钩子
   * beforeRemove  删除文件之前的钩子
   */
  beforeAvatarUpload (file: File, fileList: []) {
    const uploadType = file.name.substring(file.name.lastIndexOf('.') + 1)
    const uploadSize = file.size
    if (this.fileType.includes(uploadType)) {
      if (uploadSize / 1024 < this.fileSize) {
        this.isDisabled = true
        this.$message.warning('上传中，请勿操作，请等待上传结束！')
      } else {
        this.$message.warning('文件过大，请重新上传！')
        // 不加return false的话，表单还会提交(还会上传)
        return false
      }
    } else {
      this.$message.warning('上传文件类型不正确!')
      // 不加return false的话，表单还会提交(还会上传)
      return false
    }
  }
  @Emit('file-list')
  handleAvatarSuccess (res: any, file: File, fileList: []) {
    // 已上传的文件列表只显示n个，若多个则显示最新前n个
    if (fileList.length > this.showNum) {
      fileList.splice(0, fileList.length - this.showNum)
    }
    this.isDisabled = true
    if (res.code === '0x00') {
      if (!isEmptyObj(res.data)) {
        this.isDisabled = false
        this.$message.success('文件上传成功！')
      }
    }
  }
  handleExceed () {
    this.$message.warning(this.exceedTip)
  }
  /**
   * 如果上传文件类型或者文件尺寸不符合要求，会默认走有关的删除钩子
   * 要想在这些钩子中有操作，要把以下条件再加上
   */
  beforeRemove (file: File, fileList: []) {
    const uploadType = file.name.substring(file.name.lastIndexOf('.') + 1)
    const uploadSize = file.size
    if (
      (this.hasUpList.length &&
      fileList.length &&
      uploadSize / 1024 < this.fileSize * 1 &&
      this.fileType.includes(uploadType)) ||
      (fileList.length &&
      uploadSize / 1024 < this.fileSize * 1 &&
      this.fileType.includes(uploadType))
    ) {
      return this.$confirm(`确定删除 ${file.name}？`, {
        closeOnClickModal: false
      })
    }
  }
  handlePictureCardPreview (file: any) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }
}
</script>
