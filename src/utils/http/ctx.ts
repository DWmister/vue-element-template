import { AxiosRequestConfig, AxiosResponse } from 'axios';

import db from '@/utils/http/db'
import { CacheIndex } from './cache'
import server from './server'
import { Message } from 'element-ui'
import store from '@/store'
import API from '@/api/api'

/**
 * todo 疑惑
 * 在req函数中打印config，里面的url是真实的，但是通过config.url拿不到真实的url，只能取到path，
 * 在res函数中，通过response.config.url能读取真实的url
 * 为了前后对应，只能在req中通过baseURL+url拼出真实的url，且放到全局使用
 */
let full_url: string = ''
let cache_api_props: any
let states: any = store.state
let api: any = API
// export async function req (config: AxiosRequestConfig) {
export async function req (config: any) {
  // 接口验证，判断是否声明
  if (!api[config.method + '@' + config.url]) {
    throw new Error(`请把${config.method}@${config.url}放入api`)
  } else {
    config.url = api[config.method + '@' + config.url]
  }
  full_url = `${config.method}@${config.baseURL}/${config.url}`
  const hasUrl = await server.where(full_url)
  // 存session 数据不会实时更新 只能存store
  cache_api_props = states[full_url]
  if (cache_api_props === undefined) {
    cache_api_props = states[full_url] = {
      cacheParams: {},
      disableTime: config.disableTime,
      startTimes: null,
      disabled: false,
      cacheTime: config.cacheTime,
      filterUrl: config.filterUrl
    }
  }
  // 仅缓存get请求的参数
  if (config.method === 'get') {
    cache_api_props.cacheParams = config.params ? config.params : {}
  }
  /**
   * 接口操作频繁限制
   * 情况一：请求还未相应就发二次请求
   * disabled: false 已响应
   */
  if (!cache_api_props.disabled || config.isFilterUrl) {
    cache_api_props.disabled = true
  } else {
    Message.warning('操作太过频繁，请稍后重试！')
    throw new Error(`${config.url}接口，操作太过频繁，请稍后重试！`)
  }
  /**
   * 接口操作频繁限制
   * 情况二：设置了接口缓存时间和接口禁止请求时间 
   * 且 二次请求时间 - 上次请求时间 < 禁止请求时间
   * 
   * 时间单位为毫秒
   * new Date().getTime()：二次请求时间
   * startTimes：上次请求时间
   * disableTime：禁止请求时间
   */
  if (cache_api_props && cache_api_props.startTimes && config.disableTime) {
    const interval: number = new Date().getTime() - cache_api_props.startTimes
    if (interval < config.disableTime * 1000) {
      cache_api_props.disabled = false
      Message.warning('操作太过频繁请稍后重试！')
      throw new Error(`${config.url}接口,操作太过频繁请稍后重试！`)
    }
  }

  /**
   * 判断缓存是否过期
   * 缓存过期条件： 本次请求时间 - 上次接口相应时间 > 缓存时间
   * 
   * 时间单位为毫秒
   * new Date().getTime()：本次请求时间
   * hasUrl.setTime：上次请求时间
   * cacheTime：缓存时间
   */
  if (config.cacheTime && hasUrl) {
    if (!hasUrl.data || new Date().getTime() - hasUrl.setTime >= config.cacheTime * 1000) {
      config.indexDb_cache = false // 缓存过期
    } else {
      config.indexDb_cache = true
    }
    // 记录http发送 记录本次的请求时间
    cache_api_props.startTimes = new Date().getTime()
    // 拉取缓存适配器 读取缓存数据
    if (config.indexDb_cache) {
      config.adapter = function(config: any) {
        return CacheIndex(config, full_url)
      }
    } else {
      config.adapter = undefined
    }
  }
  // 发出请求前记录缓存接口数据
  if (!hasUrl) {
    db.cacheDate
      .add({
        url: full_url,
        method: config.method,
        remote: config.remote,
        disableTime: config.disableTime,
        params: config.params,
        cacheTime: config.cacheTime,
        setTime: new Date().getTime()
      })
  }
  // 参数过滤，排除设置 isFilterUrl: true 的接口
  if ((config.params || config.data) && !config.filterUrl) {
    const data = config.params ? config.params : config.data
    if (process.env.NODE_ENV === 'development') {
      console.log('***********************************')
      console.info('接口地址：', config.url)
      console.info('发出参数：', data)
      console.log('***********************************')
      console.info('缓存参数：', config.url, cache_api_props.cacheParams)
    }
  }
  return config
}

// export async function res (response: AxiosResponse<any>) {
export async function res (response: any) {
  const hasUrl = await server.where(full_url)
  cache_api_props = states[full_url]
  // 翻状态(已响应) 设置disabled: false
  if (cache_api_props && cache_api_props.disabled) {
    cache_api_props.disabled = false
  }
  // 接口异常收集
  if (response.data && response.data.code !== '0x00') {
    // 异常提醒 页面中就不用每次调用接口的时候再做判断，弹出异常提示
    if (response.data.msg) {
      Message.warning(response.data.msg)
    }
    db.errorDate
      .put({ 
        windowHref: location.href,
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        res: response.data,
        date: new Date().getTime()
      })
  }
  // 接口返回正常处理
  if (response.data.code === '0x00') {
    // 更新数据存储
    if (cache_api_props && cache_api_props.cacheTime && !response.config.indexDb_cache && hasUrl) {
      db.cacheDate
        .update(
          hasUrl.id,
          {
            data: response.data,
            setTime: new Date().getTime()
          }).then(console.log).catch(console.log)
    }
    if (response.config.method !== 'options') {
      if (process.env.NODE_ENV === 'development') {
        console.log('接收参数：', response.config.url, response.data)
      }
    }
    if (response.config.method === 'post') {
      Message.success('操作成功')
    }
    return response.data
  }
  return response.data
}