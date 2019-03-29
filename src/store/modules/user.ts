import { VuexModule, Module, MutationAction, Mutation, Action, getModule } from 'vuex-module-decorators'
import { login } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = ''
  public name = ''
  public avatar = ''
  public roles = []

  @Action({ commit: 'SET_TOKEN' })
  public async Login (userInfo: { email: string, password: string}) {
    const data: any = await login(userInfo.email, userInfo.password)
    if (data.code === '0x00') {
      let user_info = {
        roles: data.data.roleCode,
        name: data.data.username,
        avatar: data.data.avatar
      }
      setToken('access_token', data.data.token)
      setToken('user_info', user_info)
    }
    return data
  }

  @Action({ commit: 'SET_TOKEN' })
  public async FedLogOut () {
    removeToken('access_token')
    removeToken('user_info')
    return ''
  }

  @MutationAction({ mutate: [ 'roles', 'name', 'avatar' ] })
  public async GetInfo () {
    const token = getToken('access_token')
    const data: any = getToken('user_info')
    if (token === undefined) {
      throw Error('GetInfo: token is undefined!')
    }
    if (data.roles && data.roles.length > 0) {
      return {
        roles: data.roles,
        name: data.name,
        avatar: data.avatar
      }
    } else {
      throw Error('GetInfo: roles must be a non-null array!')
    }
  }

  @MutationAction({ mutate: [ 'token', 'roles' ] })
  public async LogOut () {
    if (getToken('access_token') === undefined) {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken('access_token')
    removeToken('user_info')
    return {
      token: '',
      roles: []
    }
  }

  @Mutation
  private SET_TOKEN (token: string) {
    this.token = token
  }
}

export const UserModule = getModule(User)
