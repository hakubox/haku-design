<template>
  <div v-show="showBox" :class="mode === 'pop' ? 'mask' : ''">
    <div :class="mode === 'pop' ? 'verifybox' : ''" :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }">
      <div v-if="mode === 'pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div class="verifybox-bottom" :style="{ padding: mode == 'pop' ? '15px' : '0' }">
        <!-- 验证码容器 -->
        <component
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import { computed, ref, watch, toRefs, watchEffect } from 'vue';
import VerifySlide from './Verify/VerifySlide.vue';
import VerifyPoints from './Verify/VerifyPoints.vue';

const props = defineProps({
  captchaType: {
    type: String,
    required: true,
  },
  figure: {
    type: Number,
  },
  arith: {
    type: Number,
  },
  mode: {
    type: String,
    default: 'pop',
  },
  vSpace: {
    type: Number,
  },
  explain: {
    type: String,
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
  },
  barSize: {
    type: Object,
  },
});

const { captchaType, mode } = toRefs(props);
const clickShow = ref(false);
const verifyType = ref<string>();
const componentType = ref<string>();

const instance = ref<any>();

const showBox = computed(() => {
  if (mode.value === 'pop') {
    return clickShow.value;
  }
  return true;
});
/**
 * refresh
 * @description 刷新
 * */
const refresh = () => {
  if (instance.value.refresh) {
    instance.value.refresh();
  }
};
const closeBox = () => {
  clickShow.value = false;
  refresh();
};
const show = () => {
  if (mode.value === 'pop') {
    clickShow.value = true;
  }
};
watchEffect(() => {
  switch (captchaType.value) {
    case 'blockPuzzle':
      verifyType.value = '2';
      componentType.value = 'VerifySlide';
      break;
    case 'clickWord':
      verifyType.value = '';
      componentType.value = 'VerifyPoints';
      break;
    default:
      break;
  }
});
</script>
<style>
.verifybox {
  position: relative;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid #e4e7eb;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.verifybox-top {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  font-size: 16px;
  color: #45494c;
  border-bottom: 1px solid #e4e7eb;
  box-sizing: border-box;
}

.verifybox-bottom {
  padding: 15px;
  box-sizing: border-box;
}

.verifybox-close {
  position: absolute;
  top: 13px;
  right: 9px;
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  /* display: none; */
  transition: all 0.5s;
}

.verify-tips {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
}

.suc-bg {
  background-color: rgba(92, 184, 92, 0.5);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}

.err-bg {
  background-color: rgba(217, 83, 79, 0.5);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}

.tips-enter,
.tips-leave-to {
  bottom: -30px;
}

.tips-enter-active,
.tips-leave-active {
  transition: bottom 0.5s;
}

/* ---------------------------- */
/*常规验证码*/
.verify-code {
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 5px;
  border: 1px solid #ddd;
}

.cerify-code-panel {
  height: 100%;
  overflow: hidden;
}

.verify-code-area {
  float: left;
}

.verify-input-area {
  float: left;
  width: 60%;
  padding-right: 10px;
}

.verify-change-area {
  line-height: 30px;
  float: left;
}

.varify-input-code {
  display: inline-block;
  width: 100%;
  height: 25px;
}

.verify-change-code {
  color: #337ab7;
  cursor: pointer;
}

.verify-btn {
  width: 200px;
  height: 30px;
  background-color: #337ab7;
  color: #ffffff;
  border: none;
  margin-top: 10px;
}

