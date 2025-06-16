import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const initUser = {
    username: '',
    name: '',
    nickname: '',
    phone: '',
    email: '',
    birth: '',
    joinDate: '',
    profileImg: '',
    fcmToken: '',
    deleted: false,
    withdrawalReason: '',
    withdrawalDate: '',
    isAdmin: false,
    lat: 0,
    lng: 0,
    totalPoint: 0,
    introduce: ''
  };
  

export const userAtom = atomWithStorage("user", initUser, createJSONStorage(() => sessionStorage));
export const tokenAtom = atomWithStorage(
  "token",
  { access_token: '', refresh_token: '' },
  createJSONStorage(() => sessionStorage)
);

