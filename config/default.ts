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
  },
  AES: {
    secret: '0KajD7AZcF2QnPr5fwiHRNygmupUTIXx69BWb-hMCGJo_V8Eskz1YdvL34letqSO'
  }
}
export default config
