<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon name="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size===item.value"
        :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
@Component
export default class Size extends Vue {
  get sizeOptions () {
    return [
      { label: 'Default', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' }
    ]
  }
  get size () {
    return AppModule.size
  }
  private handleSetSize (size: string) {
    this.$ELEMENT.size = size
    AppModule.SetSize(size)
    this.refreshView()
  }
  refreshView () {
    const { fullPath } = this.$route
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  }
}
</script>
