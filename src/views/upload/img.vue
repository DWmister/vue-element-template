<template>
  <div class="app-container">
    <file-upload
      :isLoading="upload.isLoading"
      :fileSize="upload.fileSize"
      :hasUpList="upload.hasUpList"
      :message="upload.message"
      :listType="upload.listType"
      @file-list='filelist'>
    </file-upload>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FileUpload from '@/components/FileUpload/index.vue'
export interface uploadType {
  upload: {
    isLoading: boolean,
    fileSize: number,
    listType: string,
    hasUpList: any[],
    message: string
  }
}
@Component({
  components: {
    FileUpload
  }
})
export default class Img extends Vue implements uploadType {
  upload = {
    isLoading: false,
    fileSize: 100,
    listType: 'picture-card',
    hasUpList: [{
      name: 'affgdfghhwerter.jpg',
      url: 'http://localhost:8080/82285dea-ed5f-4f1f-9804-a47cdad0a94d',
      size: 10000
    }],
    message: '只能上传JPG/PNG文件，且不超过100KB'
  }
  // 文件上传
  filelist () {
    console.warn(arguments)
  }
}
</script>
