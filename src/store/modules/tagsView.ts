import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { setToken, getToken } from '@/utils/auth'
import store from '@/store'
import { Route } from 'vue-router'

@Module({ dynamic: true, store, name: 'tagsView' })
class TagsView extends VuexModule {
  public visitedViews: any[] = []
  public cachedViews: any[] = []

  @Mutation
  ADD_VISITED_VIEW (view: Route) {
    if (this.visitedViews.some(v => v.path === view.path)) return
    this.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  }
  @Mutation
  ADD_CACHED_VIEW (view: Route) {
    if (this.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) this.cachedViews.push(view.name)
  }
  @Mutation
  DEL_VISITED_VIEW (view: Route) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1)
        break
      }
    }
  }
  @Mutation
  DEL_CACHED_VIEW (view: Route) {
    for (const i of this.cachedViews) {
      if (i === view.name) {
        const index = this.cachedViews.indexOf(i)
        this.cachedViews.splice(index, 1)
        break
      }
    }
  }
  @Mutation
  DEL_ALL_VISITED_VIEWS () {
    // keep affix tags
    const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
    this.visitedViews = affixTags
  }
  @Mutation
  DEL_ALL_CACHED_VIEWS () {
    this.cachedViews = []
  }
  @Mutation
  DEL_OTHERS_VISITED_VIEWS (view: Route) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  }
  @Mutation
  DEL_OTHERS_CACHED_VIEWS (view: Route) {
    for (const i of this.cachedViews) {
      if (i === view.name) {
        const index = this.cachedViews.indexOf(i)
        this.cachedViews = this.cachedViews.slice(index, index + 1)
        break
      }
    }
  }

  @Action
  public addView (view: Route) {
    this.addVisitedView(view)
    this.addCachedView(view)
  }
  @Action({ commit: 'ADD_VISITED_VIEW' })
  public addVisitedView (view: Route) {
    return view
  }
  @Action({ commit: 'ADD_CACHED_VIEW' })
  public addCachedView (view: Route) {
    return view
  }
  @Action
  delView (view: Route) {
    return new Promise(resolve => {
      this.delVisitedView(view)
      this.delCachedView(view)
      resolve({
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      })
    })
  }
  @Action({ commit: 'DEL_VISITED_VIEW' })
  delVisitedView (view: Route) {
    return view
  }
  @Action({ commit: 'DEL_CACHED_VIEW' })
  delCachedView (view: Route) {
    return view
  }
  @Action
  delAllViews () {
    return new Promise(resolve => {
      this.delAllVisitedViews()
      this.delAllCachedViews()
      resolve({
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      })
    })
  }
  @Action({ commit: 'DEL_ALL_VISITED_VIEWS' })
  delAllVisitedViews () {}
  @Action({ commit: 'DEL_ALL_CACHED_VIEWS' })
  delAllCachedViews () {}
  @Action
  delOthersViews (view: Route) {
    this.delOthersVisitedViews(view)
    this.delOthersCachedViews(view)
  }
  @Action({ commit: 'DEL_OTHERS_VISITED_VIEWS' })
  delOthersVisitedViews (view: Route) {
    return view
  }
  @Action({ commit: 'DEL_OTHERS_CACHED_VIEWS' })
  delOthersCachedViews (view: Route) {
    return view
  }
}
export const TagsModule = getModule(TagsView)
