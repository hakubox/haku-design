<template>
  <div style="position: relative">
    <div v-if="type === '2'" class="verify-img-out" :style="{ height: parseInt(setSize.imgHeight) + vSpace + 'px' }">
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
        }"
      >
        <img :src="'data:image/png;base64,' + backImgBase" style="width: 100%; height: 100%; display: block" />
        <div v-show="showRefresh" class="verify-refresh" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div>
        <transition name="tips">
          <span v-if="tipWords" class="verify-tips" :class="passFlag ? 'suc-bg' : 'err-bg'">{{ tipWords }}</span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.imgWidth,
        height: barSize.height,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg" v-text="text"></span>
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          'border-color': leftBarBorderColor,
          // @ts-ignore
          transaction: transitionWidth,
        }"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          class="verify-move-block"
          :style="{
            width: barSize.height,
            height: barSize.height,
            'background-color': moveBlockBackgroundColor,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i :class="['verify-icon iconfont', iconClass]" :style="{ color: iconColor }"></i>
          <div
            v-if="type === '2'"
            class="verify-sub-block"
            :style="{
              width: Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px',
              height: setSize.imgHeight,
              top: '-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
            }"
          >
            <img
              :src="'data:image/png;base64,' + blockBackImgBase"
              style="width: 100%; height: 100%; display: block; -webkit-user-drag: none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * VerifySlide
 * @description 滑块
 * */
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
  nextTick,
  toRefs,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue';
import { post } from '@/lib/api';
import { aesEncrypt } from '../utils/ase';
import { resetSize } from '../utils/util';
import { createModelId } from '@/tools/common';

