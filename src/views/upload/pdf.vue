<template>
  <div class="app-container">
    <file-upload
      :fileType="upload.fileType"
      :isLoading="upload.isLoading"
      :fileSize="upload.fileSize"
      :acceptType="upload.acceptType"
      :message="upload.message"
      :isBtn="upload.isBtn"
      :hasUpList="upload.hasUpList"
      @file-list='filelist'>
    </file-upload>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FileUpload from '@/components/FileUpload/index.vue'
export interface uploadType {
  upload: {
    fileType: string,
    isLoading: boolean,
    fileSize: number,
    acceptType: string,
    message: string,
    isBtn: boolean,
    hasUpList: any[],
  }
}
@Component({
  components: {
    FileUpload
  }
})
export default class Pdf extends Vue implements uploadType {
  upload = {
    fileType: 'pdf',
    isLoading: false,
    fileSize: 10 * 1024,
    acceptType: 'application/pdf',
    message: '只能上传pdf文件，且不超过10M',
    isBtn: true,
    hasUpList: []
  }
  // 文件上传
  filelist () {
    console.warn(arguments)
  }
}
</script>
