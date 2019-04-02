<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon name="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script lang="ts">
import Vue from 'vue'
import { AppModule } from '@/store/modules/app'
export default Vue.extend({
  computed: {
    language (): string {
      return AppModule.language
    }
  },
  methods: {
    handleSetLanguage (lang: any) {
      this.$i18n.locale = lang
      AppModule.SetLanguage(lang)
    }
  }
})
</script>
