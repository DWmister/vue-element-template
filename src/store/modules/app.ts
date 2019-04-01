import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { setToken, getToken } from '@/utils/auth'
import store from '@/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: false,
    withoutAnimation: false,
  }
  public device = DeviceType.Desktop
  public language = getToken('language') || 'en'

  @Action({ commit: 'TOGGLE_SIDEBAR' })
  public ToggleSideBar(withoutAnimation: boolean) {
    return withoutAnimation
  }

  @Action({ commit: 'CLOSE_SIDEBAR' })
  public CloseSideBar(withoutAnimation: boolean) {
    return withoutAnimation
  }

  @Action({ commit: 'TOGGLE_DEVICE' })
  public ToggleDevice(device: DeviceType) {
    return device
  }

  @Action({ commit: 'SET_LANGUAGE' })
  public SetLanguage(language: string) {
    return language
  }

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    setToken('language', language)
    this.language = language
  }
}

export const AppModule = getModule(App)
