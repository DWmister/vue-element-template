// sessionStorage 的存取操作
// const _sessionStorage: Storage = sessionStorage
const _sessionStorage: any = sessionStorage
const _JSON: JSON = JSON

export const getToken = (key: string) => _JSON.parse(_sessionStorage.getItem(key))

export const setToken = (key: string, token: any) => _sessionStorage.setItem(key, _JSON.stringify(token))

export const removeToken = (key: string) => _sessionStorage.removeItem(key)

// 判断对象是否为空
export function isEmptyObj (object: Object) {
  for (const key in object) {
    return false
  }
  return true
}