/*滑动验证码*/
.verify-bar-area {
  position: relative;
  background: #ffffff;
  text-align: center;
  box-sizing: content-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.verify-bar-area .verify-move-block {
  position: absolute;
  top: 0px;
  left: 0;
  background: #fff;
  cursor: pointer;
  box-sizing: content-box;
  box-shadow: 0 0 2px #888888;
  border-radius: 1px;
}

.verify-bar-area .verify-move-block:hover {
  background-color: #337ab7;
  color: #ffffff;
}

.verify-bar-area .verify-left-bar {
  position: absolute;
  top: -1px;
  left: -1px;
  background: #f0fff0;
  cursor: pointer;
  box-sizing: content-box;
  border: 1px solid #ddd;
}

.verify-img-panel {
  margin: 0;
  box-sizing: content-box;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-radius: 3px;
  position: relative;
}

.verify-img-panel .verify-refresh {
  width: 25px;
  height: 25px;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

.verify-img-panel .icon-refresh {
  font-size: 20px;
  color: #fff;
}

.verify-img-panel .verify-gap {
  background-color: #fff;
  position: relative;
  z-index: 2;
  border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
  position: absolute;
  text-align: center;
  z-index: 3;
  /* border: 1px solid #fff; */
}

.verify-bar-area .verify-move-block .verify-icon {
  font-size: 18px;
}

.verify-bar-area .verify-msg {
  z-index: 3;
}

.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-check:before {
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAk1BMVEUAAAAzMzMzMzMyMjIzMzMyMjIxMTEzMzMzMzM9PT0zMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMzMzMzMzMzMzMyMjIyMjIzMzMzMzMyMjIzMzMzMzMzMzMzMzMzMzMyMjIzMzMwMDAzMzMzMzMzMzMzMzMzMzMoKCgzMzMzMzMyMjIzMzMzMzP0ydTiAAAAMHRSTlMA9fwQ+SIL8doIKRboMN9G5NS7Uj/sz4R0XjWMfcbBqaSabGRMGsuwn5M6Bh22FFiEB737AAADlklEQVR42u3biXKiABAE0EG8UJFgvDVeq9Fojvn/r9vaKpPSMCwohExT8/6gq2KFphkyxhhjjDHGGGOMMcYYY4wxpli7nUf4+nuH2ek9EjbvwGe9dwLm9fhL6BKs054vrAjWiq/4BGrN12aEacTfLAjSmL9rEqINRwwJ0KTCEQfCsxVyMOB/977DUSHBmTY4qjolNK0BR1U+CE2tw4I/hGbXZcGY0LyHLBgRGveZBS+ExlvwGfYD/OmNBXuCs2RBD+/Vw5oFT3VCM2PBEK+qz1nQbBOaDQseaoRGKiDcaRGaRylHA++9SVDlKOdIaI6OVEACQuOLBQSv2ZalgLyWpIC0myyYExp3WI4CUl8wl+FVnFxAlgSnLAXkYAVElVFJCsiYBd0doZmUpEiJBWSAV6S2ValI4S0H4pLj9AmNvORsCU1plpyHchQpW3J0sSVHF1tyYrVduonOJWf75jA3llNKR2uRct/4bO1RKjqXnPqQvyzqVJwNC7qvGT/dLD7JhPNdcvwMv7T8i5Sf3w/u2aUiBNW8C8gT35JE8ZLT5F9I4jfyX3KGHDF8J5HuJWfFhSd5FYvUhrL5YEHYpijtS07IguaOrgEsOVMnRRKIJeexWmASr/eDS87WYUG3Rle0FpBLQYokOgvI7UlUFpC4JPEv9YGWnH4BSTaFLDn9Rnw/wFpyjjFJ8JacmCQ+5SIocMmZDn4uybHQJccXkwymlJlf8JIjJ8n+B9DqJCw5IEl+Y8lpdcQkR7wlJy4J3pLTemCB08dbcuKS4C05NTlJgLfk1LpyEnVF6s5Pb6tbdUUqOUlTTpJHkQpdiqcziYqbnHYoJnnEu8mJS4J3kyMnqUwona2em5xMSQJNn5K1h3cnmeq6yXGf5SR4NzlyEt7g3eS4T3ISvJucO5K0Q5U3OfWFnERhAbkvyRjvJqfeY8kc7yYnLonCApLAi0misIAk8PYsGeHd5JxikuDd5MQkmaX5lEyX01JOAniTs5KTAN7kyEnW5wKCdJPznyRHTUUq2SEuiY92kyMnObQ6cDc5a5ZU1RWpZC8sUFik7koCepMz42+UFqmbP44Bvsm5SgJ9k3ORRHWRumExUF6kUp/R//6Sk08SgCKVKglKAUlMomTJyeyPliUne5IKTAFJTKJkyckhiZIlJ7NJ5XLJQhZ8rjpN1N/HJ2/e/BdjjvN8Fa9eQ3q6MsYYY4wxxhhjjDHGGGOMMTr8BSWH6L42dtPpAAAAAElFTkSuQmCC');
  background-size: contain;
}

.icon-close:before {
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAANlBMVEUAAAA1NTUzMzMqKiozMzM0NDQzMzMzMzMzMzMyMjIzMzMzMzMzMzMzMzMyMjI2NjYzMzMzMzMacQPgAAAAEXRSTlMACbwLwsH6340euJYneqIcfNGSFMcAAALZSURBVHja7d3bjuIwEIThDpnNATLD9vu/7KoXaU7S1IAT2a6m/lskyIeTm0hum1JKKaWUUkoppZRSStVoWEdr2rgOtrt1md19vmzWqO3y/wKW1Xb1OvmtabEmLe8X8Go7evOPzoNVbzj7R29W3F//3Km6ZDj554rXZJ38Sy8VHnrg8Gm1shaPqq0JdkSLlTV7bQl2+Fz4TR5VvLuwIxqspKtHddcEO/xqJY3u1dcEO3wofUaqrwl2zFbWxWtLsMMvVtY2eeW7CzumzQpbvO6aYIcvVty5rgQ7zju/FN9d9Rx/RmOSQAeRBDqIJNBBJIEOIgl0EEmgg0gCHUQS6CCSQAeRBDqIJNBBJPnFQSP51UEiucNBIbnLQSC509G95G5H55IHHF1LHnJ0LHnQ0a3kYUenkuYOKKFyQAmVA0qoHFBC5YASKgeUUDmghMoBJVQOKKFyQAmVA0qoHFBC5YASKgeUUDmghMoBJVQOKKFyQAmVA0qoHFBC5YASKgeUUDmA5PTjB4N12Y8SqvW4SXI4QpLDEZIcjpDkcIQkhyMkORwhyeEISQ5HSHI4QpLDEZIcDgB5oYKEI4MkHBkk4cggCUcGSTgySMKRQRKODJJwZJCEI4MkHBkk4cggyfKCDrwXHU5EawLf7xJJoINIAh1EEuggkkAHkQQ6iCTA0Xwv9kGO5nuxD3I034t9kKP5XuyDHM33Yh/kaL4X+yBH873YBzma78U+zEEkgQ4iCXQQSaCDSAIdRBLoIJJAB5EEOogk0EEkgQ4iCXQQSaCDSAIdRBLoIJJAB5FEc+76kmjOXV8SzbnrS6I5d31JNOeuL4nm3PUl0Zy7viRZ5tylGe6dZdz6NvU15+42AP+ZjyTIckjE2N+cu7LfXv17pAepDP3NuYt/8YkPG8pz/NM69TXnbloteuIj0vIcWpfnGMGODna8HrC++066THABSimllFJKKaWUUkqpZ+kfYHmgulqbaNcAAAAASUVORK5CYII=');
  background-size: contain;
}

.icon-right:before {
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  z-index: 9999;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAk1BMVEUAAAAzMzMyMjIzMzMzMzMzMzMzMzMzMzMyMjIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMyMjIyMjIyMjIyMjIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0NDQzMzMzMzMxMTEzMzNh02nJAAAAMHRSTlMA/QYL+BD07xvq5RbfJbQg+4hHz66md9nUUjIsysBnxZ9Nu1xBmW5hVzeTkIA8cjnSGOkAAAADZElEQVR42u2cWXIaQRBEi9kYtgHEAAKEYACxCIzr/qczKGQbma4Pf6kz6XeDiSDI7srXJf/HpMxUs3Ii2OQL/WSRCzCdhv6hcRBY4rHekD0JKiP9QrIXUJr6ldpWIJnqHX1BZKL3LAWQtTooI4HjSV3MU0Ej7amLZ7xoLNRJuyNgTGvqpDEVME76F+yQf1c3CdxpeGT8umqvAsaup1cIQr5K1M27gLGpqypFyM+aqhwh3x2rm5eWYNEaKEnIxyt100QL+Wiobuo/BIw3npBXlpB/tY4rJwFjwh/yQ7SQnzbUzSoWLB4g5MddwSKdWyE/Eyyikj7ks0rAOFkhvxMwtlbIjwSMtTWTOAoYm4wl5A9WyBdoId9ps4R8PlDlKB7SBc1MorBC/qeAsaQpHvr6G3S7wAz5s4Cx5ikeMr3AYBfwhPwDFA8h5L+NuFASuyAa0oT8kSbkg13gH8Eu8I8HCHm4mUSwC/wj2AUeEuwC/wh2gX8Eu8A/gl3gH8Eu8JBgF/hHsAv8g6d4sO0CtJlEsAv8I9gFHhLsAv8IdoF/mCFfooX8AxQPcCHferFCHu1LzOJhgXasN4sHuBm3tbugLXAYdgHaUdgsHuCaoAsT15esBY+lUnyIcc+Cu5oYN98aWuGQPxuJKFhcp0MMvyzzKP8mUDxl6qbAOmqZ190l1ndsaxyz+ZFytCVWE9fD6q9YLOd4xdHxtgYcrbs9PcHyIGZNDjNlU+dwhaqEo9jdkVTtI+UwHI8czmk05LCA44IjztMFhynfHXN4AixxfjDVX6yarco4Xlytexx6/LbGIQf0OeJc3jgEmqjkmDKkC47X7TnJU8ROm8PRmDY4rJlNncNjmiQcZhlLnI+Uw75kiXP60gDLGWfZLMCiXM6aHC9dNnWOt0dVwuEA0JQGJC8m+8EB8An+0gDLAcifgwPgEweSfSEsj7vZSwM0B+DEXhpgOQAsa1vSOYcDQD9lAItz/tIAK85ZVuS9spcGLHEeSoPvIF5xOAD0cc5SGoDFOcsuk4rEAWDZ98OygYllJxbJljKWvXExyya/giPOZc/hAIgMKBwAkS5FnF+oGByAKzuCOP+ggncAPumix7n5r9U4CCZ7aAfglhI5zm+J57C383+I+ol+kPSxhu335OdiMCjOHv6sfgHp62lZ/VSJjAAAAABJRU5ErkJggg==');
  background-size: contain;
}

.icon-refresh:before {
  content: ' ';
  display: block;
  width: 16px;
  height: 16px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-image: url('data:image/png;base64,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');
  background-size: contain;
}
</style>
