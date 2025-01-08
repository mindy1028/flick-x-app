import CryptoJS from 'crypto-js'

export interface CrypotoType {
    encrypt: any
    decrypt: any
}

export default class Crypoto implements CrypotoType {
    key = CryptoJS.enc.Utf8.parse('7e677bfa07e11a8f') // 十六位十六进制数作为密钥
    iv = CryptoJS.enc.Utf8.parse('30ff0efcb957087f') // 十六位十六进制数作为密钥偏移量

    /* 加密 */
    encrypt(word: any) {
        const srcs = CryptoJS.enc.Utf8.parse(word)
        const encrypted = CryptoJS.AES.encrypt(srcs, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        return encrypted.ciphertext.toString().toUpperCase()
    }

    /* 解密 */
    decrypt(word: any) {
        const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
        const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
        const decrypt = CryptoJS.AES.decrypt(srcs, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
        return decryptedStr.toString()
    }
}