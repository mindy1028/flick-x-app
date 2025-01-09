<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue'
import chatModels from '@renderer/assets/json/chat-models.json'
import { useAssistantStore } from '@renderer/store/assistant'
import { useCalendarStore } from '@renderer/store/calendar'
import { useChatPluginStore } from '@renderer/store/chat-plugin'
import { useCollectionSetStore } from '@renderer/store/collection-set'
import { useDrawingStore } from '@renderer/store/drawing'
import { useKnowledgeBaseStore } from '@renderer/store/knowledge-base'
import { useSettingStore } from '@renderer/store/setting'
import { useSystemStore } from '@renderer/store/system'
import { useUserStore } from '@renderer/store/user'
import { formatDateTime } from '@renderer/utils/date-util'
import { exportTextFile } from '@renderer/utils/download-util'
import {
  openCacheDir,
  setProxy,
  getAppVersion,
  clearCacheFiles,
  selectFileAndRead,
  onMainWindowFocus,
  getCacheFiles,
  addCacheFiles,
  openDevTools,
  openLogDir
} from '@renderer/utils/ipc-util'
import { copyObj } from '@renderer/utils/object-util'
import {
  defaultCustomThemeMap,
  setCustomFontSize,
  setCustomTheme
} from '@renderer/utils/theme-util'
import { openInBrowser } from '@renderer/utils/window-util'
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const systemStore = useSystemStore()
const settingStore = useSettingStore()
const userStore = useUserStore()
const assistantStore = useAssistantStore()
const collectionSetStore = useCollectionSetStore()
const knowledgeBaseStore = useKnowledgeBaseStore()
const calendarStore = useCalendarStore()
const chatPluginStore = useChatPluginStore()
const drawingStore = useDrawingStore()
const { t } = useI18n()

const data = reactive({
  appVersion: '0.0.0',
  newVersionFlag: false,
  clearCacheFlag: false
})
const { appVersion, newVersionFlag, clearCacheFlag } = toRefs(data)

// 计算默认切换的tab
const settingDefaultActiveKey = computed(() => {
  return systemStore.settingModal.defaultActiveKey
    ? systemStore.settingModal.defaultActiveKey
    : data.newVersionFlag
      ? 'about'
      : 'app'
})

const checkNewVersion = () => {
  fetch('https://api.github.com/repos/mindy1028/flick-x-app/releases/latest')
    .then((res) => res.json())
    .then((json) => {
      if (json.name) {
        const appVersionArray = data.appVersion.split('.')
        const newVersionArray = json.name.split('.')
        for (let i = 0; i < newVersionArray.length; i++) {
          if (Number(newVersionArray[i]) > Number(appVersionArray[i])) {
            data.newVersionFlag = true
          } else if (Number(newVersionArray[i]) < Number(appVersionArray[i])) {
            data.newVersionFlag = false
            return
          }
        }
      }
    })
}

// 清理缓存
const clearCacheHandle = async () => {
  if (data.clearCacheFlag) {
    return
  }
  data.clearCacheFlag = true

  // 用户头像、所有对话记录图片和文件、AI绘画中的图片、收藏中的图片和文件
  const ignoreImages: string[] = []
  if (userStore.avatar) {
    ignoreImages.push(userStore.avatar)
  }
  assistantStore.assistantList.forEach((asst) =>
    asst.chatMessageList.forEach((msg) => {
      if (msg.image) {
        ignoreImages.push(msg.image)
      }
      console.log(msg.fileList)
      if (msg.fileList && msg.fileList.length > 0) {
        ignoreImages.push(...msg.fileList.map((f) => f.path))
      }
    })
  )
  assistantStore.virtualAssistantList.forEach((asst) =>
    asst.chatMessageList.forEach((msg) => {
      if (msg.image) {
        ignoreImages.push(msg.image)
      }
      console.log(msg.fileList)
      if (msg.fileList && msg.fileList.length > 0) {
        ignoreImages.push(...msg.fileList.map((f) => f.path))
      }
    })
  )
  drawingStore.drawingTaskList.forEach((task) => {
    task.imageList.forEach((img) => {
      if (img) {
        ignoreImages.push(img)
      }
    })
  })
  collectionSetStore.collectionItemList.forEach((item) => {
    if (item.type === 'chat' && item.chat?.chatMessageList) {
      item.chat?.chatMessageList.forEach((msg) => {
        if (msg.image) {
          ignoreImages.push(msg.image)
        }
        if (msg.fileList && msg.fileList.length > 0) {
          ignoreImages.push(...msg.fileList.map((f) => f.path))
        }
      })
    } else if (item.type === 'image' && item.image?.imageList) {
      item.image?.imageList.forEach((image) => {
        if (image) {
          ignoreImages.push(image)
        }
      })
    }
  })
  await clearCacheFiles(ignoreImages)
  data.clearCacheFlag = false
  Message.success(t('setting.app.backup.cache.clearSuccess'))
}

