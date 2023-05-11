<template>
  <HakuDialog
    body-class="background-dialog"
    :visible="true"
    :drag="true"
    :title="state.currentBackgroundTypeText"
  >
    <!-- 背景类型选择 -->
    <div class="background-dialog-type-panel">
      <ul
        class="background-type-tabs"
        :style="{
          '--background-type-count': state.backgroundTypeList.length,
          '--background-type-index': state.currentBackgroundTypeIndex
        }"
      >
        <li
          class="background-type-tab"
          :class="{ active: state.currentBackgroundType === item.name }"
          :title="item.title"
          v-for="item in state.backgroundTypeList"
          @click="setBackgroundType(item.name)"
          :style="{
            backgroundImage: `url(${item.url})`
          }"
        ></li>
      </ul>
    </div>
    <!-- 选择器内容区域 -->
    <div class="background-dialog-content">
      <!-- 纯色 -->
      <TypeColorPicker v-if="state.currentBackgroundType === 'color'" />
      <!-- 线性渐变 -->
      <!-- 径向渐变 -->
    </div>
  </HakuDialog>
</template>

<script lang="ts" setup>
import message from '@/common/message';
import HakuDialog from '@/components/common/HakuDialog.vue';
import { reactive } from 'vue';
import TypeColorPicker from './type-color/TypeColorPicker.vue';

const defaultImage = 'data:image/png;base64,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';

