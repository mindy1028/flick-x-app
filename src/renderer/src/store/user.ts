import { defineStore } from 'pinia'

// export const useUserStore = defineStore({
//   id: 'user',
//   state: () => ({
//     avatar: '',
//     nickname: 'Some one',
//     lastStartupTime: 0,
//     isLogin: false
//   }),
//   getters: {
//     getStoreJson(): string {
//       return JSON.stringify({
//         avatar: this.avatar,
//         nickname: this.nickname
//       })
//     }
//   },
//   actions: {
//     setStoreFromJson(json: string) {
//       let importFlag = false
//       if (!json) {
//         return importFlag
//       }
//       const userBackup = JSON.parse(json)
//       if (userBackup.avatar !== undefined) {
//         this.avatar = userBackup.avatar
//         importFlag = true
//       }
//       if (userBackup.nickname !== undefined) {
//         this.nickname = userBackup.nickname
//         importFlag = true
//       }
//       return importFlag
//     }
//   },
//   persist: true
// })

/////
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {
      user_id: 0,
      group_id: 0,
      user_name: '',
      user_account: '',
      company_name: '',
      user_email: '',
      user_phone_number: '',
      develop_password: '',
      create_time: '',
      api_platform_last_login_datetime: '', // API平台最后登录时间
      cineai_platform_last_login_datetime: '', // CineAI平台最后登录时间
      user_country: '',
      user_account_type: 0,
      company_tax_number: '',
      company_bank_card_number: '',
      company_bank_branch_name: '',
      account_audit_status: 0,
      user_area: '',
      user_meal_id: 0,
      user_deposit_count: 0,
      user_deposit_amount: 0,
      user_remain_energy: 0,
      user_img_product_count: 0,
      user_vid_product_count: 0,
      user_login_duration: '',
      user_is_logout: 0,
      user_logout_datetime: '',
      user_wx_avatar_url: '',
      user_wx_name: '',
      user_wx_access_token: '',
      platform_current_balance_sum: 0, // 平台当前余额总额
      platform_current_balance_cash: 0, // 平台当前现金余额
      platform_current_balance_voucher: 0, // 平台当前代金券余额
      platform_current_balance_arrears: 0, // 平台当前欠款余额
      platform_current_balance_credit: 0, // 平台当前信用余额
      platform_current_balance_invoice: 0, // 平台当前发票余额
      user_token: '',
      user_platform_token: '',
      remark1: '',
      remark2: '',
      remark3: ''
    },
    avatar: '',
    nickname: 'Some one',
    lastStartupTime: 0,
    isLogin: false
  }),
  getters: {
    getStoreJson(): string {
      return JSON.stringify({
        avatar: this.avatar,
        nickname: this.nickname
      });
    }
  },
  actions: {
    setUser(payload) {
      this.user = payload;
    },
    setStoreFromJson(json: string) {
      let importFlag = false;
      if (!json) {
        return importFlag;
      }
      const userBackup = JSON.parse(json);
      if (userBackup.avatar !== undefined) {
        this.avatar = userBackup.avatar;
        importFlag = true;
      }
      if (userBackup.nickname !== undefined) {
        this.nickname = userBackup.nickname;
        importFlag = true;
      }
      return importFlag;
    }
  },
  persist: true
});