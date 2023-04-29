
const _getPixelRatio = (context) => {
  let backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

const drawCanvas = (options: {
  peaks: number[],
  barColor: string,
  shadowColor?: string,
  width: number,
  height: number,
}) => {
  const bar_space = 1;
  const botSize = options.shadowColor ? 0.25 : 0;

  const canvas = document.createElement('canvas');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d')!;
  let ratio = _getPixelRatio(ctx);

  canvas.width = options.width * ratio;
  canvas.height = options.height * ratio;
  canvas.style.width = options.width + 'px';
  canvas.style.height = options.height + 'px';

  ctx.scale(ratio, ratio);
  ctx.imageSmoothingEnabled = false;
  ctx['imageSmoothing'] = false;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = 'rgba(255, 255, 255, 0)';

  let max = Math.max(...options.peaks);

  let newArr: number[] = [];
  for (let i = 0; i < options.peaks.length; i++) {
    newArr[i] = options.peaks[i] / Number(max);
  }

  let barCount = options.width / 3;

  let bar_w = Math.ceil(options.width / barCount);

  let topSize = 1 - botSize;
  let lastBarHeight = 0;
  let searched_index: number;

  const drawBars = (isReflection = false) => {
    for (let i = 0; i < barCount; i++) {
      ctx.save();

      searched_index = Math.ceil(i * (newArr.length / barCount));

      if (i < barCount / 5) {
        if (newArr[searched_index] < 0.1) {
          newArr[searched_index] = 0.1;
        }
      }
      if (newArr.length > barCount * 2.5 && i > 0 && i < newArr.length - 1) {
        newArr[searched_index] =
          Math.abs(newArr[searched_index] + newArr[searched_index - 1] + newArr[searched_index + 1]) / 3;
      }

      let targetRatio = isReflection ? botSize : topSize;

      let barHeight = Math.abs(newArr[searched_index] * options.height * targetRatio);

      if (isNaN(lastBarHeight)) {
        lastBarHeight = 0;
      }
      barHeight = barHeight / 1.5 + lastBarHeight / 2.5;
      lastBarHeight = barHeight;

      ctx.lineWidth = 0;
      barHeight = Math.floor(barHeight);
      let barPositionTop = isReflection
        ? options.height * topSize
        : Math.ceil(options.height * targetRatio - barHeight);

      ctx.beginPath();
      ctx.rect(i * bar_w, barPositionTop, bar_w - bar_space, barHeight);

      if (isReflection && options.shadowColor) {
        ctx.fillStyle = options.shadowColor;
      } else {
        ctx.fillStyle = options.barColor;
      }

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  };
  ctx.clearRect(0, 0, options.width, options.height);
  drawBars();
  if (options.shadowColor) drawBars(true);
  return canvas.toDataURL('image/png');
};

export const getAudioFile = (url: string) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.response);
        } else {
          reject(new Error('获取音频地址失败: ' + xhr.status));
        }
      }
    };
    xhr.send();
  });
};

const drawPeaks = (befferSource: AudioBufferSourceNode) => {
  let _befferSource = befferSource.buffer!;
  const length = 200;
  let sampleSize = _befferSource.length / length;
  let sampleStep = ~~(sampleSize / 10) || 1;
  let channels = _befferSource.numberOfChannels;
  let splitPeaks: number[][] = [];
  let mergedPeaks: number[] = [];

  for (let c = 0; c < channels; c++) {
    splitPeaks[c] = [];
    let peaks: number[] = splitPeaks[c];
    let chan = _befferSource.getChannelData(c);

    for (let i = 0; i < length; i++) {
      let start = ~~(i * sampleSize);
      let end = ~~(start + sampleSize);
      let min = 0;
      let max = 0;

      for (let j = start; j < end; j += sampleStep) {
        let value = chan[j];

        if (value > max) {
          max = value;
        }

        if (value < min) {
          min = value;
        }
      }

      peaks[2 * i] = max;
      peaks[2 * i + 1] = min;

      if (c == 0 || max > mergedPeaks[2 * i]) {
        mergedPeaks[2 * i] = max;
      }

      if (c == 0 || min < mergedPeaks[2 * i + 1]) {
        mergedPeaks[2 * i + 1] = min;
      }
    }
  }

  return mergedPeaks;
};

/** 获取音频图形 */
export const getAudioImg = (
  /** 音频地址 / ArrayBuffer */
  target: string | ArrayBuffer,
  params: {
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
    /** 图形颜色 */
    barColor: string;
    /** 阴影颜色 */
    shadowColor?: string;
  },
) => {
  return new Promise<string>(async (resolve, reject) => {
    // @ts-ignore
    const options = Object.assign({}, {
      audio: null,
      playIndex: 0,
      barColor: '#666666',
    }, params) as {
      width: number;
      height: number;
      barColor: string;
      audioCtx: AudioContext;
      befferSource: AudioBufferSourceNode;
      analyser: AnalyserNode;
      pcm: number[];
    };
    Object.entries(([key, value]) => {
      options[key] = value;
    });
    // 创建一个音频上下文
    options.audioCtx = new AudioContext();

    // 创建一个分析音频模块
    options.analyser = options.audioCtx.createAnalyser();
    // 设置音频的数量大小 默认是2048
    options.analyser.fftSize = 512;

    // 关联音频
    options.analyser.connect(options.audioCtx.destination);

    let arraybuffer: ArrayBuffer;
    if (typeof target === 'string') {
      arraybuffer = await getAudioFile(target);
    } else {
      arraybuffer = target;
    }

    options.audioCtx.decodeAudioData(arraybuffer, (buffer: AudioBuffer) => {
      const accuracy = 100;
      // 创建 AudioBufferSourceNode
      console.log('options.audioCtx', options.audioCtx);
      options.befferSource = options.audioCtx.createBufferSource();
      // 讲解码之后的 buffer 放到 AudioBufferSourceNode 的 buffer 中
      options.befferSource.buffer = buffer;
      options.befferSource.connect(options.analyser);

      // 返回计算断开时波形的最大值和最小值
      let peaks = drawPeaks(options.befferSource);

      options.pcm = peaks.map(function (item) {
        return Math.abs(Math.round(item * accuracy) / accuracy);
      });
      const _url = drawCanvas({
        peaks: options.pcm,
        ...options
      });
      resolve(_url);
    }, (err) => {
      console.log(err);
      reject(err);
    });
  });
};
