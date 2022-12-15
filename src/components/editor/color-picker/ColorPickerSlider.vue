<template>
  <div class="color-picker-slider">
    <div ref="slider" class="color-picker-slider-content" :style="sliderStyle" @mousedown="startDrag">
      <div :style="{ left: cursorLeft + 'px' }" class="color-picker-slider-bar"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, toRefs } from 'vue';

export default defineComponent({
  name: 'ColorPickerSlider',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    sliderStyle: {
      type: Object as PropType<Record<string, any>>,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  computed: {
    /** 游标离左侧距离 */
    cursorLeft(): number {
      return ((this.slider.offsetWidth || 0) * this.value) / this.max - 8;
    },
  },
  unmounted() {
    document.body.removeEventListener('mousemove', this.drag);
    document.body.removeEventListener('mouseup', this.endDrag);
  },
  mounted() {
    this.init();
  },
  methods: {
    startDrag(e) {
      this.isStartDrag = true;
      this.drag(e);
    },
    drag(e) {
      if (this.isStartDrag) {
        let rect = this.slider.getBoundingClientRect();
        let _cursorLeft = Math.min(Math.max(0, e.pageX - rect.left), rect.width);
        let _value = Math.round((_cursorLeft / this.slider.offsetWidth) * this.max);
        this.$emit('input', _value);
        this.$emit('update:value', _value);
      }
    },
    endDrag() {
      this.isStartDrag = false;
    },
    /** 初始化 */
    init() {
      document.body.addEventListener('mousemove', this.drag);
      document.body.addEventListener('mouseup', this.endDrag);
    },
  },
  setup() {
    /** 控件画布 */
    const slider = ref({} as any);

    const state = reactive({
      /** 是否开始拖拽 */
      isStartDrag: false,
    });

    return {
      ...toRefs(state),
      /** 滑块元素 */
      slider,
    };
  },
});
</script>

<style lang="less" scoped>
.color-picker-slider {
  user-select: none;
  position: relative;
  display: block;
  width: 100%;
  height: 12px;
  border-radius: 3px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);

  &:before {
    content: '';
  }

  > .color-picker-slider-content {
    user-select: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-radius: 3px;

    > .color-picker-slider-bar {
      user-select: none;
      position: absolute;
      cursor: default;
      top: -2px;
      left: -7px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #f8f8f8;
      box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
