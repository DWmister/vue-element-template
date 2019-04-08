<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
    <!-- <div class="tags-view-wrapper"> -->
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.name"
        :class="['tags-view-item', isActive(tag) ? 'active' : '']"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ $t(`route.${tag.title}`) }}
        <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <!-- </div> -->
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">{{ $t('tagsView.refresh') }}</li>
      <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag)">
        {{ $t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">{{ $t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import ScrollPane from './ScrollPane.vue'
import { TagsModule } from '@/store/modules/tagsView'
import { Route } from 'vue-router'
import path from 'path'

@Component({
  components: {
    ScrollPane
  }
})
export default class TagsView extends Vue {
  private visible: boolean = false
  private left: number | string = 0
  private top: number | string = 0
  private affixTags: any[] = []
  private selectedTag: Route = {
    path: '',
    name: '',
    hash: '',
    query: {},
    params: {},
    fullPath: '',
    matched: [],
    meta: {}
  }

  get visitedViews () {
    return TagsModule.visitedViews
  }
  get routes () {
    return (this.$router as any).options.routes
  }

  @Watch('$route')
  onRouteChange () {
    this.addTags()
  }
  @Watch('visible')
  visibleChange (newVal: boolean, oldVal: boolean) {
    if (newVal) document.body.addEventListener('click', () => { this.visible = false })
    else document.body.removeEventListener('click', () => { this.visible = false })
  }

  mounted () {
    this.addTags()
    this.initTags()
  }

  // 添加路由到tag，路由一发生变化就会触发
  addTags () {
    const { name } = this.$route
    if (name) TagsModule.addView(this.$route)
    return false
  }
  // 初始化tag，默认显示设置了'affix'的路由
  initTags () {
    const affixTags = this.affixTags = this.filterAffixTags(this.routes)
    for (const tag of affixTags) {
      if (tag.name) TagsModule.addVisitedView(tag)
    }
  }
  filterAffixTags (routes: any, basePath: string = '/') {
    let tags: any[] = []
    routes.forEach((route: any) => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const tempTags = this.filterAffixTags(route.children, route.path)
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags]
        }
      }
    })
    return tags
  }
  // 给选中的tag，添加类
  isActive (route: Route) {
    return route.path === this.$route.path
  }
  // 关闭tag
  // 如果关闭的是当前显示的tag，则跳到显示最后一个
  // 否则，tag不跳转
  closeSelectedTag (view: Route) {
    TagsModule.delView(view).then(visitedViews => {
      if (this.isActive(view)) {
        this.toLastView(visitedViews)
      }
    })
  }
  // 关闭某个tag后，跳到显示的最后一个tag
  toLastView (visitedViews: any) {
    const latestView = this.visitedViews.slice(-1)[0]
    if (latestView) {
      this.$router.push(latestView)
    } else {
      this.$router.push('/')
    }
  }
  // 右键事件：显示更多操作
  openMenu (tag: Route, e: MouseEvent) {
    const menuMinWidth = 105
    const $els: any = this.$el
    const offsetLeft = $els.getBoundingClientRect().left // container margin left
    const offsetWidth = $els.offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right

    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }

    this.top = e.clientY
    this.visible = true
    this.selectedTag = tag
  }
  // 刷新当前路由
  refreshSelectedTag (view: Route) {
    const { fullPath } = view
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  }
  // 关闭所有tag 除设置了'affix'的路由
  closeAllTags (view: Route) {
    TagsModule.delAllViews().then(visitedViews => {
      // if (this.affixTags.some(tag => tag.path === view.path)) return
      this.toLastView(visitedViews)
    })
  }
  // 关闭所有其他tag，除本身和设置了'affix'的路由
  closeOthersTags () {
    this.$router.push(this.selectedTag)
    TagsModule.delOthersViews(this.selectedTag)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
