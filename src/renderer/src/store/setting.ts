import { copyObj } from '@renderer/utils/object-util'
import { defaultCustomThemeMap, defaultFontSizeLevel } from '@renderer/utils/theme-util'
import { isZH } from '@renderer/utils/window-util'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    app: {
      // 主题模式：0自动 1明亮 2黑暗 3自定义
      themeModel: 0,
      // 自定义主题样式表
      customThemeMap: copyObj(defaultCustomThemeMap),
      // 字体大小 1-5
      fontSize: defaultFontSizeLevel,
      // 本地化
      locale: isZH() ? 'zh_CN' : 'en_US',
      // 网络代理
      proxy: ''
    },
    FlickX: {
      baseUrl: 'https://api.moonshot.cn/v1',
      key: 'sk-qJXDeHh2n1UFNeCFdam7dhWvYq75SXTXfM4roHIR4XeNzG1H'
    },
  }),
  getters: {
    getStoreJson(): string {
      return JSON.stringify({
        app: this.app,
        FlickX: this.FlickX
      })
    }
  },
  actions: {
    setStoreFromJson(json: string) {
      let importFlag = false
      if (!json) {
        return importFlag
      }
      const settingBackup = JSON.parse(json)
      if (settingBackup.app !== undefined) {
        this.app = settingBackup.app
        importFlag = true
      }
      if (settingBackup.FlickX !== undefined) {
        this.FlickX = settingBackup.FlickX
        importFlag = true
      }
      return importFlag
    },
    checkBigModelConfig(provider: BigModelProvider) {
      let configErrorFlag = false
      switch (provider) {
        case 'FlickX':
          if (!this.FlickX.baseUrl || !this.FlickX.key) {
            configErrorFlag = true
          }
          break
      }
      return configErrorFlag
    },
    getBigModelConfig(provider: BigModelProvider) {
      let otherOption = {}
      switch (provider) {
        case 'FlickX':
          otherOption = {
            apiKey: this.FlickX.key,
            baseURL: this.FlickX.baseUrl
          }
          break
      }
      return otherOption
    }
  },
  persist: true
})