const state = reactive({
  /** 当前背景类型 */
  currentBackgroundType: 'color',
  /** 当前背景类型索引 */
  currentBackgroundTypeIndex: 0,
  /** 当前背景类型文本 */
  currentBackgroundTypeText: '纯色',
  /** 背景类型列表 */
  backgroundTypeList: [
    { name: 'color', title: '纯色', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAACLSURBVFiF7dexDcMwDETRT6fOAhkjWUNzODN5Dy+QnlogAygDeAC6kArDcM00d4AgQc09ljR6HsBz3BlpwA+oBrzG+UdWgALM7h5ZcfcAZqDYeBARS+boZvYGmDJLryKAAAIIIIAAAggggAACCDDRF0VqrWmlh65m9I24pLWfLDdgO3zck4ob8AG+OxCjg8ww/O8tAAAAAElFTkSuQmCC' },
    { name: 'linear-gradient', title: '线性渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAD1SURBVFiF7ZQhjsMwEEX/KCbBJs41AspKcqVdkj3AhvRA4WU+RhRgFEWWpSi2Ey8y6JaPQfORNeQ9/RmZAGCapl/nXO+cA0eISFdV9Wzb9pu01o8Y4xcL+V+aphnEvu/38zyhlIJSigVsjIExBsuy9MJ7fwMAKSVCCCwCUkrM84x1XSEy1HvPAs/J3PICMcaXAVcy92qgfAPHcbwMuJK55Ru4bqC4wLWC4g3kB3cDbwKfewPFBa4VXA0Ub6D4R1R8BdnGWou6rlng27Yhxggi0iKlNIQQ+hACrLUsAjlE9CQA6LrukVK6p5RuHGAhBIQQwziOP39YyzDUDdMzzwAAAABJRU5ErkJggg==' },
    { name: 'radial-gradient', title: '径向渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAASASURBVFiFxVdbbttGFD3DeZGUjNj/ho0EySrU6Me1Ass7aLqOJM5HUfQjSbOI7kIy/EIBJ15FbHgNsmWRM8Mh++FcdjSSG7stkAEuaIPUnHPPfcwdhges3d3d38qy1EqpHmMMAHpfX501TQPGWD2dTj+cnp6O77snu89HW1tbv2utX3HOwTlHkiRIkgRfSaBpGtR1jbqu4b2H9x4APo3H4/5/IjAYDN5JKfeEEJBSQikFKSWEEEiSBEIIAEBVVajrGlVVwTkHay2cc/T/+8PDw7cPJrCzs/NZStlTSkFrjSzLoLVuwe9SoKoqVFWF2WyGoiiIzNn+/v4P9yLw4sWLHznnR0opZFmGPM+RZRmklJBSIgxDTIDkd87BOYebmxvc3NzAWgtrLbz32wcHB8chnogJcM6PyONHjx6BFCACQoh/JEBhcM6Bc440TTGZTMAYgzHmKHaax7JrrTfyPMfq6irSNF0wrXX7VEq1eRGqExJkjEFKCe896rrG48ePt8/Pz/9YIDAYDN5prX/SWmNtba0FzLJsKYmYgBBiTp1QIQAQQlCINjY3N/XFxcXJXAiklHtKKXQ6nVb2GDQE45zPhSCUf9n7uq6R5zmcc/De7wF42yowHA5PpZSb3W4XKysrc14vUyBWYVluhOBkANryXF9fzy8vL49JgedSSuR53saT5CWgEDjsBQDmesAyZUgdKSWyLIMxBlrrVwBe836/P8yy7GWe5+h0Oku9DZWgZ6hA6D0t8pr6Q2hUJc+ePeOi2+2+4ZzPyUgJFaoRq6CUAue3Oey9h7W2JRDmRJygtC/nHLPZTIumaRJqq0mStGUU/yAkEnZF4LYVExkKR+xQWJ6EpZTqCcZYWzaxhXVNXoRqKKUAANbaVomwCuLDKzbGGASAHmMMQog2e2OLCRGRPM/bmJMKcR9YZoQFoPd31nynJXA7TPSqqpqr2dDis76qqlZ24DYEVVW17+n7u/YjLABn4q5SCQEJlIAp4aqqap/GmJZISCYkFFvTNBDW2jOtdY+GihAwPt3CUvPeL5QhkaDvwz1CMoTFGKtFmqaGsjf8QQwcdjhqJiEBUqcsy6VEYoe895hOpx/4ly9f/nz69OmvSZLM1e5dp9qys5+8JyMS8d9k0+kU1locHx//LADAGPNRSvmqKAqkaTrn9bLeTp0sPAtIxZgMTUOkxmw2g3MOAD4BwXSyu7vb0BTU7XaRZdncSfiQ45hIlGWJsixRFAWKosDV1RWur69RFAVGoxGjMgQAOOfec873ZrMZlFILI1fY2+9SJlQhJEFK0HzonHtPuO1EdHFxcfLkyZPtpmk26rqGlLLdPOwHYZWESRpLH8d/MpmgLEtYa88ODg5eEu7CVDwcDpv/ayglzyeTCYqigDEG4/F4DnNhKvbebxtjjqhjdToddDqdfzWWF0Uxdz/w3m/HePe6mND9gE7Eb11MjDGtxw++mITru17NwjUcDk8BPH/I5dQY8/Hk5OT1t/a+FwFa/X5/2O123zRNkyy7nltrz9I0NaPR6Jf77vkXZm13nfYcEWgAAAAASUVORK5CYII=' },
    { name: 'conic-gradient', title: '旋转渐变', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAUdSURBVFiFpVc9bBNJGH3fzNjrYC8h4sdIh8RPT8o9kRSglPwIJEdQpkmBQmjINZyoU+EKyqOkPClNTiK0KBDXaVA6IohEkIK9xni983PFeZbZ8SYY3UifvB7Pznvfm2/ejAm/0G7evLnabrfDcrkcaa2hlIqazSYAtAAgDEO1vb3dnJ+f/3vcOWmcQXNzc8+EEMvGGGitYT+11mg2m7nvAKC1xuTk5NvLly/P/C8Ct27deiqlXLEAnHNwzsEYg9YajDGsra2h3W5Da41Op5OFMQbGGAghmrOzs3/8MoHbt29vSSkjYww456hUKhnwUH5orbG2tjbSp7XG3t4ePn36ZIm2rl279nsRjvA7Go3G9TRN140xKJfLCIIAQoicxABA9IO7zdZt9XodSins7e1BKRW9fv3acM5vzM3N/eOOYz4BrfU6EaFUKmFychJBEICIRsJvloRbD/V6HdPT0zh27BiMMZBSrvvv5QjMz89vERGCIMCJEyfAGDsS3CfiknAL9tKlS6hWq9Ba49WrV1uFBO7du/cUQEREOXDG2JFEDgP11bh48SKq1SqUUtHGxsbTEQLGmBUiQrVazUBd4CISP1sCG7bv9OnTMMZgMBis5AgsLCxsEhFqtRrCMMwRKIrDwH1gPyYmJjAxMQFjDF6+fPksIzAYDK4wxgrB3b1/GJFxwG2cOXMGxhjUarVlABB37txp2KpnjOWkJKLc1rNNa10IrpTKwpffblOrQrfbxebm5qo4efLkSpIkmdG4e9qSsAbkgxJR9myBpZQj6++GJRHHMXZ2dkKRpilnjCEIAjDGcmtqt5oxJleEAKCUyghLKZGmKdI0HcneT8gSMMbg+PHjkbCT2HV2CwtAThVbE3bcYDCAlBJJkiBJkix7q4qfjL9kACCIKCIiVCqVHLBf5f4E5XIZABDHMeI4zjL3sy2a0yqglIqEldTN3m2+89kQQuDChQvY3t5GGIaZMnb8UY4J4IcCjLEWgEhKmWXlT+KaEWMMQggEQYAwDNHpdAAAQRBkW9aOdd91yfR6PXu8t4Q/uQ/q/845R6lUyk5JpRSSJPkvGyEghCi0bzchu1RKKYjBYNAKgiBK0xSVSqXQ813zEUKgVCpBCJH5hJQyt4Nc4yqy7ziO7a1JiXq9Hnc6HaRpWviC74pCiNx620yUUjmf4JxnPuLHt2/foLXGzs5OkwBgaWnJAMCpU6cyFfzT0LVlq4IbVn6X4GEqvH//HkSEhYUFYgCQJMlzy+xnB1HROeAfRq4Zuc9aa3z+/Blaa9RqtbfA8DB68eLFQ8ZY5mbjgPtXMv+27J8FWmvs7+/jy5cvAIBGozGTERhWcJOI0O12C+UvAvdVKAJ1+/b39+3+b1pcbh/evXu3MTMzc10p9VuapqjVakcSGUcZd+/v7u5CSgkiai0uLt7NfvMHP3r0yFhrPnv2bCGQLTL3ruB/uvHx40f0+30QEe7fv5/DHPFfzvkNIkKaptjd3UWn0yncy0W3Ir8oe70ePnz4gF6vZ7fmjRF1RvQatsePH29prSPGGKampjA1NXWo9H7WSZLg69evrkO2lpaWCv+Y8KJOAHjz5s1fV69eDYloJkkStNttJEmSGY5SCqVSCUSEfr8PpRS63S4ODg5wcHBg1xtCiOaDBw/uHoYz1p/T1dXVze/fv1/xb8du8fkF2+v1nj958uThz+Yei4Bty8vLjfPnz6/0+30+rIFouASt4SnXOnfuXLy4uPjnuHP+C33P74mp5QIpAAAAAElFTkSuQmCC' },
    { name: 'image', title: '图片', url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAADLSURBVFiF7ZfBDcIwDEX/rxioVRfoAp0BevE63H2hzNAO0AUi2MgcIAipaXuBlIO/5FP8858sRYoJAKpaAjibWYMMIjkBuIpIT1U9mdklR3ACpDoAOALAOI4YhmHWZGZbl6yep/whBIQQAOBcxLGnwn+luq4jXFNkS12QA/wPgJkli+RqLfm2/DOAveQADuAAb4Bvv/Mt/wxgLzmAAziA/wccYH+A16IYV6UsatsWwHNJpaqWZnbLlv4hkl0hIneSXZxEpuCJZCUi/QOhULdMV8B8TgAAAABJRU5ErkJggg==' },
  ]
});

/** 修改背景类型 */
const setBackgroundType = (name: string) => {
  const _typeIndex = state.backgroundTypeList.findIndex(i => i.name === name);
  if (_typeIndex >= 0) {
    state.currentBackgroundType = name;
    state.currentBackgroundTypeIndex = _typeIndex;
    state.currentBackgroundTypeText = state.backgroundTypeList[_typeIndex].title;
  } else {
    message.toast('背景类型不存在', 'error');
    throw new Error('背景类型不存在');
  }
}
</script>

<style lang="less" scoped>

:deep(.background-dialog) {
  width: 240px;
}
.background-dialog-type-panel {
  margin-bottom: 12px;
  
  > .background-type-tabs {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0px;
    background-color: #F5F5F5;
    border-radius: 6px;

    &:before {
      content: '';
      position: absolute;
      display: block;
      left: calc(var(--background-type-index, 0) * 100% / var(--background-type-count, 1) + 1%);
      top: 8%;
      width: calc(100% / var(--background-type-count, 1) - 2%);
      height: 84%;
      background-color: white;
      border: 1px solid #CCC;
      box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.1);
      border-radius: 4px;
      transition: 0.15s left;
    }

    > .background-type-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30px;
      text-align: center;
      z-index: 1;
      transition: 0.15s color;
      background-position: center center;
      background-size: 16px 16px;
      background-repeat: no-repeat;

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      &.active {
        cursor: default;
        color: white;
        // background-color: rgba(51, 122, 183, 0.2);
      }
    }
  }
}
</style>