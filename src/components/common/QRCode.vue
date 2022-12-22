<template>
  <div>
    <div v-if="state.imageUrl" :class="myclass">
      <img :src="state.imageUrl" :class="imgclass" crossorigin="anonymous" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted, reactive, watch } from 'vue';
import QRCodeStyling from 'qrcode-vue3/src/core/QRCodeStyling';
import { Options } from 'qrcode-vue3/src/core/QROptions';

const props = defineProps({
  width: {
    type: Number,
    default: 300,
  },
  imgclass: {
    type: String,
    default: '',
  },
  myclass: {
    type: String,
    default: '',
  },
  margin: {
    type: Number,
    default: 20,
  },
  height: {
    type: Number,
    default: 300,
  },
  value: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  qrOptions: {
    type: Object,
    default: () => ({
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'L',
    }),
  },
  imageOptions: {
    type: Object as PropType<Options['imageOptions']>,
    default: () => ({ hideBackgroundDots: true, imageSize: 0.4, margin: 50 }),
  },
  dotsOptions: {
    type: Object as PropType<Options['dotsOptions']>,
    default: () => ({
      type: 'rounded',
      color: '#000000',
      gradient: {
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#000000' },
          { offset: 1, color: '#000000' },
        ],
      },
    }),
  },
  backgroundOptions: {
    type: Object,
    default: () => ({ color: '#ffffff' }),
  },
  cornersSquareOptions: {
    type: Object,
    default: () => ({ type: 'extra-rounded', color: '#000000' }),
  },
  cornersDotOptions: {
    type: Object,
    default: () => ({ type: undefined, color: '#000000' }),
  },
  fileExt: {
    type: String,
    default: 'png',
  },
  downloadOptions: {
    type: Object,
    default: () => ({ name: 'vqr', extension: 'png' }),
  },
});

const state = reactive({
  imageUrl: '' as string,
  qrCode: new QRCodeStyling({
    data: props.value,
    width: props.width,
    height: props.height,
    qrOptions: props.qrOptions,
    imageOptions: {
      ...props.imageOptions,
      margin: props.margin,
    },
    // @ts-ignore
    margin: props.margin,
    dotsOptions: props.dotsOptions,
    backgroundOptions: props.backgroundOptions,
    image: props.image,
    cornersSquareOptions: props.cornersSquareOptions,
    cornersDotOptions: props.cornersDotOptions,
  }),
});

watch(() => props.value, async () => {
  state.qrCode = new QRCodeStyling({
    data: props.value,
    width: props.width,
    height: props.height,
    qrOptions: props.qrOptions,
    imageOptions: {
      ...props.imageOptions,
      margin: props.margin,
    },
    // @ts-ignore
    margin: props.margin,
    dotsOptions: props.dotsOptions,
    backgroundOptions: props.backgroundOptions,
    image: props.image,
    cornersSquareOptions: props.cornersSquareOptions,
    cornersDotOptions: props.cornersDotOptions,
  });

  state.imageUrl = await state.qrCode.getImageUrl(props.fileExt);
})

onMounted(async () => {
  state.imageUrl = await state.qrCode.getImageUrl(props.fileExt);
});
</script>
