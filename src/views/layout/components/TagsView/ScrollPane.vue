<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      tagAndTagSpacing: 4
    }
  },
  computed: {
    scrollWrapper (): HTMLElement {
      const $containers: Vue = this.$refs.scrollContainer as Vue
      return $containers.$refs.wrap as HTMLElement
    }
  },
  methods: {
    handleScroll (e: WheelEvent) {
      const eventDelta: number = -e.deltaY * 40
      // const eventDelta: number = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper: HTMLElement = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }
  }
})
</script>
