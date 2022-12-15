<template>
  <q-basic
    class="component-anx-stepper"
    v-bind.prop="getQBasicProps({ ...props, ...$attrs })"
    :componentLabel="''"
    :componentDescription="''"
    :className="$attrs.className"
  >
    <div class="anx-practise-score">
      <div class="anx-practise-score-wrapper">
        <canvas ref="refCanvas" class="canvas-score" />
        <div class="anx-practise-score-wrapper_des">
          <div class="anx-practise-score-wrapper_des-score">
            <span class="score" :score="props.score">{{ needAnima ? animaStep : realStep }}</span>
            <span class="unit" v-if="props.unit">{{ props.unit }}</span>
          </div>
          <!-- :style="{ visibility: label ? 'visible' : 'hidden' }" -->
          <span class="anx-practise-score-wrapper_des-label">{{ getCurrentStep.label }}</span>
        </div>
      </div>
      <div v-if="showImage && getCurrentStep.image" class="anx-practise-score-image">
        <img :src="storageService.getFileInfo(getCurrentStep.image)?.src" />
      </div>
    </div>
  </q-basic>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>
<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue';
import { service as storageService } from '@/modules/storage-module';
import { getQBasicProps } from '@/tools/common';

const refCanvas = ref<HTMLCanvasElement>();

/** 仪表盘阶段 */
interface PractiseStep {
  /** 标签 */
  label: string;
  /** 颜色 */
  color: string;
  /** 图片 */
  image: string;
}

const props = defineProps({
  /** 颜色区块 */
  steps: {
    type: Array as PropType<PractiseStep[]>,
    default: () => [],
  },
  /** 显示图片 */
  showImage: {
    type: Boolean,
    default: false,
  },
  /** 单位 */
  unit: {
    type: String,
    default: '分',
  },
  /** 最大值 */
  max: {
    type: Number,
    default: 100,
  },
  /** 最小值 */
  min: {
    type: Number,
    default: 0,
  },
  /** 分数 */
  score: {
    type: Number,
    default: 0,
  },
  /** 标签 */
  label: {
    type: String,
    default: '',
  },
  /** 圆环宽度 */
  lineWidth: {
    type: Number,
    default: 6,
  },
  /** 每段间隔 */
  spaceDeg: {
    type: Number,
    default: 8,
  },
  /** 指示器大小 */
  thumbSize: {
    type: Number,
    default: 15,
  },
  /** 使用动画 */
  needAnima: {
    type: Boolean,
    default: true,
  },
  /** 是否分段显示 */
  segment: {
    type: Boolean,
    default: false,
  },
});

const realStep = computed(() => {
  if (props.score < props.min) {
    return props.min;
  } else if (props.score > props.max) {
    return props.max;
  } else {
    return props.score;
  }
});

const state = reactive({
  /** 当前索引 */
  stepIndex: 0,
  /** 目标角度 */
  targetAngle: 0,
});

const animaStep = ref<number>();

const realSpaceDeg = () => {
  return props.segment ? props.spaceDeg : 0;
};

let tempStep = 0;
let allowAnima = true;

watch(props, (value) => {
  allowAnima = false;
  setTimeout(() => {
    allowAnima = true;
    onDraw(tempStep);
  }, 30);
});

const onDraw = (startStep: number) => {
  if (refCanvas.value == undefined) return;
  const context: CanvasRenderingContext2D | null = refCanvas.value.getContext('2d');
  if (context == null) return;
  const canvas = refCanvas.value;
  const ratio = window.devicePixelRatio;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = (canvas.offsetWidth / 2) * ratio;

  const rate = canvas.width / 200;
  const lineWidth = props.lineWidth * rate;
  const thumbSize = props.thumbSize * rate;

  const allNum = props.steps.length;
  const padding = thumbSize;
  const scoreFontSize = 12 * rate;
  const circleX = canvas.width / 2; //中心x坐标
  const radius = circleX - padding - lineWidth - scoreFontSize; //圆环半径
  const circleY = circleX - padding / 2 - lineWidth / 2 - scoreFontSize; //中心y坐标
  // 计算每段圆弧的角度
  const perAngle = (180 - (allNum - 1) * props.spaceDeg) / allNum;
  drawFrame(
    context,
    canvas,
    circleX,
    circleY,
    radius,
    perAngle,
    lineWidth,
    rate,
    scoreFontSize,
    props.needAnima ? startStep : realStep.value,
  );
};

const drawFrame = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  circleX: number,
  circleY: number,
  radius: number,
  perAngle: number,
  lineWidth: number,
  rate: number,
  scoreFontSize: number,
  step: number,
) => {
  requestAnimationFrame(() => {
    state.stepIndex = ~~(state.targetAngle / perAngle);
    animaStep.value = step;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (props.segment) {
      props.steps.forEach((step, index) => {
        const startAngle = (perAngle + props.spaceDeg) * index + 180;
        sector(ctx, circleX, circleY, radius, startAngle, startAngle + perAngle, step.color, lineWidth);
      });
    } else {
      drawGradientSector(ctx, circleX, circleY, radius, 180, 360, perAngle, lineWidth);
    }
    drawGradientCircle(ctx, circleX, circleY, radius - lineWidth - 10 * rate, rate);
    drawThumb(ctx, step, perAngle, circleX, circleY, radius, rate);

    drawScore(ctx, props.min.toString(), scoreFontSize, circleX - radius, circleY + scoreFontSize + lineWidth);
    drawScore(ctx, props.max.toString(), scoreFontSize, circleX + radius, circleY + scoreFontSize + lineWidth);
    if (realStep.value > tempStep) {
      step++;
      if (allowAnima) {
        if (step <= realStep.value) {
          drawFrame(ctx, canvas, circleX, circleY, radius, perAngle, lineWidth, rate, scoreFontSize, step);
        } else {
          tempStep = realStep.value;
        }
      } else {
        tempStep = animaStep.value;
      }
    } else {
      --step;
      if (allowAnima) {
        if (step >= realStep.value) {
          drawFrame(ctx, canvas, circleX, circleY, radius, perAngle, lineWidth, rate, scoreFontSize, step);
        } else {
          tempStep = realStep.value;
        }
      } else {
        tempStep = animaStep.value;
      }
    }
  });
};

