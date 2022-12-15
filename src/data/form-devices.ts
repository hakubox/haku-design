import { RemoteDevice } from '@/@types';
import { DeviceType } from '@/@types/enum';

/** 设备型号列表 */
export const remoteDevices: Array<RemoteDevice> = [
  /** 移动端设备 */
  {
    code: 'galaxys5',
    type: DeviceType.mobile,
    name: 'Galaxy S5',
    width: 360,
    height: 640,
    pixelRatio: 3,
  },
  {
    code: 'pixel2',
    type: DeviceType.mobile,
    name: 'Pixel 2',
    width: 411,
    height: 731,
    pixelRatio: 2.625,
  },
  {
    code: 'pixel2xl',
    type: DeviceType.mobile,
    name: 'Pixel 2 XL',
    width: 411,
    height: 823,
    pixelRatio: 3.5,
  },
  {
    code: 'iphone5se',
    type: DeviceType.mobile,
    name: 'iPhone 5/SE',
    width: 320,
    height: 568,
    pixelRatio: 2,
  },
  {
    code: 'iphone678',
    type: DeviceType.mobile,
    name: 'iPhone 6/7/8',
    width: 375,
    height: 667,
    pixelRatio: 2,
  },
  {
    code: 'iphone678plus',
    type: DeviceType.mobile,
    name: 'iPhone 6/7/8 Plus',
    width: 414,
    height: 736,
    pixelRatio: 3,
  },
  {
    code: 'iphonex',
    type: DeviceType.mobile,
    name: 'iPhone X',
    width: 375,
    height: 812,
    pixelRatio: 3,
  },
  {
    code: 'ipad',
    type: DeviceType.mobile,
    name: 'iPad',
    width: 768,
    height: 1024,
    pixelRatio: 2,
  },
  {
    code: 'ipadpro',
    type: DeviceType.mobile,
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
  },

  /** PC端设备 */
  {
    code: 'xsmallpc',
    type: DeviceType.pc,
    name: '4:3小分辨率屏',
    width: 1024,
    height: 768,
    pixelRatio: 1,
  },
  {
    code: 'smallpc',
    type: DeviceType.pc,
    name: '小分辨率屏',
    width: 1366,
    height: 768,
    pixelRatio: 1,
  },
  {
    code: 'middlepc',
    type: DeviceType.pc,
    name: '中分辨率屏',
    width: 1600,
    height: 900,
    pixelRatio: 1,
  },
  {
    code: 'largepc',
    type: DeviceType.pc,
    name: '1080P屏',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
  },
  {
    code: '2kpc',
    type: DeviceType.pc,
    name: '2K屏',
    width: 2560,
    height: 1440,
    pixelRatio: 1,
  },
  {
    code: '4kpc',
    type: DeviceType.pc,
    name: '4K屏',
    width: 3840,
    height: 2160,
    pixelRatio: 1,
  },
];

export function initRemoteDevices(): Record<string, RemoteDevice> {
  const _remoteDevices = remoteDevices.map((i) => ({
    [i.code]: i,
  }));
  return Object.assign({}, ..._remoteDevices);
}
