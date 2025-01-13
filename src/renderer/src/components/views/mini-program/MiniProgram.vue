<script setup lang="ts">
import AssistantAvatar from '@renderer/components/avatar/AssistantAvatar.vue'
import { useSettingStore } from '@renderer/store/setting'
import { agentSelectAll } from "@renderer/api/agentapi"
import { priceGetCine } from "@renderer/api/priceapi"
import { PriceDataModel } from '@renderer/model/IPriceDataModel';
import Payment from "@renderer/components/modal/Payment.vue"
import { computed, nextTick, onMounted, reactive, ref, toRefs } from 'vue'

// store
const settingStore = useSettingStore()

// ref
const miniProgramRef = ref()
const SubscribeStatus = ref("订阅")
const columns = ref([
  {
    title: '版本号',
    dataIndex: 'currentVersion',
    key: 'currentVersion',
  },
  {
    title: '变更时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '变更描述',
    dataIndex: 'updateDescription',
    key: 'updateDescription',
  },
])

// 数据绑定
const data = reactive({
  paymentModalVisible: false,
  loading: false,
  miniProgramList: [] as MiniProgram[],
  miniProgramListStyle: {
    width: 0,
    cardWidth: 280,
    gap: 15
  },
  keyword: '',
  currentApp: {} as MiniProgram,
  currentPrice: [] as PriceDataModel[],
  isWebviewShow: false
})
const { loading, miniProgramListStyle, keyword, currentApp, isWebviewShow } = toRefs(data)

// appList 过滤
const appListFilter = computed(() => {
  return data.miniProgramList.filter((item) => item.name.includes(data.keyword))
})