const exportSettingBackup = () => {
  systemStore.globalLoading = true
  exportTextFile(
    `setting-${formatDateTime(new Date(), 'YYYYMMDDHHmmss')}.sito`,
    settingStore.getStoreJson
  )
  systemStore.globalLoading = false
}

const exportDataBackup = async () => {
  systemStore.globalLoading = true
  exportTextFile(
    `data-${formatDateTime(new Date(), 'YYYYMMDDHHmmss')}.sito`,
    JSON.stringify({
      userStore: userStore.getStoreJson,
      assistantStore: assistantStore.getStoreJson,
      collectionSetStore: collectionSetStore.getStoreJson,
      knowledgeBaseStore: knowledgeBaseStore.getStoreJson,
      calendarStore: calendarStore.getStoreJson,
      chatPluginStore: chatPluginStore.getStoreJson,
      drawingStore: drawingStore.getStoreJson,
      cacheFiles: await getCacheFiles()
    })
  )
  systemStore.globalLoading = false
}

const importSettingBackup = () => {
  Modal.confirm({
    title: t('setting.app.backup.setting.importConfirm'),
    content: t('setting.app.backup.setting.importConfirmContent'),
    okText: t('setting.app.backup.importOk'),
    cancelText: t('common.cancel'),
    onOk: async () => {
      try {
        const selectFileResult = await selectFileAndRead(['sito'])
        if (selectFileResult) {
          systemStore.globalLoading = true
          const importFlag = settingStore.setStoreFromJson(
            new TextDecoder().decode(selectFileResult)
          )
          if (importFlag) {
            Message.success(t('setting.app.backup.importSuccess'))
          } else {
            Message.error(t('setting.app.backup.importNone'))
          }
        }
      } catch (e) {
        Message.error(t('setting.app.backup.importError'))
      } finally {
        systemStore.globalLoading = false
      }
    }
  })
}

const importDataBackup = () => {
  Modal.confirm({
    title: t('setting.app.backup.data.importConfirm'),
    content: t('setting.app.backup.data.importConfirmContent'),
    okText: t('setting.app.backup.importOk'),
    cancelText: t('common.cancel'),
    onOk: async () => {
      try {
        const selectFileResult = await selectFileAndRead(['sito'])
        if (selectFileResult) {
          let importFlag = false
          systemStore.globalLoading = true
          const dataBackup = JSON.parse(new TextDecoder().decode(selectFileResult))
          importFlag = userStore.setStoreFromJson(dataBackup.userStore) || importFlag
          importFlag = assistantStore.setStoreFromJson(dataBackup.assistantStore) || importFlag
          importFlag =
            collectionSetStore.setStoreFromJson(dataBackup.collectionSetStore) || importFlag
          importFlag =
            knowledgeBaseStore.setStoreFromJson(dataBackup.knowledgeBaseStore) || importFlag
          importFlag = calendarStore.setStoreFromJson(dataBackup.calendarStore) || importFlag
          importFlag = chatPluginStore.setStoreFromJson(dataBackup.chatPluginStore) || importFlag
          importFlag = drawingStore.setStoreFromJson(dataBackup.drawingStore) || importFlag
          importFlag = (await addCacheFiles(dataBackup.cacheFiles)) || importFlag
          if (importFlag) {
            Message.success(t('setting.app.backup.importSuccess'))
          } else {
            Message.error(t('setting.app.backup.importNone'))
          }
        }
      } catch (e) {
        Message.error(t('setting.app.backup.importError'))
      } finally {
        systemStore.globalLoading = false
      }
    }
  })
}

