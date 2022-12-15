<template>
  <div>
    <div v-if="imageUrl" :class="myclass">
      <img :src="imageUrl" :class="imgclass" crossorigin="anonymous" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import QRCodeStyling from 'qrcode-vue3/src/core/QRCodeStyling';
import { Options } from 'qrcode-vue3/src/core/QROptions';

export default defineComponent({
  props: {
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
  },
  data() {
    return {
      imageUrl: '' as string,
      qrCode: new QRCodeStyling({
        data: this.value,
        width: this.width,
        height: this.height,
        qrOptions: this.qrOptions,
        imageOptions: {
          ...this.imageOptions,
          margin: this.margin,
        },
        // @ts-ignore
        margin: this.margin,
        dotsOptions: this.dotsOptions,
        backgroundOptions: this.backgroundOptions,
        image: this.image,
        cornersSquareOptions: this.cornersSquareOptions,
        cornersDotOptions: this.cornersDotOptions,
      }),
    };
  },
  watch: {
    async value() {
      this.qrCode = new QRCodeStyling({
        data: this.value,
        width: this.width,
        height: this.height,
        qrOptions: this.qrOptions,
        imageOptions: {
          ...this.imageOptions,
          margin: this.margin,
        },
        // @ts-ignore
        margin: this.margin,
        dotsOptions: this.dotsOptions,
        backgroundOptions: this.backgroundOptions,
        image: this.image,
        cornersSquareOptions: this.cornersSquareOptions,
        cornersDotOptions: this.cornersDotOptions,
      });

      this.imageUrl = await this.qrCode.getImageUrl(this.fileExt);
    },
  },
  async mounted() {
    this.imageUrl = await this.qrCode.getImageUrl(this.fileExt);
  },
});
</script>
