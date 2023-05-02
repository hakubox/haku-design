import type { SimpleAnime } from '../../@types';
import { animes as inAnimeList } from './in';
import { animes as outAnimeList } from './out';
import { animes as emphasizeAnimeList } from './emphasize';

/** 简单动画列表 来自：http://cssanimation.io/index.html */
export const simpleAnimeList: SimpleAnime[] = [
  // 淡入
  ...inAnimeList,
  // 淡出
  ...outAnimeList,
  // 强调
  ...emphasizeAnimeList
];