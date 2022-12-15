/** Byte字节转换文件尺寸字符串 */
export const parseByte = (byte: number) => {
  const sizeUnit = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let fileSize = byte;
  while (fileSize > 1024) {
    fileSize = fileSize / 1024;
    index++;
  }
  const fileSizeFixed = fileSize.toFixed(1);
  const fileSizeStr =
    fileSizeFixed.lastIndexOf('0') === fileSizeFixed.length - 1 ? fileSizeFixed.slice(0, -2) : fileSizeFixed;
  return `${fileSizeStr}${sizeUnit[index]}`;
};
