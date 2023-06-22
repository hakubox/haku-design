import axios from 'axios';
import { state as globalState } from '@/common/global';

axios.interceptors.request.use((config) => config, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((res) => {
  return res;
}, (err) => {
  if (err.response?.data) {
    const res = err.response.data;
    if (res.code === '401') {
      globalState.router.push('/login');
    }
  }
  return Promise.reject(err);
});