//  "captchaType":"blockPuzzle",
export default {
  name: 'VerifySlide',
  props: {
    captchaType: {
      type: String,
    },
    type: {
      type: String,
      default: '1',
    },
    /** 弹出式pop，固定fixed */
    mode: {
      type: String,
      default: 'fixed',
    },
    vSpace: {
      type: Number,
      default: 5,
    },
    explain: {
      type: String,
      default: '向右滑动完成验证',
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
    blockSize: {
      type: Object,
      default() {
        return {
          width: '50px',
          height: '50px',
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
    const { mode, captchaType, vSpace, imgSize, barSize, type, blockSize, explain } = toRefs(props);
    const _instance = getCurrentInstance() as ComponentInternalInstance;
    const proxy = _instance?.proxy as NonNullable<typeof _instance.proxy>;
    const _parentNode = proxy.$parent as NonNullable<typeof proxy.$parent>;
    const state = reactive({
      /** 后端返回的ase加密秘钥 */
      secretKey: '',
      /** 是否通过的标识 */
      passFlag: undefined as boolean | undefined,
      /** 验证码背景图片 */
      backImgBase: '',
      /** 验证滑块的背景图片 */
      blockBackImgBase: '',
      /** 后端返回的唯一token值 */
      backToken: '',
      /** 移动开始的时间 */
      startMoveTime: 0,
      /** 移动结束的时间 */
      endMovetime: 0,
      /** 提示词的背景颜色 */
      tipsBackColor: '',
      tipWords: '',
      text: '',
      finishText: '',
      setSize: {
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0,
      },
      top: 0,
      left: 0,
      moveBlockLeft: '0px' as string | undefined,
      leftBarWidth: '0px' as string | undefined,
      /** 移动中样式 */
      moveBlockBackgroundColor: '',
      leftBarBorderColor: '#ddd',
      iconColor: '',
      iconClass: 'icon-right',
      /** 鼠标状态 */
      status: false,
      /*** 是够验证完成 */
      isEnd: false,
      showRefresh: true,
      transitionLeft: '',
      transitionWidth: '',
      startLeft: 0,
    });

    const barArea = computed(() => proxy.$el.querySelector('.verify-bar-area'));

    /** 请求背景图片和验证图片 */
    function getPictrue() {
      const data = {
        captchaType: captchaType.value,
      };
      post('/captcha/get', data)
        .then((d) => {
          state.backImgBase = d.originalImageBase64;
          state.blockBackImgBase = d.jigsawImageBase64;
          state.backToken = d.token;
          state.secretKey = d.secretKey;
        })
        .catch((err) => {
          state.tipWords = err;
        });
    }

    // 鼠标按下
    function start(e) {
      const event = e || window.event;
      let x;
      if (!event.touches) {
        // 兼容PC端
        x = event.clientX;
      } else {
        // 兼容移动端
        x = event.touches[0].pageX;
      }
      state.startLeft = Math.floor(x - barArea.value.getBoundingClientRect().left);
      state.startMoveTime = +new Date(); // 开始滑动的时间
      if (state.isEnd === false) {
        state.text = '';
        state.moveBlockBackgroundColor = '#337ab7';
        state.leftBarBorderColor = '#337AB7';
        state.iconColor = '#fff';
        e.stopPropagation();
        state.status = true;
      }
    }

    const refresh = () => {
      state.showRefresh = true;
      state.finishText = '';

      state.transitionLeft = 'left .3s';
      state.moveBlockLeft = '0px';

      state.leftBarWidth = undefined;
      state.transitionWidth = 'width .3s';

      state.leftBarBorderColor = '#ddd';
      state.moveBlockBackgroundColor = '#fff';
      state.iconColor = '#000';
      state.iconClass = 'icon-right';
      state.isEnd = false;

      getPictrue();
      setTimeout(() => {
        state.transitionWidth = '';
        state.transitionLeft = '';
        state.text = explain.value;
      }, 300);
    };

    // 鼠标移动
    function move(e) {
      const event = e || window.event;
      if (state.status && state.isEnd === false) {
        let x;
        if (!event.touches) {
          // 兼容PC端
          x = event.clientX;
        } else {
          // 兼容移动端
          x = event.touches[0].pageX;
        }
        const barAreaLeft = barArea.value.getBoundingClientRect().left;
        let _moveBlockLeft = x - barAreaLeft; // 小方块相对于父元素的left值
        if (_moveBlockLeft >= barArea.value.offsetWidth - parseInt(parseInt(blockSize.value.width) / 2 + '') - 2) {
          _moveBlockLeft = barArea.value.offsetWidth - parseInt(parseInt(blockSize.value.width) / 2 + '') - 2;
        }
        if (_moveBlockLeft <= 0) {
          _moveBlockLeft = parseInt(parseInt(blockSize.value.width) / 2 + '');
        }
        // 拖动后小方块的left值
        state.moveBlockLeft = `${_moveBlockLeft - state.startLeft}px`;
        state.leftBarWidth = `${_moveBlockLeft - state.startLeft}px`;
      }
    }

    // 鼠标松开
    function end() {
      state.endMovetime = +new Date();
      // 判断是否重合
      if (state.status && state.isEnd === false) {
        let moveLeftDistance = parseInt((state.moveBlockLeft || '').replace('px', ''));
        moveLeftDistance = (moveLeftDistance * 310) / parseInt(state.setSize.imgWidth + '');
        const data = {
          captchaType: captchaType,
          pointJson: state.secretKey
            ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), state.secretKey)
            : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
          token: state.backToken,
        };
        const uniqueCode = createModelId();
        const action = localStorage.getItem('action');
        const getType = localStorage.getItem('type');
        const userId = localStorage.getItem('userId');
        post('captcha/check', { ...data, uniqueCode, action, getType, userId })
          .then((res) => {
            state.moveBlockBackgroundColor = '#5cb85c';
            state.leftBarBorderColor = '#5cb85c';
            state.iconColor = '#fff';
            state.iconClass = 'icon-check';
            state.showRefresh = false;
            state.isEnd = true;
            if (mode.value === 'pop') {
              setTimeout(() => {
                _parentNode['clickShow'] = false;
                refresh();
              }, 1500);
            }
            state.passFlag = true;
            state.tipWords = `${((state.endMovetime - state.startMoveTime) / 1000).toFixed(2)}s验证成功`;
            const captchaVerification = state.secretKey
              ? aesEncrypt(`${state.backToken}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`, state.secretKey)
              : `${state.backToken}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`;
            setTimeout(() => {
              state.tipWords = '';
              _parentNode?.['closeBox']?.();
              _parentNode.$emit('success', { captchaVerification, uniqueCode, action, getType, userId });
            }, 1000);
          })
          .catch((err) => {
            state.moveBlockBackgroundColor = '#d9534f';
            state.leftBarBorderColor = '#d9534f';
            state.iconColor = '#fff';
            state.iconClass = 'icon-close';
            state.passFlag = false;
            setTimeout(() => {
              refresh();
            }, 1000);
            _parentNode.$emit('error', proxy);
            state.tipWords = '验证失败';
            setTimeout(() => {
              state.tipWords = '';
            }, 1000);
          });
        state.status = false;
      }
    }

    function init() {
      state.text = explain.value;
      getPictrue();
      nextTick(() => {
        const { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
        state.setSize.imgHeight = imgHeight;
        state.setSize.imgWidth = imgWidth;
        state.setSize.barHeight = barHeight;
        state.setSize.barWidth = barWidth;
        _parentNode.$emit('ready', proxy);
      });

      window.removeEventListener('touchmove', (e) => {
        move(e);
      });
      window.removeEventListener('mousemove', (e) => {
        move(e);
      });

      // 鼠标松开
      window.removeEventListener('touchend', () => {
        end();
      });
      window.removeEventListener('mouseup', () => {
        end();
      });

      window.addEventListener('touchmove', (e) => {
        move(e);
      });
      window.addEventListener('mousemove', (e) => {
        move(e);
      });

      // 鼠标松开
      window.addEventListener('touchend', () => {
        end();
      });
      window.addEventListener('mouseup', () => {
        end();
      });
    }
    watch(type, () => {
      init();
    });
    onMounted(() => {
      // 禁止拖拽
      init();
      proxy.$el.onselectstart = () => {
        return false;
      };
    });
    return {
      ...toRefs(state),
      barArea,
      refresh,
      start,
    };
  },
};
</script>
