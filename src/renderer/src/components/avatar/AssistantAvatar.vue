<script setup lang="ts">
defineProps({
  provider: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 30
  }
})
</script>

<template>
  <a-avatar shape="square" :size="size" class="assistant-avatar">
    <img alt="avatar" src="@renderer/assets/images/flick-x.png" />
  </a-avatar>
</template>

<style lang="less" scoped>
.assistant-avatar {
  :deep(.arco-avatar-image) {
    background-color: var(--color-bg-white);

    img {
       object-fit: cover;  //如果出现4个边角试着删除img{}
    }
  }
}
</style>