/** 画渐变弧线 */
const drawGradientSector = (
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  perAngle: number,
  lineWidth: number,
) => {
  const ctx = context;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  const linGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  props.steps.forEach((step, i) => {
    linGrad.addColorStop(tansferRatio(i, props.steps.length, r), step.color);
  });
  ctx.strokeStyle = linGrad;
  // 圆弧两端的样式
  ctx.lineCap = 'round';
  // 圆弧
  ctx.arc(cx, cy, r, (startAngle / 180) * Math.PI, (endAngle / 180) * Math.PI, false);
  ctx.stroke();
};

/** 渐变位置的比率 */
const tansferRatio = (index: number, length: number, r: number) => {
  const perAngle = 180 / (length - 1);
  const endPos = r * Math.cos(((180 + perAngle * index) / 180) * Math.PI);
  return (r + endPos) / (2 * r);
};

// 画弧线
const sector = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  color: string,
  lineWidth: number,
) => {
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  //圆弧两端的样式
  ctx.lineCap = 'round';
  //圆弧
  ctx.arc(cx, cy, r, (startAngle / 180) * Math.PI, (endAngle / 180) * Math.PI, false);
  ctx.stroke();
};

const drawGradientCircle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rate: number) => {
  ctx.beginPath();
  const linGrad = ctx.createLinearGradient(cx, cy - r, cx, cy);
  linGrad.addColorStop(0.0, '#F2F2F2');
  linGrad.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.strokeStyle = linGrad;
  ctx.lineWidth = 2 * rate;
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI, false);
  ctx.stroke();
};

/** 绘制进度指示器 */
const drawThumb = (
  context: CanvasRenderingContext2D,
  step: number,
  perAngle: number,
  cx: number,
  cy: number,
  r: number,
  rate: number,
) => {
  const ctx = context;
  const progress = (step - props.min) / (props.max - props.min);
  state.targetAngle = (180 - props.spaceDeg * (props.steps.length - 1)) * progress;
  state.stepIndex = Math.floor(state.targetAngle / perAngle);
  if (state.targetAngle - perAngle * state.stepIndex === 0 && state.stepIndex > 0) {
    state.stepIndex -= 1;
  }
  state.targetAngle += state.stepIndex * props.spaceDeg + 180;
  const thumnR = r;
  const pointX = thumnR * Math.cos((state.targetAngle / 180) * Math.PI);
  const pointY = thumnR * Math.sin((state.targetAngle / 180) * Math.PI);

  const lineWidth = props.thumbSize < props.lineWidth ? 0 : (props.thumbSize - props.lineWidth) * rate;
  ctx.beginPath();
  ctx.strokeStyle = getCurrentStep.value.color;
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = lineWidth;
  ctx.arc(pointX + cx, pointY + cy, (props.lineWidth / 2) * rate, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
};

/** 绘制两边的分数 */
const drawScore = (context: CanvasRenderingContext2D, text: string, fontSize: number, x: number, y: number) => {
  const ctx = context;
  ctx.fillStyle = '#A2ADC1';
  ctx.font = `${fontSize}px serif`;
  ctx.fillText(text, x - ctx.measureText(text).width / 2, y);
};

/** 获取显示的标签 */
const getCurrentStep = computed(() => {
  if (state.stepIndex < 0 || state.stepIndex >= props.steps.length) return { color: '#FFFFFF', image: '', label: '——' };
  return props.steps[state.stepIndex];
});

const resize = () => {
  onDraw(tempStep);
};

onMounted(() => {
  animaStep.value = props.min;
  onDraw(props.min);

  // setTimeout(() => {
  //   onDraw(props.min);
  // }, 16);
});

defineExpose({
  resize,
});
</script>

<style lang="less" scoped>
@import '/src/assets/less/app-variable.less';

.anx-practise-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  // background-color: #fff;

  > .anx-practise-score-image {
    display: block;
    margin: auto;

    > img {
      text-align: center;
      height: 50px;
    }
  }

  > .anx-practise-score-wrapper {
    width: var(--anx-practise-score-canvas-size);
    height: calc(var(--anx-practise-score-canvas-size) / 2);
    position: relative;
    .canvas-score {
      width: 100%;
      height: 100%;
    }
    > .anx-practise-score-wrapper_des {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .anx-practise-score-wrapper_des-score {
        font-size: var(--anx-practise-score-label-font-size);
        color: var(--anx-text-des-color);

        > .score {
          font-size: var(--anx-practise-score-font-size);
          color: var(--anx-text-title-color);
        }
      }

      .anx-practise-score-wrapper_des-label {
        font-size: var(--anx-practise-score-label-font-size);
        font-weight: 500;
        color: #5b6b8a;
      }
    }
  }
}
</style>
