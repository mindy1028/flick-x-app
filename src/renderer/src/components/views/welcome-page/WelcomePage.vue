<script setup lang="ts">
import { useSystemStore } from '@renderer/store/system'
import { useUserStore } from '@renderer/store/user'
import { nowTimestamp } from '@renderer/utils/date-util'
import { simulateThreadWait } from '@renderer/utils/thread-util'
import { nextTick, onMounted, reactive, toRefs, ref } from 'vue'
import { userGetCaptcha, userLogin, getUserInfo } from "@renderer/api/userapi";
import Crypoto from "@renderer/utils/crypto";
import { UserDataModel } from "@renderer/model/IUserDataModel";
import { Notification } from '@arco-design/web-vue';

const userStore = useUserStore()
const systemStore = useSystemStore()

const phoneNumber = ref("");
const phoneCaptcha = ref("");
const captcha_message = ref("获取验证码");
const captcha_state = ref(false);
const has_read = ref(false);

type CheckPhoneNumberResult = {
  isOk: boolean;
  errorMsg?: string;
};

const checkPhoneNumber = (phoneNumber: string): CheckPhoneNumberResult => {
  // 正则表达式匹配中国大陆手机号
  const regex = /^1[3-9]\d{9}$/;
  // console.log(phoneNumber)

  if (regex.test(phoneNumber)) {
    return { isOk: true };
  } else {
    let errorMsg = "手机号格式不正确";
    if (!phoneNumber) {
      errorMsg = "手机号不能为空";
    } else if (phoneNumber.length !== 11) {
      errorMsg = "手机号格式不正确";
    } else {
      errorMsg = "手机号格式不正确";
    }
    return { isOk: false, errorMsg };
  }
};

async function getCaptcha() {
  if (captcha_state.value) {
    return;
  }
  const result = checkPhoneNumber(phoneNumber.value);
  console.log(result)

  if (result.isOk) {
    try {
      // 调用userGetCaptcha函数
      const response = await userGetCaptcha(phoneNumber.value);
      // 处理响应
      if (response.code != 200) {
        // 处理错误情况
        // console.error('获取验证码失败:', response.msg);
        Notification.error({ title: '获取验证码失败', content: response.msg ? response.msg : "", })
      } else {
        // 验证码获取成功的处理
        // console.log('验证码已发送');
        // notify("", "验证码已发送", "success");
        Notification.success({ title: '', content: "验证码已发送", })
        // console.log(response);
      }
    } catch (error) {
      // 处理请求错误
      // console.error('请求失败:', error);
    }

    // console.log(result)
  } else {
    // console.log(result)
    // notify("请输入正确的手机号", result.errorMsg ? result.errorMsg : "", "error");
    Notification.info({ title: '请输入正确的手机号', content: result.errorMsg ? result.errorMsg : "" })
    return;
  }

  var verificationButtonStateCount = 60;
  var verificationButtonStateState = true;
  captcha_state.value = true;
  const intervalId = setInterval(() => {
    if (verificationButtonStateCount > 0) {
      verificationButtonStateCount -= 1;
      captcha_message.value = "倒计时" + verificationButtonStateCount.toString() + "秒";
    } else {
      clearInterval(intervalId);
      captcha_state.value = false;
      captcha_message.value = "重新获取";
      verificationButtonStateState = false;
      verificationButtonStateCount = 0;
    }
  }, 1000);
}

async function viewUserLogin() {
  if (phoneCaptcha.value == "" || phoneCaptcha.value.length < 5) {
    // notify("", "验证码格式错误", "error");
    Notification.error({ title: '', content: "验证码格式错误" })
    return;
  }
  if (!has_read.value) {
    // notify("", "请阅读用户协议和隐私协议", "error");
    Notification.error({ title: '', content: "请阅读用户协议和隐私协议" })
    return;
  }
  try {
    const cry: any = new Crypoto();
    const encryptStr = cry.encrypt(phoneCaptcha.value);
    // 调用userGetCaptcha函数
    const response = await userLogin(phoneNumber.value, encryptStr);
    // 处理响应
    if (response.code != 200) {
      // 处理错误情况
      // notify("登录失败", response.msg ? response.msg : "", "error");
      Notification.error({ title: '登录失败', content: response.msg ? response.msg : "" })
    } else {
      // 获取用户信息
      try {
        if(response.data.data.isSuccess == 0) {
          Notification.error({ title: '登录失败', content: "服务器异常" })
          return
        }
        const response_user_info = await getUserInfo(response.data.data.user_id);
        if (response_user_info.code != 200) {
          // notify("", "登录失败,用户信息获取失败", "error");
          Notification.error({ title: '', content: "登录失败,用户信息获取失败" })
        } else {
          // notify("", "登录成功", "success");
          Notification.success({ title: '', content: "登录成功" })
          // console.log(response_user_info.data)
          const userDataModel = UserDataModel.fromJson(
            JSON.stringify(response_user_info.data)
          );
          // console.log(userDataModel)
          // console.log(userDataModel.user_id)
          // console.log(response_user_info.data.user_id)
          // 保存用户信息到cookie
          // CookieManager.setCookie("userId", String(userDataModel.user_id), 30);
          // 保存用户信息到Vuex store
          // userStore.commit("setUser", userDataModel);
          // LocalStorageUtils.setItem("userInfo", userDataModel.toString());

          systemStore.isWelcomeShow = false
          window.location.reload();
        }
      } catch (error) {
        // 处理请求错误
        // console.error('请求失败:', error);
      }
    }
  } catch (error) {
    // 处理请求错误
    // console.error('请求失败:', error);
  }
}

