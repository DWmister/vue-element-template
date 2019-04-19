<template>
  <div class="app-container">
    <file-upload
      :fileType="upload.fileType"
      :isLoading="upload.isLoading"
      :fileSize="upload.fileSize"
      :acceptType="upload.acceptType"
      :message="upload.message"
      :isDrap="upload.isDrap"
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
    isDrap: boolean,
    hasUpList: any[],
  }
}
@Component({
  components: {
    FileUpload
  }
})
export default class Excel extends Vue implements uploadType {
  upload = {
    fileType: 'xlsx/xls/csv',
    isLoading: false,
    fileSize: 50,
    acceptType: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv',
    message: '只能上传xls/xlsx/csv文件，且不超过50KB',
    isDrap: true,
    hasUpList: []
  }
  // 文件上传
  filelist () {
    console.warn(arguments)
  }
}
</script>
