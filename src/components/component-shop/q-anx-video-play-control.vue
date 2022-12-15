<template>
  <div class="anx-play-control">
    <i
      v-if="showFastforward"
      class="anx-play-control_icon-other anx-play-control_icon-backForward"
      @click="emit('backForward')"
    />
    <i
      v-if="showPreAndNextButton"
      class="anx-play-control_icon-other anx-play-control_icon-prev"
      :style="{ opacity: prevDisabled ? 0.4 : '' }"
      @click="!prevDisabled && emit('prev')"
    />
    <div :class="['anx-button']" @click="emit('togglePlay')">
      <i v-if="playStatus === 'play'" class="anx-play-control_icon anx-play-control_icon-play" />
      <i v-else class="anx-play-control_icon anx-play-control_icon-pause" />
    </div>
    <i
      v-if="showPreAndNextButton"
      class="anx-play-control_icon-other anx-play-control_icon-next"
      :style="{ opacity: nextDisabled ? 0.4 : '' }"
      @click="!nextDisabled && emit('next')"
    />
    <i
      v-if="showFastforward"
      class="anx-play-control_icon-other anx-play-control_icon-fastForward"
      @click="emit('fastForward')"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';

const props = defineProps({
  /** 播放状态 */
  playStatus: {
    type: String as PropType<'play' | 'pause'>,
    default: 'play',
  },
  /** 上一个不可用 */
  prevDisabled: {
    type: Boolean,
    default: false,
  },
  /** 下一个不可用 */
  nextDisabled: {
    type: Boolean,
    default: false,
  },
  /** 显示下一个和下一个按钮 */
  showPreAndNextButton: {
    type: Boolean,
    default: true,
  },
  /** 显示快进 */
  showFastforward: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: 'togglePlay'): void;
  (event: 'prev'): void;
  (event: 'next'): void;
  (event: 'fastForward'): void;
  (event: 'backForward'): void;
}>();
</script>

<style lang="less" scoped>
@import '/src/assets/less/app-variable.less';

