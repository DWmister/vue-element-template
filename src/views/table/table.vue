<template>
  <div class="app-container">
    <el-button @click="getData">获取数据</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import $http from '@/utils/request'

@Component
export default class Table extends Vue {
  private tableData = []
  created () {
    this.getData()
  }
  private getData () {
    $http
      .get('student_getInfo', {
        params: { name: '章三' }
        // 下面注释为接口缓存和过滤的用法
        // disableTime: 3,
        // cacheTime: 30,
        // isFilterUrl: true
      })
      .then((res: any) => {
        if (res.code === '0x00') {
          this.tableData = res.data
        } else {
          this.tableData = []
        }
      })
      .catch((err: any) => { console.log(err) })
  }
}
</script>