const data = reactive({
  providers: [
    'FlickX',
  ] as BigModelProvider[],
  providerShowIndex: -1
})
const { providers, providerShowIndex } = toRefs(data)

onMounted(() => {
  // 轮流显示提供商Logo
  nextTick(async () => {
    if (
      nowTimestamp() - userStore.lastStartupTime > 24 * 60 * 60 * 1000 ||
      !systemStore.isStartup
    ) {
      for (let i = 0; i < data.providers.length; i++) {
        await simulateThreadWait(200)
        providerShowIndex.value++
      }
      await simulateThreadWait(2000)
    }
    if (systemStore.isStartup) {
      systemStore.isStartup = false
      systemStore.isWelcomeShow = false
      userStore.lastStartupTime = nowTimestamp()
    }
  })
})
</script>

<template>
  <div class="welcome-page z-index-max">
    <div class="cine-login-dialog">
      <div class="cineai-login-dialog-content">
        <!-- <div class="cineai-login-dialog-content-child">
          <span class="cineai-login-dialog-content-child-title">扫码关注</span>
          <img src="../../../assets/images/login-sitoai.png" />
        </div> -->
        <!-- <div class="vertical-line"></div> -->
        <div class="cineai-login-dialog-content-child">
          <span class="cineai-login-dialog-content-child-title">Flick-X登录</span>
          <div class="cineai-login-dialog-input-group">
            <div class="input-container-phonenumber input-container">
              <input placeholder="请输入手机号" type="text" class="input" v-model="phoneNumber" />
            </div>
            <div class="input-container">
              <input placeholder="请输入验证码" type="text" class="input-container-second input" v-model="phoneCaptcha" />
              <span @click="getCaptcha()">{{ captcha_message }}</span>
            </div>
            <div class="attention-container">
              <div class="checkbox-wrapper-46">
                <input type="checkbox" id="cbx-46" class="inp-cbx" @click="has_read = !has_read" />
                <label for="cbx-46" class="cbx">
                  <span>

                  </span>
                  <span>我已阅读并同意<a href="http://192.168.1.4:86/doc/customservice">用户协议</a>和<a
                      href="http://192.168.1.4:86/doc/privacypolicy">隐私协议</a></span>
                </label>
              </div>
            </div>
            <button class="pushable">
              <span class="edge"></span>
              <span class="front" @click="viewUserLogin()"> 立即登录 </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.welcome-page {
  width: 100vw;
  height: 100vh;
  background-color: var(--color-fill-2);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .cine-login-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cineai-login-dialog-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .cineai-login-dialog-content-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .cineai-login-dialog-content-child-title {
    font-weight: bold;
    font-size: 3em;
    color: #000;
  }

  .cineai-login-dialog-input-group {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .vertical-line {
    width: 1px;
    height: 25vh;
    border-left: 1px solid #888;
  }

  .input-container {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 290px;
  }

  .input-container-phonenumber {
    border-radius: 6px;
  }

  .input-container>span,
  .input-container .input {
    white-space: nowrap;
    display: block;
  }

  .input-container-second {
    border-radius: 6px 0 0 6px !important;
  }

  .input-container>span,
  .input-container .input:first-child {
    border-radius: 6px 6px 6px 6px;
  }

  .input-container>span,
  .input-container .input {
    border-radius: 0 6px 6px 0;
  }

  .input-container>span,
  .input-container .input {
    margin-left: -1px;
  }

  .input-container .input {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    width: 1%;
    margin-top: 0;
    margin-bottom: 0;
  }

  .input-container span {
    text-align: center;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 25px;
    color: #6b7385;
    background: #d4def5;
    border: 1px solid #cdd9ed;
    font-weight: bold;
    transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
    cursor: pointer;
  }

  .input-container:focus-within>span {
    color: #fff;
    background-color: #ef4477;
    border-color: #ef4477;
  }

  .input {
    display: block;
    width: 100%;
    padding: 8px 16px;
    line-height: 25px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    border-radius: 6px;
    -webkit-appearance: none;
    color: #99a3ba;
    border: 1px solid #cdd9ed;
    background: #fff;
    transition: border 0.3s ease;
  }

  .input::placeholder {
    color: #cbd1dc;
  }

  .input:focus {
    outline: none;
    border-color: #ef4477;
  }

  .cine-login-dialog-span {
    margin-top: 20px;
  }

  .pushable {
    position: relative;
    background: transparent;
    padding: 0px;
    border: none;
    cursor: pointer;
    outline-offset: 4px;
    outline-color: deeppink;
    transition: filter 250ms;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .pushable-not-allowed {
    position: relative;
    background: transparent;
    padding: 0px;
    border: none;
    cursor: pointer;
    outline-offset: 4px;
    outline-color: deeppink;
    transition: filter 250ms;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: not-allowed;
  }

  .edge {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(to right,
        hsl(248, 39%, 39%) 0%,
        hsl(248, 39%, 49%) 8%,
        hsl(248, 39%, 39%) 92%,
        hsl(248, 39%, 29%) 100%);
  }

  .edge-not-allowed {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background-color: #888;
  }

  .front {
    display: block;
    position: relative;
    border-radius: 8px;
    background: hsl(248, 53%, 58%);
    padding: 16px 32px;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 1rem;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .front-not-allowed {
    display: block;
    position: relative;
    border-radius: 8px;
    padding: 16px 32px;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 1rem;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
    background-color: #888;
  }

  .pushable:hover {
    filter: brightness(110%);
  }

  .pushable:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  .pushable:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  .pushable:focus:not(:focus-visible) {
    outline: none;
  }

  .input-container>span,
  .input-container .input:first-child {
    color: #000;
    font-weight: bold;
  }
}
</style>