// 自定义样式实时生效
watch(
  () => settingStore.app.customThemeMap,
  () => {
    if (settingStore.app.themeModel === 3) {
      setCustomTheme(settingStore.app.customThemeMap)
    }
  },
  {
    deep: true
  }
)

// 字体大小修改实时生效
watch(
  () => settingStore.app.fontSize,
  (value) => {
    setCustomFontSize(value)
  }
)

onMounted(() => {
  getAppVersion().then((v) => {
    data.appVersion = v
    checkNewVersion()
  })
  // 每次获得焦点检查最新版本
  let lastCheckTime = 0
  onMainWindowFocus(() => {
    if (new Date().getTime() - lastCheckTime > 1000 * 60 * 60) {
      checkNewVersion()
      lastCheckTime = new Date().getTime()
    }
  })
  setProxy(settingStore.app.proxy)
})
</script>

<template>
  <div class="setting">
    <div @click="systemStore.openSettingModal()">
      <a-badge :count="newVersionFlag ? 1 : 0" dot :dot-style="{ width: '7px', height: '7px' }">
        <slot name="default"></slot>
      </a-badge>
    </div>

    <!-- 设置Modal -->
    <a-modal v-model:visible="systemStore.settingModal.visible" :footer="false" unmount-on-close title-align="start"
      width="80vw">
      <template #title> {{ $t('setting.name') }} </template>
      <!-- 设置页 -->
      <div class="setting-page">
        <a-tabs position="left" :default-active-key="settingDefaultActiveKey">
          <!-- 用户 -->
          <a-tab-pane key="user" :title="$t('setting.app.user.name')">
            <a-space direction="vertical" :size="25" fill class="setting-tab-content">
              <!-- 在这里添加用户页面的内容 -->
              <div>{{ $t('setting.app.user.userinfo.account') }}</div>
              <div>{{ $t('setting.app.user.userinfo.userid') }}</div>
              <div>{{ $t('setting.app.user.userinfo.area') }}</div>
              <div>{{ $t('setting.app.user.userinfo.agentList') }}</div>
              <!-- 其他用户相关的组件 -->
            </a-space>
          </a-tab-pane>

          <!-- 关于 -->
          <a-tab-pane key="about" :title="$t('setting.about.name')">
            <a-space direction="vertical" :size="25" fill class="setting-tab-content">
              <a-space direction="vertical" :size="10">
                <div>{{ $t('setting.about.version.name') }}</div>
                <div>
                  <a-space :size="10">
                    <div>{{ $t('setting.about.version.current') }} v{{ appVersion }}</div>
                    <a-badge :count="newVersionFlag ? 1 : 0" dot :dot-style="{ width: '7px', height: '7px' }">
                      <a-button size="small" @click="openInBrowser('http://www.sitoai.cn/flickx/')">
                        <a-space :size="5">
                          <icon-download />
                          <span>{{ $t('setting.about.version.download') }}</span>
                        </a-space>
                      </a-button>
                    </a-badge>
                  </a-space>
                </div>
              </a-space>
              <a-space direction="vertical" :size="10" fill>
                <div>{{ $t('setting.about.companyEmail') }}</div>
                <a-link href="mailto:fangjunjievip@hotmail.com" style="color: #ef4477;">
                  pan@sitoai.cn</a-link>
              </a-space>
              <a-space direction="vertical" :size="10" fill>
                <div>{{ $t('setting.about.contactAuthor') }}</div>
                <a-link><img src="@renderer/assets/images/login-sitoai.png" alt=""></a-link>
              </a-space>
              <!-- <a-space direction="vertical" :size="10">
                <div>{{ $t('setting.about.devTools.name') }}</div>
                <div>
                  <a-space :size="10">
                    <a-button size="small" @click="systemStore.isWelcomeShow = true">
                      <span>{{ $t('setting.about.devTools.welcomePage') }}</span>
                    </a-button>
                  </a-space>
                </div>
              </a-space> -->
            </a-space>
          </a-tab-pane>

          <!-- 外观 -->
          <a-tab-pane key="appearance" :title="$t('setting.app.appearance.name')">
            <a-space direction="vertical" :size="25" fill class="setting-tab-content">
              <a-space direction="vertical" :size="10">
                <div>{{ $t('setting.app.appearance.theme.name') }}</div>
                <a-radio-group v-model="settingStore.app.themeModel" type="button" size="small">
                  <a-radio :value="0">
                    <IconSync />
                    {{ $t('setting.app.appearance.theme.auto') }}
                  </a-radio>
                  <a-radio :value="1">
                    <IconSun />
                    {{ $t('setting.app.appearance.theme.light') }}
                  </a-radio>
                  <a-radio :value="2">
                    <IconMoonFill />
                    {{ $t('setting.app.appearance.theme.dark') }}
                  </a-radio>
                </a-radio-group>
              </a-space>
              <a-space v-if="settingStore.app.themeModel === 3" direction="vertical" :size="10">
                <div>{{ $t('setting.app.appearance.theme.customEdit') }}</div>
                <div class="custom-theme-list">
                  <div v-for="tk in Object.keys(defaultCustomThemeMap)" :key="tk" class="custom-theme-list-item">
                    <div class="custom-theme-list-item-label">{{ tk }}</div>
                    <a-color-picker v-model="settingStore.app.customThemeMap[tk]" size="small"
                      class="custom-theme-list-item-color-picker" />
                  </div>
                </div>
                <a-button size="mini" @click="settingStore.app.customThemeMap = copyObj(defaultCustomThemeMap)">
                  <a-space :size="5">
                    <icon-reply />
                    <span>{{ $t('setting.app.appearance.theme.customEditReset') }}</span>
                  </a-space>
                </a-button>
              </a-space>
              <a-space direction="vertical" :size="10" fill>
                <div>{{ $t('setting.app.appearance.fontSize') }}</div>
                <a-space :size="10">
                  <div>{{ $t('setting.app.appearance.min') }}</div>
                  <a-slider v-model="settingStore.app.fontSize" :min="1" :max="5" show-ticks style="width: 300px" />
                  <div>{{ $t('setting.app.appearance.max') }}</div>
                </a-space>
              </a-space>
              <a-space direction="vertical" :size="10" fill>
                <div>{{ $t('setting.app.appearance.local') }}</div>
                <a-select v-model="settingStore.app.locale" size="small" :fallback-option="false">
                  <a-option value="zh_CN">中文</a-option>
                  <a-option value="en_US">English</a-option>
                </a-select>
              </a-space>
            </a-space>
          </a-tab-pane>


        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.setting-page {
  height: 60vh;
  overflow-y: auto;
  font-size: var(--font-size-default);

  :deep(.arco-tabs) {
    height: 100%;

    .arco-radio-button.arco-radio-checked {
      color: #ef4477
    }



    .arco-tabs-tab-active,
    .arco-tabs-tab-active:hover {
      color: #ef4477 !important;
    }

    .arco-tabs-nav-ink {
      background-color: #ef4477 !important;
    }

    .arco-tabs-tab-title {
      font-size: var(--font-size-default);
    }

    .arco-tabs-content-list {
      height: 100%;

      .arco-tabs-pane {
        height: 100%;

        .setting-tab-content {
          height: 100%;
          overflow-y: hidden;
        }
      }
    }
  }

  .custom-theme-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background-color: var(--color-fill-1);
    box-sizing: border-box;
    padding: 10px;

    .custom-theme-list-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .custom-theme-list-item-label,
      .custom-theme-list-item-color-picker {
        flex-shrink: 0;
      }
    }
  }
}
</style>
