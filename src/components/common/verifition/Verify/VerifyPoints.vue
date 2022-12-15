<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
          'margin-bottom': vSpace + 'px',
        }"
      >
        <div v-show="showRefresh" class="verify-refresh" style="z-index: 3" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div>
        <img
          ref="canvas"
          :src="'data:image/png;base64,' + pointBackImgBase"
          style="width: 100%; height: 100%; display: block"
          @click="bindingClick ? canvasClick($event) : undefined"
        />

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          class="point-area"
          :style="{
            'background-color': '#1abd6c',
            color: '#fff',
            'z-index': 9999,
            width: '20px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '50%',
            position: 'absolute',
            top: parseInt((tempPoint.y - 10).toString()) + 'px',
            left: parseInt((tempPoint.x - 10).toString()) + 'px',
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.imgWidth,
        color: barAreaColor,
        'border-color': barAreaBorderColor,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * VerifyPoints
 * @description 点选
 * */
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
  nextTick,
  toRefs,
  watchEffect,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue';
import { get, post } from '@/lib/api';
import { resetSize, codeChars, codeColor1, codeColor2 } from '../utils/util';
import { aesEncrypt } from '../utils/ase';
import { createModelId } from '@/tools/common';

export default {
  name: 'VerifyPoints',
  props: {
    /** 弹出式pop，固定fixed */
    mode: {
      type: String,
      default: 'fixed',
    },
    captchaType: {
      type: String,
    },
    /** 间隔 */
    vSpace: {
      type: Number,
      default: 5,
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px',
        };
      },
    },
    barSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '40px',
        };
      },
    },
  },
  setup(props, context) {
    const { mode, captchaType, vSpace, imgSize, barSize } = toRefs(props);
    const _instance = getCurrentInstance() as ComponentInternalInstance;
    const proxy = _instance?.proxy as NonNullable<typeof _instance.proxy>;
    const _parentNode = proxy.$parent as NonNullable<typeof proxy.$parent>;
    const state = {
      secretKey: '', // 后端返回的ase加密秘钥
      checkNum: 3, // 默认需要点击的字数
      fontPos: [] as any[], // 选中的坐标信息
      checkPosArr: [] as any[], // 用户点击的坐标
      num: 1, // 点击的记数
      pointBackImgBase: '', // 后端获取到的背景图片
      poinTextList: [] as string[], // 后端返回的点击字体顺序
      backToken: '', // 后端返回的token值
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0,
      },
      tempPoints: [] as any[],
      text: '',
      barAreaColor: undefined as string | undefined,
      barAreaBorderColor: undefined as string | undefined,
      showRefresh: true,
      bindingClick: true,
    };

    /** 请求背景图片和验证图片 */
    function getPictrue() {
      const data = {
        captchaType: captchaType.value,
      };
      post('/captcha/get', data).then((d) => {
        state.pointBackImgBase = d.originalImageBase64;
        state.backToken = d.token;
        state.secretKey = d.secretKey;
        state.poinTextList = d.wordList;
        state.text = `请依次点击【${state.poinTextList.join(',')}】`;
      });
    }
    /** 获取坐标 */
    const getMousePos = (obj, e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      return { x, y };
    };
    /** 创建坐标点 */
    const createPoint = (pos) => {
      state.tempPoints.push({ ...pos });
      return state.num + 1;
    };
    /** 刷新 */
    const refresh = () => {
      state.tempPoints.splice(0, state.tempPoints.length);
      state.barAreaColor = '#000';
      state.barAreaBorderColor = '#ddd';
      state.bindingClick = true;
      state.fontPos.splice(0, state.fontPos.length);
      state.checkPosArr.splice(0, state.checkPosArr.length);
      state.num = 1;
      getPictrue();
      state.text = '验证失败';
      state.showRefresh = true;
    };
    /** 坐标转换函数 */
    const pointTransfrom = (pointArr, imageSize) => {
      const newPointArr = pointArr.map((p) => {
        const x = Math.round((310 * p.x) / parseInt(imageSize.imgWidth));
        const y = Math.round((155 * p.y) / parseInt(imageSize.imgHeight));
        return { x, y };
      });
      return newPointArr;
    };
    const init = () => {
      // 加载页面
      state.fontPos.splice(0, state.fontPos.length);
      state.checkPosArr.splice(0, state.checkPosArr.length);
      state.num = 1;
      getPictrue();
      nextTick(() => {
        const { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
        state.setSize.imgHeight = imgHeight;
        state.setSize.imgWidth = imgWidth;
        state.setSize.barHeight = barHeight;
        state.setSize.barWidth = barWidth;
        _parentNode.$emit('ready', proxy);
      });
    };
    onMounted(() => {
      // 禁止拖拽
      init();
      proxy.$el.onselectstart = function () {
        return false;
      };
    });
    const canvas = ref(null);
    const canvasClick = (e) => {
      state.checkPosArr.push(getMousePos(canvas, e));
      if (state.num === state.checkNum) {
        state.num = createPoint(getMousePos(canvas, e));
        // 按比例转换坐标值
        const arr = pointTransfrom(state.checkPosArr, state.setSize);
        state.checkPosArr.length = 0;
        state.checkPosArr.push(...arr);
        // 等创建坐标执行完
        setTimeout(() => {
          // var flag = this.comparePos(this.fontPos, this.checkPosArr);
          // 发送后端请求
          const captchaVerification = state.secretKey
            ? aesEncrypt(`${state.backToken}---${JSON.stringify(state.checkPosArr)}`, state.secretKey)
            : `${state.backToken}---${JSON.stringify(state.checkPosArr)}`;
          const data = {
            captchaType: captchaType,
            pointJson: state.secretKey
              ? aesEncrypt(JSON.stringify(state.checkPosArr), state.secretKey)
              : JSON.stringify(state.checkPosArr),
            token: state.backToken,
          };
          const uniqueCode = createModelId();
          const action = localStorage.getItem('action');
          const type = localStorage.getItem('type');
          const userId = localStorage.getItem('userId');

          post('captcha/check', { ...data, uniqueCode, action, type, userId })
            .then((d) => {
              state.barAreaColor = '#4cae4c';
              state.barAreaBorderColor = '#5cb85c';
              state.text = '验证成功';
              state.bindingClick = false;
              if (mode.value === 'pop') {
                setTimeout(() => {
                  _parentNode['clickShow'] = false;
                  refresh();
                }, 1500);
              }
              _parentNode.$emit('success', { uniqueCode, captchaVerification });
            })
            .catch((err) => {
              _parentNode.$emit('error', proxy);
              state.barAreaColor = '#d9534f';
              state.barAreaBorderColor = '#d9534f';
              state.text = '验证失败';
              setTimeout(() => {
                refresh();
              }, 700);
            });
        }, 400);
      }
      if (state.num < state.checkNum) {
        state.num = createPoint(getMousePos(canvas, e));
      }
    };
    return {
      ...toRefs(state),
      init,
      canvas,
      canvasClick,
      getMousePos,
      createPoint,
      refresh,
      getPictrue,
      pointTransfrom,
    };
  },
};
</script>
