import { SimpleAnime, SimpleAnimeConfig } from '../../@types';
import { ComponentPropertyEditor } from '@/@types/enum';
import { animes as inAnimeList } from './in';
import { animes as outAnimeList } from './out';
import { animes as emphasizeAnimeList } from './emphasize';

/** 简单动画列表 */
export const simpleAnimeList: SimpleAnime[] = [
  // 淡入
  ...inAnimeList,
  // 淡出
  ...outAnimeList,
  // 强调
  ...emphasizeAnimeList
];