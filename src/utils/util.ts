import CryptoJS from 'crypto-js'
import md5 from 'crypto-js/md5'
import config from '@/../config/default'

// 字符串的加密解密 若加密对象则先转为字符串
export const AESEncrypt = (str: string) => {
  const ciphertext = CryptoJS.AES.encrypt(str, config.AES.secret).toString()
  return ciphertext
}
export const AESDecrypt = (str: string) => {
  const bytes = CryptoJS.AES.decrypt(str, config.AES.secret)
  const plaintext = bytes.toString(CryptoJS.enc.Utf8)
  return plaintext
}

export const md5Encrypt = (str: string) => {
  return md5(str).toString()
}
