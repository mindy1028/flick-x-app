<template>
  <div class="sales-card">
    <template v-for="(item, index) in props.dataModels" :key="index">
      <div class="card card-inner">
        <div class="header">
          <span class="title">{{ item.price_title }}</span>
          <div class="price-content"><span class="price">￥{{ item.price_amount_now }}元</span>
            <span class="price-old">￥{{ item.price_amount_true }}元</span>
          </div>
        </div>
        <p class="desc"></p>
        <ul class="lists">
          <template v-for="(element, idx) in JSON.parse(item.price_item)" :key="idx">
            <li class="list">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"></path>
              </svg>
              <span>{{ element }}</span>
            </li>
          </template>
        </ul>
        <button type="button" class="action" @click="payStartup(item)">订阅购买</button>
      </div>
    </template>

    <a-modal
      v-model:visible="centerDialogVisible"
      width="23vw"
      class="pay-dialog"
      centered
    :footer="false"
    :closable="false"
    >
      <!-- <span class="title_span">待支付金额<span class="amount_span">{{ payAmount }}</span>元</span> -->
      <iframe v-if="payReady" :src="pay_url" width="184" height="184">
      </iframe>
      <!-- <span style="color: #fff">支付宝扫一扫完成付款</span> -->
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PriceDataModel } from '@renderer/model/IPriceDataModel';
import { aliPayCreate } from "@renderer/api/paymentapi.ts"
import { Notification } from '@arco-design/web-vue';
import { useRouter } from "vue-router";
import { useUserStore } from '@renderer/store/user'

const centerDialogVisible = ref(false)
const pay_url = ref("")
const payReady = ref(false)
const payAmount = ref("")
const router = useRouter();
const userStore = useUserStore()

async function payStartup(meal_info) {
  // 获取支付二维码
  const userInfo = userStore.user
  payAmount.value = meal_info.price_amount_now
  if(userInfo == undefined) {
    Notification.error({ title: '', content: "请先登录", })
    router.push({ name: "WelcomePage" });
    return
  }

  if(payAmount == undefined) {
    Notification.error({ title: '', content: "账单信息获取失败，请刷新页面后重试", })
    return
  }

  const result = await aliPayCreate(userInfo.user_id, meal_info.price_title, meal_info.price_amount_now, "cine", meal_info.price_id)
  
  if(result.code != 200) {
    Notification.error({ title: '', content: "支付环境异常，请稍后重试", })
    return
  }
  
  if(result.data.isSuccess != 1) {
    Notification.error({ title: '', content: "支付环境异常，请稍后重试", })
    return
  }

  pay_url.value = result.data.message
  payReady.value = true
  centerDialogVisible.value = true
}

const props = defineProps<{
  dataModels: PriceDataModel[]; // 定义接收的 props 类型
}>();

onMounted(() => {
  // console.log(props.dataModels);
});
</script>

<style scope>
.sales-card {
  display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 50px;
    height: 551px;
    justify-items: center;
    /* row-gap: 10px; */
    gap: 20px;
}

.sales-card .card {
  /* display: flex;
  flex-direction: column;
  height: 100px;
  border-radius: 10px;
  color: white; 
  cursor: pointer; */
  transition: 400ms;
}

/* .sales-card .card:hover {
  transform: scale(1.1, 1.1);
} */

/* .sales-card:hover>.card:not(:hover) {
  filter: blur(10px);
  transform: scale(0.9, 0.9);
} */

.price-content {
  display: flex;
  align-items: flex-end;
}

.price-old {
  text-decoration: line-through;
}

.card-inner {
  /* margin-left: -1rem; */
  /* margin-right: -1rem; */
  flex-wrap: wrap;
  align-items: stretch;
  margin-bottom: 2rem;
  width: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  background-color: rgba(17, 24, 39, 1);
  padding: 1.5rem;
  height: 450px
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: #fff
}

.price {
  font-size: 3.75rem;
  line-height: 1;
  font-weight: 700;
  color: #fff
}

.desc {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.625;
  color: rgba(156, 163, 175, 1);
}

.lists {
  margin-bottom: 1.5rem;
  flex: 1 1 0%;
  color: rgba(156, 163, 175, 1);
}

.lists .list {
  margin-bottom: 0.5rem;
  display: flex;
  margin-left: -3.5rem
}

.lists .list svg {
  height: 1.5rem;
  width: 1.5rem;
  flex-shrink: 0;
  margin-right: 0.5rem;
  color: rgba(167, 139, 250, 1);
}

.action {
  border: none;
  outline: none;
  display: inline-block;
  border-radius: 0.25rem;
  background-color: rgba(167, 139, 250, 1);
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(17, 24, 39, 1);
  cursor: pointer;
}
</style>