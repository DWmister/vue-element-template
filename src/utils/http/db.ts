import Dexie from 'dexie'
import config from '@/../config/default'

const db: any = new Dexie(config.INDEXDB.DB)
config.INDEXDB.TABLE.forEach((element, index) => {
  if (element) {
    db.version(index + 1).stores(element)
  }
})
export default db
