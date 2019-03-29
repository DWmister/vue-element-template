const config = {
  INDEXDB: {
    OPEN: true, // 是否开启indexdb
    DB: 'vue3-ts-admin', // 数据库名称
    TABLE: [
      {
        errorDate: '++id,url', // 表名 ：字段名称
        cacheDate: '++id,url,method,remote,disableTime,params,cacheTime,setTime,data'
      }
    ]
  }
}
export default config