import db from './db'
// async function update (config: any) {
//   return await db.cacheDate.update({
//     url: config.url
//   })
// }
function update (config: any) {
  return db.cacheDate.update({
    url: config.url
  })
}
function where (url: string) {
  return db.cacheDate.where(
    {
      url: url
    }
  ).first()
}
// async function findOne (obj: any) {
//   return await db.cacheDate.where(
//     obj
//   ).first()
// }
function findOne (obj: any) {
  return db.cacheDate.where(
    obj
  ).first()
}
export default { update, where, findOne }
