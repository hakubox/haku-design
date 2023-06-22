// 定义渐变色的起始颜色和终止颜色
const num1 = '#e52e2e';
const num2 = '#fbc918';
// 定义将颜色拆分为多少份
const steps = 50;
// 定义不透明度
const gamma = 1;

/** 将HEX色值转换为RGB色值 */
const parseColor = function (hexStr) {
  if (hexStr.length === 4) {
    return hexStr.substr(1).split('').map(function (s) {
      return 0x11 * parseInt(s, 16);
    });
  } else {
    return [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
      return parseInt(s, 16);
    });
  }
};

/** 获取每一份的色值 */
const gradientColors = function (start, end, steps, gamma) {
  let i;
  let j;
  let ms: number;
  let me;
  const output: string[] = [];
  const so: string[] = [];
  gamma = gamma || 1;
  const normalize = function (channel) {
    return Math.pow(channel / 255, gamma);
  };
  start = parseColor(start).map(normalize);
  end = parseColor(end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16).padStart(2, '0');
    }
    output.push('#' + so.join(''));
  }
  return output;
};

// 打印结果
console.log(gradientColors(num1, num2, steps, gamma));
