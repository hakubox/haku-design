import { toDecimal } from "@/tools/common";

const hsv2hsl = function (hue, sat, val) {
  return [hue, (sat * val) / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue) || 0, hue / 2];
};

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
const isOnePointZero = function (n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
};

const isPercentage = function (n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
};

// Take input from [0, n] and return it as [0, 1]
const bound01 = function (value, max) {
  if (isOnePointZero(value)) value = '100%';

  const processPercent = isPercentage(value);
  value = Math.min(max, Math.max(0, parseFloat(value)));

  // Automatically convert percentage into number
  if (processPercent) {
    value = parseInt('' + value * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(value - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return (value % max) / parseFloat(max);
};

const INT_HEX_MAP = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' };

export const toHex = function ({ r, g, b, a }) {
  const hexOne = function (value) {
    value = Math.min(Math.round(value), 255);
    const high = Math.floor(value / 16);
    const low = value % 16;
    return '' + (INT_HEX_MAP[high] || high) + (INT_HEX_MAP[low] || low);
  };

  if (isNaN(r) || isNaN(g) || isNaN(b)) return '';

  return '#' + hexOne(r) + hexOne(g) + hexOne(b) + (a != undefined ? hexOne(a) : '');
};

const HEX_INT_MAP = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 };

const parseHexChannel = function (hex) {
  if (hex.length === 2) {
    return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
  }

  return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
};

export function rgb2hsl(r: number, g: number, b: number) {
  const _r = r / 255;
  const _g = g / 255;
  const _b = b / 255;
  const min = Math.min(_r, _g, _b);
  const max = Math.max(_r, _g, _b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) {
    h = 0;
  } else if (_r === max) {
    h = (_g - _b) / delta;
  } else if (_g === max) {
    h = 2 + (_b - _r) / delta;
  } else if (_b === max) {
    h = 4 + (_r - _g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return {
    h, 
    s: s * 100,
    l: l * 100
  };
}

/**
 * 计算渐变过渡色
 * @param {*} startColor 开始颜色
 * @param {*} endColor 结束颜色
 * @param {*} step 百分比（0~100）
 */
export function getLinearGradientItem(
  startColor: { r: number, g: number, b: number, a: number },
  endColor: { r: number, g: number, b: number, a: number },
  step: number
) {
	// 计算R\G\B每一步的差值
	const rStep = (endColor.r - startColor.r) / 100;
	const gStep = (endColor.g - startColor.g) / 100;
	const bStep = (endColor.b - startColor.b) / 100;
	const aStep = (endColor.a - startColor.a) / 100;

  const _re = {
    r: toDecimal(rStep * step + startColor.r, 0),
    g: toDecimal(gStep * step + startColor.g, 0),
    b: toDecimal(bStep * step + startColor.b, 0),
    a: aStep * step + startColor.a
  };
  console.log('-re', _re);
	return _re;
}

export function hsl2hsv(hue, sat, light) {
  sat = sat / 100;
  light = light / 100;
  let smin = sat;
  const lmin = Math.max(light, 0.01);

  light *= 2;
  sat *= light <= 1 ? light : 2 - light;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (light + sat) / 2;
  const sv = light === 0 ? (2 * smin) / (lmin + smin) : (2 * sat) / (light + sat);

  return {
    h: hue,
    s: sv * 100,
    v: v * 100,
  };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
export const rgb2hsv = function (r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
export function hsv2rgb(h: number, s: number, v: number, a?: number) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return {
    a: a ?? 1,
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export default class Color {
  constructor(options) {
    this._hue = 0;
    this._tempHue = 0;
    this._saturation = 100;
    this._value = 100;
    this._alpha = 1;

    this.format = 'hex';
    this.value = '';

    options = options || {};

    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option)) {
        this[option] = options[option];
      }
    }

    this.doOnChange();
  }

  /** 色环值 */
  _hue: number;
  /** 临时色环值 */
  _tempHue: number;
  /** 色相 */
  _value: number;
  /** 饱和度 */
  _saturation: number;
  /** 透明度 */
  _alpha: number;
  /** 颜色值 */
  value: string;
  /** 颜色格式 */
  format: string;

  set(prop, value?) {
    if (arguments.length === 1 && typeof prop === 'object') {
      for (const p in prop) {
        if (Object.prototype.hasOwnProperty.call(prop, p)) {
          this.set(p, prop[p]);
        }
      }

      return;
    }

    if (prop === 'hue') {
      this[prop] = value;
    } else {
      this['_' + prop] = value;
    }
    this.doOnChange();
    return this;
  }

  get(prop) {
    if (prop === 'hue') {
      return this.hue;
    } else {
      return this['_' + prop];
    }
  }

  /** 综合色环值 */
  get hue() {
    return this._saturation === 0 ? this._tempHue : this._hue;
  }
  /** 综合色环值 */
  set hue(val: number) {
    if (this._saturation === 0) {
      this._tempHue = val;
      this._hue = val;
    } else {
      this._tempHue = val;
      this._hue = val;
    }
  }

  get r() {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    return _color.r;
  }
  set r(val: number) {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    _color.r = val;
    this.fromString(`rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a})`);
  }

  get g() {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    return _color.g;
  }
  set g(val: number) {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    _color.g = val;
    this.fromString(`rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a})`);
  }

  get b() {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    return _color.b;
  }
  set b(val: number) {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    _color.b = val;
    this.fromString(`rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a})`);
  }

  /** 转换为ARGB对象 */
  toRgb() {
    const _color = hsv2rgb(this.hue, this._saturation, this._value, this._alpha) as Record<string, any>;
    _color.tempHue = this._tempHue;
    return _color as {
      a: number;
      r: number;
      g: number;
      b: number;
      tempHue: number;
    };
  }

  /** 转换为ARGB对象 */
  toString(type: 'rgb' | 'css' | 'hsl' | 'hsb' | 'hex'): string {
    const _color: {
      a: number | undefined;
      r: number;
      g: number;
      b: number;
    } = hsv2rgb(this.hue, this._saturation, this._value, this._alpha);
    switch(type) {
      case 'css':
      case 'rgb':
        return `rgba(${_color.r}, ${_color.g}, ${_color.b}, ${_color.a})`;
      case 'hex':
        _color.a = undefined;
        return toHex(_color);
      default:
        return '';
    }
  }

  fromString(value: string, tempHue?: number) {
    if (!value) {
      this._hue = 0;
      this._saturation = 100;
      this._value = 100;

      this.doOnChange();
      return;
    }

    const fromHSV = (h, s, v) => {
      this._hue = Math.max(0, Math.min(360, h));
      // console.log('this._hue', this._hue);
      this._saturation = Math.max(0, Math.min(100, s));
      this._value = Math.max(0, Math.min(100, v));

      this.doOnChange();
    };

    if (value.indexOf('hsl') !== -1) {
      const parts = value
        .replace(/hsla|hsl|\(|\)/gm, '')
        .split(/\s|,/g)
        .filter((val) => val !== '')
        .map((val, index) => (index > 2 ? parseFloat(val) : parseInt(val, 10)));

      if (parts.length === 4) {
        this._alpha = Math.floor(parts[3]);
      } else if (parts.length === 3) {
        this._alpha = 1;
      }
      if (parts.length >= 3) {
        const { h, s, v } = hsl2hsv(parts[0], parts[1], parts[2]);
        fromHSV(h, s, v);
      }
    } else if (value.indexOf('hsv') !== -1) {
      const parts = value
        .replace(/hsva|hsv|\(|\)/gm, '')
        .split(/\s|,/g)
        .filter((val) => val !== '')
        .map((val, index) => (index > 2 ? parseFloat(val) : parseInt(val, 10)));

      if (parts.length === 4) {
        this._alpha = Math.floor(parts[3]);
      } else if (parts.length === 3) {
        this._alpha = 1;
      }
      if (parts.length >= 3) {
        fromHSV(parts[0], parts[1], parts[2]);
      }
    } else if (value.indexOf('rgb') !== -1) {
      const parts = value
        .replace(/rgba|rgb|\(|\)/gm, '')
        .split(/\s|,/g)
        .filter((val) => val !== '')
        .map((val, index) => (index > 2 ? parseFloat(val) : parseInt(val, 10)));

      if (parts.length === 4) {
        this._alpha = Math.floor(parts[3]);
      } else if (parts.length === 3) {
        this._alpha = 1;
      }
      if (parts.length >= 3) {
        const { h, s, v } = rgb2hsv(parts[0], parts[1], parts[2]);
        fromHSV(h, s, v);
      }
    } else if (value.startsWith('#')) {
      const hex = value.replace('#', '').trim();
      if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) return;
      let r, g, b;

      if (hex.length === 3) {
        r = parseHexChannel(hex[0] + hex[0]);
        g = parseHexChannel(hex[1] + hex[1]);
        b = parseHexChannel(hex[2] + hex[2]);
      } else if (hex.length === 6 || hex.length === 8) {
        r = parseHexChannel(hex.substring(0, 2));
        g = parseHexChannel(hex.substring(2, 4));
        b = parseHexChannel(hex.substring(4, 6));
      }

      if (hex.length === 8) {
        this._alpha = Math.floor((parseHexChannel(hex.substring(6)) / 255));
      } else if (hex.length === 3 || hex.length === 6) {
        this._alpha = 1;
      }

      const { h, s, v } = rgb2hsv(r, g, b);
      fromHSV(h, s, v);
    }

    if (tempHue) {
      this._tempHue = tempHue;
    }

    return this;
  }

  compare(color: { _hue: number, _saturation: number, _value: number, _alpha: number }) {
    return (
      Math.abs(color._hue - this.hue) < 2 &&
      Math.abs(color._saturation - this._saturation) < 1 &&
      Math.abs(color._value - this._value) < 1 &&
      Math.abs(color._alpha - this._alpha) < 0.01
    );
  }

  doOnChange() {
    const { hue, _saturation, _value, _alpha, format } = this;
    let hsl;
    // if (this.enableAlpha) {
      let rgb = {} as { a: number; r: number; g: number; b: number };
      switch (format) {
        case 'hsl':
          hsl = hsv2hsl(hue, _saturation / 100, _value / 100);
          this.value = `hsla(${hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, ${_alpha})`;
          break;
        case 'hsv':
          this.value = `hsva(${hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%, ${_alpha})`;
          break;
        case 'hex':
          rgb = hsv2rgb(hue, _saturation, _value);
          rgb.a = _alpha * 2.55;
          this.value = toHex(rgb);
          break;
        case 'rgb':
          rgb = hsv2rgb(hue, _saturation, _value);
          this.value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${_alpha})`;
          break;
        default:
          rgb = hsv2rgb(hue, _saturation, _value);
          this.value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${_alpha})`;
          break;
      }
    // } else {
    //   let rgb = {} as { a: number; r: number; g: number; b: number };
    //   switch (format) {
    //     case 'hsl':
    //       hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
    //       this.value = `hsl(${_hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`;
    //       break;
    //     case 'hsv':
    //       this.value = `hsv(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%)`;
    //       break;
    //     case 'rgb':
    //       rgb = hsv2rgb(_hue, _saturation, _value);
    //       this.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    //       break;
    //     case 'hex':
    //       rgb = hsv2rgb(_hue, _saturation, _value);
    //       this.value = toHex(rgb);
    //       break;
    //     default:
    //       rgb = hsv2rgb(_hue, _saturation, _value);
    //       this.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    //       break;
    //   }
    // }
  }
}
