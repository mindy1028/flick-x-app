import { defineStore } from 'pinia'
import { UserDataModel } from "@renderer/model/IUserDataModel";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {} as UserDataModel
  }),
  getters: {
    getStoreJson(): string {
      return JSON.stringify({
      });
    }
  },
  actions: {
    setStoreFromJson(json: string) {
      let importFlag = false;
      if (!json) {
        return importFlag;
      }
      const userBackup = JSON.parse(json);
      if (userBackup.avatar !== undefined) {
        importFlag = true;
      }
      if (userBackup.nickname !== undefined) {
        importFlag = true;
      }
      return importFlag;
    }
  },
  persist: true
});