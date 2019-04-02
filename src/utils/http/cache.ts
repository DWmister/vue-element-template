import db from './db'
export function getCacheData (config: any) {
  db.cacheDate.where({ 'url': config.url })
}
export function CacheIndex (config: any, url: string) {
  return new Promise((resolve, reject) => {
    db.cacheDate
      .get({ url: url })
      .then((item: any) => {
        if (item.data) {
          item.data.IS_CATCHE = true // 增加接口标识
        }
        resolve({ config: config, data: item.data })
      })
      .catch((err: any) => {
        console.log(err)
      })
  })
}
