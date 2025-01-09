<script setup lang="ts">
import miniProgramJsonData from '@renderer/assets/json/mini-program.json'
import AssistantAvatar from '@renderer/components/avatar/AssistantAvatar.vue'
import MyWebView from '@renderer/components/views/mini-program/MyWebView.vue'
import { useSettingStore } from '@renderer/store/setting'
import { agentSelectAll } from "@renderer/api/agentapi"
import { computed, nextTick, onMounted, reactive, ref, toRefs } from 'vue'

// store
const settingStore = useSettingStore()

// ref
const miniProgramRef = ref()

// 数据绑定
const data = reactive({
  loading: false,
  miniProgramList: [] as MiniProgram[],
  miniProgramListStyle: {
    width: 0,
    cardWidth: 280,
    gap: 15
  },
  keyword: '',
  currentApp: {} as MiniProgram,
  isWebviewShow: false
})
const { loading, miniProgramListStyle, keyword, currentApp, isWebviewShow } = toRefs(data)

// appList 过滤
const appListFilter = computed(() => {
  return data.miniProgramList.filter((app) =>
    app.name[settingStore.app.locale].toLowerCase().includes(data.keyword.toLowerCase())
  )
})

// 打开应用
const openApp = (app: MiniProgram) => {
  data.currentApp = app
  if (app.type === 'webview') {
    data.isWebviewShow = true
  }
}

// 监听组件尺寸
const watchAIAppSize = () => {
  const resizeObserver = new ResizeObserver((entries) => {
    // entries 是一个 ResizeObserverEntry 对象数组，包含了目标元素的信息
    for (const entry of entries) {
      // 判断是 miniProgramRef
      if (entry.target === miniProgramRef.value) {
        // 获取新尺寸
        const newWidth = entry.contentRect.width
        // 计算列表样式
        data.miniProgramListStyle.width =
          newWidth -
          (newWidth % (data.miniProgramListStyle.cardWidth + data.miniProgramListStyle.gap)) -
          data.miniProgramListStyle.gap
      }
    }
  })
  resizeObserver.observe(miniProgramRef.value)
}

// 请求小程序列表
async function fetchMiniProgramList() {
  data.loading = true

  const result = await agentSelectAll()
  if (result.code != 200) {
    console.log("获取智能体失败")
    return
  }
  data.miniProgramList = result.data as MiniProgram[]
  data.loading = false
}

// 挂载完毕
onMounted(() => {
  // 监听组件尺寸
  // watchAIAppSize()
  // 请求小程序列表
  fetchMiniProgramList()
})
</script>

<template>
  <div ref="miniProgramRef" class="mini-program">
    <!-- 头部 -->
    <div class="mini-program-header drag-area">
      <div class="mini-program-header-title">{{ $t('miniProgram.name') }}</div>
      <div class="mini-program-header-search">
        <a-input-search v-model="keyword" size="small" :placeholder="$t('miniProgram.search')"
          class="search-input no-drag-area" />
      </div>
    </div>
    <!-- 列表 -->
    <a-scrollbar outer-class="mini-program-list-container arco-scrollbar-small"
      style="height: calc(100vh - 55px); display: flex; flex-direction: row; width: 100%;">
      <!-- 左侧内容 -->
      <div class="mini-program-list-left" v-if="appListFilter.length > 0" style="margin-right: 10px;">
        <div v-for="a in appListFilter" :key="a.url" class="mini-program-card" @click="openApp(a)">
          <a-card :title="a.name[settingStore.app.locale]" hoverable>
            {{ a.desc[settingStore.app.locale] }}
          </a-card>
        </div>
      </div>
      <!-- 分割线 -->
      <a-divider class="mini-program-divider" orientation="vertical" />
      <!-- 右侧内容 -->
      <div class="mini-program-list-right" v-if="appListFilter.length > 0">
        <!-- 右侧的内容，根据实际需求填充 -->
        <div v-if="!data.currentApp.url">
          <div class="mini-program-avatar">
            <AssistantAvatar :size="40" />
            {{ $t('common.slogan2') }}
          </div>  
        </div>
        <!-- 这里可以放置与左侧不同的内容 -->
      </div>
      <div class="mini-program-list-empty" v-else>
        <a-empty>
          <template #image>
            <icon-apps />
          </template>
          {{ $t('miniProgram.empty') }}
        </a-empty>
      </div>
    </a-scrollbar>
    <!-- 刷新按钮 -->
    <a-button class="mini-program-list-left-refresh-btn" type="primary" shape="circle" :disabled="loading"
      @click="fetchMiniProgramList">
      <icon-loading v-if="loading" spin />
      <icon-refresh v-else />
    </a-button>
  </div>
</template>

<style lang="less" scoped>
.mini-program {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  .mini-program-header {
    flex-shrink: 0;
    height: 55px;
    border-bottom: 1px solid var(--color-border-1);
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .mini-program-header-title {
      flex-grow: 1;
      font-size: var(--font-size-lg);
      font-weight: 500;
    }

    .mini-program-header-search {
      flex-shrink: 0;

      .search-input {
        border: none;
        background-color: var(--color-fill-2);
      }
    }
  }

  .mini-program-list-container {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: flex-start;

    .mini-program-list-left {
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 10px 0;
      max-width: 80vw;
      /* 设置左侧容器的宽度为 250px */
      width: 30%;
      flex-shrink: 0;
      /* 防止在空间不足时缩小 */

      .mini-program-card {
        width: 25vw;
        margin: 1vw;
        cursor: pointer;

        :deep(.arco-card-header-title) {
          font-size: var(--font-size-lg);
        }

        :deep(.arco-card-header-extra) {
          color: var(--color-text-2);
          font-size: var(--font-size-default);
        }

        :deep(.arco-card-body) {
          font-size: var(--font-size-default);
        }
      }

      .mini-program-card:hover {
        color: #EF4477;
      }
    }

    .mini-program-list-empty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
    }
  }

  .mini-program-divider {
    border-left: 1px solid #d9d9d9; // 分割线颜色
    height: 100%; // 分割线高度，使其填满父容器的高度
  }

  .mini-program-list-left-refresh-btn {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: #EF4477;
  }

  .mini-program-list-right {
    width: 80%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .mini-program-avatar {
      display: flex;
      flex-direction: column; 
      align-items: center; 
      gap: 10px;
    }
  }
}
</style>
