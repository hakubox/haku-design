/** 获取录音时长 */
export function getVideoDuration(content: Blob) {
  const url = URL.createObjectURL(content);
  //经测试，发现audio也可获取视频的时长
  const audioElement = new Audio(url);
  return new Promise((resolve) => {
    audioElement.addEventListener('loadedmetadata', function (_event) {
      resolve(audioElement.duration * 1000);
      audioElement.removeEventListener('loadedmetadata', () => {});
    });
  });
}
