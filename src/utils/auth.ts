const _sessionStorage: Storage = sessionStorage
// const _JSON: JSON = JSON

export const getToken = (key: string) => _sessionStorage.getItem(key)

export const setToken = (key: string, token: string) => _sessionStorage.setItem(key, token)

export const removeToken = (key: string) => _sessionStorage.removeItem(key)

