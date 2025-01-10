<script setup lang="ts">
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import WelcomePage from '@renderer/components/views/welcome-page/WelcomePage.vue'
import MainPage from '@renderer/components/views/main-page/MainPage.vue'
import { useSettingStore } from '@renderer/store/setting'
import { useSystemStore } from '@renderer/store/system'
import {
  getPlatform,
  startDockAnimation,
  startDockBounce,
  stopDockAnimation
} from '@renderer/utils/ipc-util'
import {
  startDarkThemeListener,
  changeTheme,
  setDefaultTheme,
  setCustomTheme
} from '@renderer/utils/theme-util'
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const systemStore = useSystemStore()
const settingStore = useSettingStore()
const { locale } = useI18n()

const arcoDesignLocales = {
  zh_CN: zhCN,
  en_US: enUS
}

const data = reactive({
  sidebarConfig: [
    {
      name: 'chat',
      icon: 'IconMessage'
    },
    {
      name: 'chat-assistant',
      icon: 'IconRobot'
    },
    {
      name: 'ai-app',
      icon: 'IconApps'
    }
  ] as { name: PageName; icon: string }[],
  alivePages: ['chat'] as PageName[]
})
const { sidebarConfig, alivePages } = toRefs(data)

// 主题设置监听
let stopDarkThemeListener: any = null
watch(
  () => settingStore.app.themeModel,
  () => {
    updateTheme()
  }
)
const updateTheme = () => {
  if (stopDarkThemeListener) {
    stopDarkThemeListener()
  }

  // 自定义样式
  if (settingStore.app.themeModel === 3) {
    setCustomTheme(settingStore.app.customThemeMap)
  } else {
    setDefaultTheme()
  }

  // 跟随系统
  if (settingStore.app.themeModel === 0) {
    stopDarkThemeListener = startDarkThemeListener()
  } else {
    // 切换样式
    changeTheme(settingStore.app.themeModel === 2)
  }
}

// 语言设置监听
watch(
  () => settingStore.app.locale,
  (lang) => {
    locale.value = lang
  }
)

// ArcoDesign 语言
const arcoDesignLocal = computed(() => {
  return arcoDesignLocales[settingStore.app.locale]
})

// 页面切换
const changePage = (page: PageName) => {
  if (systemStore.chatWindowLoading) {
    return
  }
  if (!data.alivePages.includes(page)) {
    data.alivePages.push(page)
  }
  systemStore.currentPage = page
}

// 监听各类加载状态
const watchLoading = () => {
  // 监听聊天框加载中状态
  watch(
    () => systemStore.isLoading,
    (value) => {
      if (value) {
        startDockAnimation()
      } else {
        stopDockAnimation()
        startDockBounce()
      }
    }
  )
}

onMounted(() => {
  // 更新主题
  updateTheme()
  // 设置语言
  locale.value = "zh_CN"
  // locale.value = settingStore.app.locale
  // 刷新 dayKey，用于更具日期自动刷新组件
  systemStore.startDayKeyInterval()
  // 延迟监听加载状态
  setTimeout(() => {
    watchLoading()
  }, 3000)
})
</script>

<template>
  <a-config-provider :locale="arcoDesignLocal">
    <router-view />
  </a-config-provider>
</template>