.anx-play-control {
  display: flex;
  align-items: center;
  justify-content: center;

  .anx-button {
    width: var(--anx-play-control-button-size);
    height: var(--anx-play-control-button-size);
    background: var(--anx-button-primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:active {
      opacity: 0.7;
    }
  }

  .anx-play-control_icon {
    width: var(--anx-play-control-button-icon-size);
    height: var(--anx-play-control-button-icon-size);
  }

  .anx-play-control_icon-other {
    width: var(--anx-play-control-other-button-size);
    height: var(--anx-play-control-other-button-size);
    cursor: pointer;

    &:active {
      opacity: 0.7;
    }
  }

  .anx-play-control_icon-other + .anx-play-control_icon-other,
  .anx-play-control_icon-other + .anx-button,
  .anx-button + .anx-play-control_icon-other {
    margin-left: var(--anx-play-control-space);
  }

  .anx-play-control_icon-play {
    .icon-full-background-image();
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAACfklEQVRoQ+2auY4UMRRFz0WCkIjhOyAjgZCZBIk/ICBg3/6ECCQixL6JXQKJGCT+gABBxr4EJBCA0ZXKaCSm6bKratq2qKy733P59PXy/PxExhNC2AUcAnYCS8Bn4ClwTtKTjCYnc1FKyyGEjcBZYP8//B4CByS9SWl7KttUwPPAvh6d+QqclHShh+2kJr0BQwgrwKPE3jzo1Hyb6DeaeQrgfWBPxpu/dGpezPAd7JIC+BHYMuCN/oM8N98NaCPZNQXwF9DbfkZPrOYJSZeSe5rp0LvDIYSQ+Y613O4BB9dDzUUBGtp7p9W8POIf91dTiwSMnbnbqfl+CtASAKOaxyRdHRuyFMDJ1CwNMKp5VNK1MdQsETBy3enm5ochoCUDmusTYDWv50KWDhi5bvt4JilZzVoAo5pHJN1IUbMmwMh1CzgsybHx3KdGQEMZzmrenEdYK2DkMqBBZ6pZO6BBvfAY0kO3yFh03ijr+7sXH89NB/F/nhYUXM3zGtgt6WX8sjVAc70Atkn64Q8tAprrlKTTLQM+l7SjZcBvkjb/B1y9PI2cdOq79OfaNT9Em15kvE1sl/S9xTn4ClhudaNvNlTzScIxaJPBdrPHJavmZNTc9EWNsaiHos9/vRJQNQFmpRBrAWw2bWjVfCmTncYvWUGn7p3sHXStViKgcyqjXaWVBjj6ZWgpgFbtuKQrueejWX4lAFo1z7VJyksWCeiSEqvWZBFCkWUkP4ENA+dI0YVA3o+2DgB0KZeLf9a1MC9lDnrj3ZsBWE0x3jLwOBGwnnJKg4UQ2i2I7QA3AWeaLWmOw3ONonSXMD/ritJTh3HiqE8z773IpDVbjnXzgL8Bl/tASN5kR+EAAAAASUVORK5CYII=');
  }

  .anx-play-control_icon-pause {
    .icon-full-background-image();
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAABMElEQVRoQ+2awQkCQRAEexJQTMIYDMAINBojMBqNwACMwSREExhRFA5R3BEK7o6+1z2W2umu/e2GRv7FyPPJAYdu2AZtsOcN+Ih2BWXmXNJW0lLS5E3eVdJB0iYiTv+IJfjNBp+bHyXNfgx/lrSohqT4lYA7SatGM/uIWDeufSzLTIRfCXj5cCy/ZbhGxLQYEOFXAmZl4IhoZj8NIvzmITITGeBVGsV3QLphmm+DdMM03wbphmm+DdIN03wbpBum+TZIN0zzbZBumObbIN0wzbdBumGab4N0wzTfBumGab4N0g3TfBukG6b5Nkg3TPNtkG6Y5lcMIheUnYAIvxIQuWLuBET4lYD3FxbjfYRwb5p45vEySPGbDXYHGdK/Aw7J1qdZbdAGe96Aj2jPBf0c7wZFwFxIcQWKIgAAAABJRU5ErkJggg==');
  }

  .anx-play-control_icon-next {
    .icon-full-background-image();
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAACZElEQVRYR+2Zz2vUQBTHv28avYiC/4teBb2JRvwDTDyUupRSWfUiTS2BNtubN72pbbJswYJ1O0tLERXvin+EFn/Xn4eyuvsk2W7dtd042axsBjLH5L15n/kyzMx7j6DZIM14sQf43MWZM9xoXAHhOIARAC/BuC3L3tL/XJxpT58FN68CdKwVh5+DxE3pz9U643YBm5YzD+B6D7BHwsBo9Z73atDgpu14YEztOy+hJH3Paf/bBTbtmdPgxlocDANfCXRNBnN3BgXdUpZl7HxEZlvpP8CW8xjAKSUQxjoLjNV8b1PJPsbItKaeAHQyfh5+KoNSxNYJvAXgaAKAz4JFsVqe9RP47DE1LecbgMP/mOO7DLwjfwNzP4GJaPWXMAprC+7bfvxNy1GKKwMvErdTYSXHHlCfQOKy9GcrSaGHBbzDSQ8MGOMrgfteFXzIwBHmBwImVgNvWQU6C8AtTqL7+GlMyCX3Yxx4doBblO8EYbzqeyu9oLMGvMPJlfr2wcmNZTc8OrtGRoEBBt4AKNQCr+tWyyzwrqyExRFxoPhwwf0Sfss+cHT402um5iXpl9a1AG5vbAB3AYyqHH+DvulUYqayyYFTyafgnCusIFIqk1zhVPIpOOcKK4iUyiRXuA/5whxSm6t5E8RjWjx+iLAodHheavaAp0p929AiRdIoCdUozdepkKJJqYqBLSIxqUsxUNaZCxvlUlh3SDzSZM0/ABxKEHHIBW3beQbGCSXgTLQMLkyfB3HPol24kEw1ZaKykX1jHtzUo+3V3gpRGwpcBIeNRRIAXhD4lmqBWmlL7WOk2lj8DdvxoDxuY8lmAAAAAElFTkSuQmCC');
  }

  .anx-play-control_icon-prev {
    .anx-play-control_icon-next();
    transform: rotate(180deg);
  }

  .anx-play-control_icon-fastForward {
    .icon-full-background-image();
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAACXElEQVRYR+2YT2sTQRjGn2e6hdwFTyJo/QR+DlP0nk29tCJ4sFBRklgCjRU0elHEg6R/Qk+9mG1RyEmjX6D2Kq0erSC2grLV7CvbmFqTbbKbnSADu8dl5rc/nh3mnXkJwx4a5otEeNh/LEk4SbgjAbOXRDpbuAKRGQCnIGgoS83UFuc2B/3NnTwqueEsz78blOfPO0x4PFO4KpQn/8LEJdVt56z1AMWiF+VD45n8NSEe6eK1OX+F7fx7AcaCpEg2lLImni8WP4SVTtv5LQBnAnngGzViZaPwuoTTdr4JQPUQ2hPF6+tLpYUw0mF4pEw7y/OVMLwgYQk5sfbL8iZfLtz93Gt82s5r5cUR9ud+ouKUs1RyjpOOIByKF1fYn+8nWOHuz2nHufetUzyicF+eDuE2Y0uAifXqnbdHpQcQ7snTKeyzmiDLqR/W7Opqcd9/EUM4kKdbuM3baHrKfrEytxlTuIs3LGF/absQFkDcD7nr9BnW4q2dG33oF6/DwqEpET2OgdWGdaSsS+YIt/aRZ2YJA1+NEhbgi1HCJB6bIyyop9zvF4cgbNa2tqE8Zdc0Fo42T3fhMKo0bwuQ1Xj4CeTpSFgAVri7r/F4eTwvrvAOFSc1HuD78uII11y4U/VqeUfXFSkMr0v4QibnkezVWNmLcmnUzQtIOPcR4OnggxIbIri8Vi1thz2OpW29vG7hVtfnaYeQS2D2/NhouRixkfKn66ON1yV8cK05kEZOICcJvCLlZpzW0hHeCYKv1QhvxWl9+Y5mNwPDrs//OS5JeNjpJwknCXckYNyS+A0c/Gs7QIcNTwAAAABJRU5ErkJggg==');
  }

  .anx-play-control_icon-backForward {
    .anx-play-control_icon-fastForward();
    transform: rotate(180deg);
  }

  .icon-full-background-image {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