// 打开应用
const openApp = (app: MiniProgram) => {
  data.currentApp = app
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

// 请求Agent列表
async function fetchMiniProgramList() {
  data.loading = true

  const result = await agentSelectAll()
  if (result.code != 200) {
    console.log("获取智能体失败")
    return
  }
  data.miniProgramList = result.data as unknown as MiniProgram[]
  data.loading = false
}

async function SubscribeClick() {
  // 获取对应Agent的价格信息
  const result = await priceGetCine()
  if (result.code != 200) {
    console.log("获取价格失败")
    return
  } else {
    data.currentPrice = [] as PriceDataModel[]
    const price_record = result.data.record_list as PriceDataModel[]
    console.log(price_record)
    for (var i = 0; i < price_record.length; i++) {
      if (price_record[i].price_belong == data.currentApp.name) {
        console.log(price_record[i].price_belong)
        console.log(data.currentApp.name)
        data.currentPrice.push(price_record[i])
      }
    }
    console.log(data.currentPrice);
  }
  data.paymentModalVisible = true
}

const selectPayment = () => {

}

// 挂载完毕
onMounted(() => {
  // 监听组件尺寸
  // watchAIAppSize()
  // 请求Agent列表
  fetchMiniProgramList()
})
</script>

<template>
  <div ref="miniProgramRef" class="ai-agent">
    <!-- 头部 -->
    <div class="ai-agent-header drag-area">
      <div class="ai-agent-header-title">{{ $t('miniProgram.name') }}</div>
      <div class="ai-agent-header-search">
        <a-input-search v-model="keyword" size="small" :placeholder="$t('miniProgram.search')"
          class="search-input no-drag-area" />
      </div>
    </div>
    <!-- 列表 -->
    <a-scrollbar outer-class="ai-agent-list-container arco-scrollbar-small"
      style="height: calc(100vh - 55px); display: flex; flex-direction: row; width: 100%;">
      <!-- 左侧内容 -->
      <div class="ai-agent-list-left" v-if="appListFilter.length > 0" style="margin-right: 10px;">
        <div v-for="a in appListFilter" :key="a.agentId" class="ai-agent-card" @click="openApp(a)">
          <a-card :title="a.name" hoverable>
            {{ a.description.short }}
          </a-card>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="ai-agent-list-right" v-if="appListFilter.length > 0"
        :class="{ 'ai-agent-list-right-grid': data.currentApp.agentId }">
        <!-- 右侧的内容，根据实际需求填充 -->
        <div v-if="!data.currentApp.agentId">
          <div class="ai-agent-avatar">
            <AssistantAvatar :size="50" />
            {{ $t('common.slogan2') }}
          </div>
        </div>
        <!-- 这里可以放置与左侧不同的内容 -->
        <div v-else class="ai-agent-overview">
          <div class="ai-agent-overview-top">
            <div class="ai-agent-overview-avatar-area">
              <div class="ai-agent-avatar">
                <img width="100vw" :src="data.currentApp.avatar" style="border-radius: 10px;">
              </div>
              <div class="ai-agent-description-area">
                <div class="ai-agent-name-version">
                  <h2>{{ data.currentApp.name }}</h2>
                  <p>{{ data.currentApp.currentVersion }}</p>
                </div>
                <div>
                  <p>{{ data.currentApp.description.short }}</p>
                </div>
              </div>
            </div>
            <div class="ai-agent-overview-operater-area">
              <button class="btn" @click="SubscribeClick()">{{ SubscribeStatus }}</button>
            </div>
          </div>
          <div class="ai-agent-overview-bottom">
            <a-tabs default-active-key="1" position="top">
              <a-tab-pane key="1" title="概述">
                <div
                  style="display: flex; flex-direction: column; align-items: center; margin-top: 10px; text-align: center;">
                  <img src="../../../assets/images/cybertron.png" width="250px">
                  <h3>{{ data.currentApp.description.medium }}</h3>
                  <div style="width: 100px; height: 2px; background-color: #000; margin-bottom: 10px;"></div>
                </div>
                <span style="font-size: 16px; letter-spacing: 2px; line-height: 30px;">{{ data.currentApp.description.long
                }}</span>
              </a-tab-pane>
              <a-tab-pane key="2" title="使用说明">
                <div style="overflow: auto;     height: 65vh;">
                  <h3>{{ data.currentApp.usageInstructions.overview }}</h3>
                  <div v-for="c in data.currentApp.features" :key="c.title">
                    <h2>🙌{{ c.title }}</h2>
                    <div v-for="p in c.feature" :key="p">
                      <p>✨{{ p }}</p>
                    </div>
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" title="变更记录">
                <a-table :dataSource="data.currentApp.changeLog" :columns="columns"
                  :rowKey="record => record.currentVersion" />
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
      <div class="ai-agent-list-empty" v-else>
        <a-empty>
          <template #image>
            <icon-apps />
          </template>
          {{ $t('miniProgram.empty') }}
        </a-empty>
      </div>
    </a-scrollbar>
    <!-- 刷新按钮 -->
    <a-button class="ai-agent-list-left-refresh-btn" type="primary" shape="circle" :disabled="loading"
      @click="fetchMiniProgramList">
      <icon-loading v-if="loading" spin />
      <icon-refresh v-else />
    </a-button>

    <Payment v-model:modalVisible="data.paymentModalVisible" v-model:agent="data.currentPrice"
      @select-payment="selectPayment" />
  </div>
</template>

<style lang="less" scoped>
.ai-agent {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  .ai-agent-header {
    flex-shrink: 0;
    height: 55px;
    border-bottom: 1px solid var(--color-border-1);
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ai-agent-header-title {
      flex-grow: 1;
      font-size: var(--font-size-lg);
      font-weight: 500;
    }

    .ai-agent-header-search {
      flex-shrink: 0;

      .search-input {
        border: none;
        background-color: var(--color-fill-2);
      }
    }
  }

  .ai-agent-list-container {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: flex-start;

    .ai-agent-list-left {
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 10px 0;
      max-width: 80vw;
      /* 设置左侧容器的宽度为 250px */
      width: 30%;
      flex-shrink: 0;
      border-right: 2px solid var(--color-border-1);
      /* 防止在空间不足时缩小 */

      .ai-agent-card {
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

      .ai-agent-card:hover {
        color: #EF4477;
      }
    }

    .ai-agent-list-empty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
    }
  }

  .ai-agent-list-left-refresh-btn {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: #EF4477;
  }

  .ai-agent-list-right {
    width: 80%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .ai-agent-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }

  .ai-agent-overview {
    height: 100%;
    width: 100%;

    .ai-agent-overview-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .ai-agent-overview-avatar-area {
        display: flex;
        align-items: center;
        gap: 10px;

        .ai-agent-name-version {
          display: flex;
          gap: 10px;
          align-items: flex-start;

          p {
            font-weight: bold;
          }
        }
      }

      .ai-agent-overview-operater-area {

        .btn-close {
          cursor: copy !important;
        }

        .btn {
          position: relative;
          font-size: 13px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 1em 2.5em;
          display: inline-block;
          cursor: pointer;
          border-radius: 6em;
          transition: all 0.2s;
          border: none;
          font-family: inherit;
          font-weight: 500;
          color: #FFF;
          background-color: #EF4477;
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .btn:active {
          transform: translateY(-1px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }

        .btn::after {
          content: "";
          display: inline-block;
          height: 100%;
          width: 100%;
          border-radius: 100px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
          transition: all 0.4s;
        }

        .btn::after {
          background-color: #EF4477;
        }

        .btn:hover::after {
          transform: scaleX(1.4) scaleY(1.6);
          opacity: 0;
        }
      }
    }

    .ai-agent-overview-bottom {
      overflow-y: scroll;
    }
  }
}
</style>