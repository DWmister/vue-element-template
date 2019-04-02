import request from '@/utils/request'

export const login = (email: string, password: string) =>
  request({
    url: 'user_login',
    method: 'post',
    data: {
      email,
      password
    }
  })

export const getInfo = (token: string) =>
  request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })

export const logout = () =>
  request({
    url: 'user_logout',
    method: 'post'
  })
