/// <reference types="howler" />

declare module "howler" {
  /**
   * 音频播放器 https://howlerjs.com/
   */
  export class Howl {
    constructor(options: {
      /** 音频地址 */
      src: string | string[];
      /** @param {number} [volume=1.0] 音量（0.0~1.0） */
      volume?: number;
      /** @param {number} [rate=1.0] 播放速率（0.5~4.0） */
      rate?: number;
      /** @param {boolean} [autoplay=false] 自动播放 */
      autoplay?: boolean;
      /** @param {boolean} [loop=false] 是否循环 */
      loop?: boolean;
      /** @param {boolean} [mute=false] 是否静音 */
      mute?: boolean;
      /** 设置强制使用 HTML5 音频。这应该用于大型音频文件，这样您就不必在播放前等待完整文件下载和解码。 */
      html5?: boolean;
      /** 结束事件 */
      onend?: () => void,
    });

    /** Id */
    _id: number;

    /** 播放地址列表 */
    _src: string | string[];

    /**
     * 播放声音或恢复先前的播放。
     * @param {string} [sprite] 精灵名称用于精灵播放。
     * @return {number} 声音Id
     */
    play(sprite?: string): void;
    /**
     * 播放声音或恢复先前的播放。
     * @param {number} [id] 声音id用于继续上一个。
     * @return {number} 声音Id
     */
    play(id?: number): void;
    /**
     * 停止播放声音
     * @param {number} [id] 声音Id
     */
    stop(id?: number): void;
    /** 单词事件绑定 */
    once(eventName: 'load' | 'play' | 'error' | 'end' | 'seek', event: () => void);
    /** 事件绑定 */
    on(eventName: 'load' | 'play' | 'error' | 'end', event: () => void);
    /** 音效淡出 */
    fade(
      from: number,
      to: number,
      duration: number,
      /** 特定音频 */
      id?: number
    ): void;
    /** 暂停播放 */
    pause(id?: number): void;
    /** 获取声音的播放速率。 */
    rate(id?: number): void;
    /** 设置声音的播放速率。 */
    rate(rate: number, id?: number): void;
    /** 设置声音的播放进度 */
    seek(seek: number, id: number): void;
    /** 获取声音是否在播放中 */
    playing(id?: number): boolean;
    /** 加载音频，不需要调用，默认自动加载 */
    load(): void;
    
    /** 事件：进度改变 */
    onseek(): void;
  }
}

