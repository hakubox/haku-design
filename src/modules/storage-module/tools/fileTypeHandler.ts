/** 文件类型 */
export enum FileType {
  dir = 'dir',
  image = 'image',
  video = 'video',
  audio = 'audio',
  doc = 'doc',
  wps = 'wps',
  excel = 'excel',
  ppt = 'ppt',
  pdf = 'pdf',
  txt = 'txt',
  zip = 'zip',
  other = 'other',
}

const imageSuffix = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
const videoSuffix = [
  'mp4',
  'avi',
  'rmvb',
  'rm',
  'asf',
  'divx',
  'mpg',
  'mpeg',
  'mpe',
  'wmv',
  'mkv',
  'vob',
  'flv',
  'f4v',
  'mov',
  'mtv',
  'dat',
  'ts',
  'tp',
  'trp',
  '3gp',
  '3g2',
];
const audioSuffix = ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac', 'ape', 'amr', 'mid', 'mka'];
const zipSuffix = ['zip', '7k', 'rar', 'arj', 'z'];
const excelSuffix = ['xls', 'xlsx', 'xlt', 'xltx', 'et', 'ett', 'csv'];
const pptSuffix = ['ppt', 'pptx', 'pot', 'potx', 'pps', 'ppsx', 'pptm', 'ppsm', 'ppsx', 'ppam', 'ppsm', 'sldx', 'sldm'];
const wpsSuffix = ['wps', 'wpt'];
const wordSuffix = ['doc', 'docx', 'dot', 'dotx', 'rtf'];

/** 文件类型与icon名称映射 */
const fileTypeIconnameMap = {
  [FileType.dir]: 'icon-folder',
  [FileType.image]: 'icon-tupian',
  [FileType.video]: 'icon-file-video',
  [FileType.audio]: 'icon-file-music',
  [FileType.doc]: 'icon-file-word',
  [FileType.wps]: 'icon-file-wps',
  [FileType.excel]: 'icon-file-excel',
  [FileType.ppt]: 'icon-file-ppt',
  [FileType.pdf]: 'icon-file-pdf',
  [FileType.txt]: 'icon-file-txt',
  [FileType.zip]: 'icon-file-compress',
  [FileType.other]: 'icon-file-unknown',
};

/** 后缀归一化处理 */
const suffixNormalization = (suffix: string) => {
  const suffixSplite = suffix.split('.');
  if (suffixSplite?.length) {
    return (suffixSplite.pop() as string).toLowerCase();
  }
  return suffix.toLowerCase();
};

/** 获取文件类型 */
export const getFileType = (suffix: string) => {
  if (suffix === '#') {
    return FileType.dir;
  }
  const suffixStr = suffixNormalization(suffix);
  const types = Object.keys(fileTypeIconnameMap);

  if (types.includes(suffixStr)) {
    return suffixStr as FileType;
  } else {
    if (imageSuffix.includes(suffixStr)) return FileType.image;
    if (videoSuffix.includes(suffixStr)) return FileType.video;
    if (audioSuffix.includes(suffixStr)) return FileType.audio;
    if (zipSuffix.includes(suffixStr)) return FileType.zip;
    if (excelSuffix.includes(suffixStr)) return FileType.excel;
    if (pptSuffix.includes(suffixStr)) return FileType.ppt;
    if (wpsSuffix.includes(suffixStr)) return FileType.wps;
    if (wordSuffix.includes(suffixStr)) return FileType.doc;
    return FileType.other;
  }
};

/** 通过后缀获取icon名称 */
export const getFileIconBySuffix = (suffix: string) => {
  const fileType = getFileType(suffix);
  if (fileType) {
    return fileTypeIconnameMap[fileType];
  }
};

/** 通过文件类型（FileType）获取icon名称 */
export const getFileIconByFileType = (fileType: FileType) => {
  return fileTypeIconnameMap[fileType];
};

/** 通过文件名获取icon名称 */
export const getFileIconByFileName = (filename: string) => {
  const fileType = getFileType(filename);
  if (fileType) {
    return fileTypeIconnameMap[fileType];
  }
};
/** 是否是文件夹，传入文件名或者后缀皆可 */
export const isDir = (fileName: string) => {
  return getFileType(fileName) === FileType.dir;
};
