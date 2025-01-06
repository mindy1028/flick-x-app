import { defineStore } from 'pinia';
import { UserDataModel } from '../model/IUserDataModel';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userData: null as UserDataModel | null,
  }),
  getters: {
    getStoreJson(): string {
      return JSON.stringify(this.userData);
    },
  },
  actions: {
    setStoreFromJson(json: string): boolean {
      let importFlag = false;
      if (!json) {
        return importFlag;
      }
      try {
        const userBackup = JSON.parse(json) as UserDataModel;
        this.userData = userBackup;
        importFlag = true;
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
      return importFlag;
    },
    setUser(userData: UserDataModel) {
      this.userData = userData;
    },
    clearUser() {
      this.userData = null;
    },
  },
  persist: true,
});