import axios from 'axios';
import { ERROR_CODE_MAP } from './response_code';
import { state as globalState } from '@/common/global';

axios.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response?.data) {
      const res = err.response.data;
      if (ERROR_CODE_MAP[res.status]) {
        globalState.router.push('/login');
      }
    }
    return Promise.reject(err);
  },
);
