<script setup lang="ts">
import chatModels from '@renderer/assets/json/chat-models.json'
import {
  isCustomModel,
  isSupportImage,
  isSupportNetwork,
  isSupportPlugin
} from '@renderer/utils/big-model/base-util'
import { watch } from 'vue'

defineProps({
  // 是否是虚拟助手模式
  isVirtual: {
    type: Boolean,
    default: () => false
  },
  typeChange: {
    type: Boolean,
    default: () => false
  }
})
const assistant = defineModel<Assistant>('assistant', { default: () => ({}) })

watch(
  () => assistant.value.provider,
  (value) => {
    if (chatModels[value] && chatModels[value][0]) {
      assistant.value.model = chatModels[value][0].name
    } else {
      assistant.value.model = ''
    }

    // 发音参数
    if (value === 'OpenAI') {
      assistant.value.speechModel = 'tts-1'
      assistant.value.speechVoice = 'alloy'
      assistant.value.speechSpeed = 1.0
    } else {
      assistant.value.speechModel = undefined
      assistant.value.speechVoice = undefined
      assistant.value.speechSpeed = undefined
    }
  }
)
</script>

<template>
  <a-form :model="assistant" layout="vertical" width="30vw">
    <!-- 助手名称 -->
    <a-form-item
      field="name"
      :label="isVirtual ? $t('assistantList.title') : $t('assistantList.name')"
    >
      <a-input
        v-model="assistant.name"
        :placeholder="
          $t('common.pleaseEnter') +
          ' ' +
          (isVirtual ? $t('assistantList.title') : $t('assistantList.name'))
        "
        :max-length="30"
      />
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less"></style>
