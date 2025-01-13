<script setup lang="ts">
import { useSettingStore } from '@renderer/store/setting'
import { reactive, toRefs } from 'vue'
import Activity from "@renderer/components/modal/Activity.vue"

const settingStore = useSettingStore()

// 数据绑定
const data = reactive({
  keyword: ''
})
const { keyword } = toRefs(data)

const modalVisible = defineModel<boolean>('modalVisible', { default: () => false })
const agent = defineModel<MiniProgram>('agent', { default: () => false })

const emits = defineEmits(['selectPayment'])

const selectPayment = (prompt: string) => {
  emits('selectPayment', prompt)
  modalVisible.value = false
}
</script>

<template>
  <a-modal
    v-model:visible="modalVisible"
    :footer="false"
    :closable="false"
    width="85vw"
  >
    <div>
        <Activity :data-models="agent"/>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>

</style>
