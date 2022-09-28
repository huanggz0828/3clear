export enum PAGE {
  HOME,
  GAME,
}

export interface ILocalData {
  level: number;
  collectMax: number;
  gobBackCount: number;
  storageCount: number;
  shuffleCount: number;
  reviveCount: number;
  leftCountShow: boolean;
}

export enum GAME_MODE {
  CAREER,
  FREE,
}

export const TILE_TEXT_MAP = {
  hotFace: '🥵',
  lemon: '🍋',
  dragon: '🐲',
  diamond: '💎',
  apple: '🍎',
  sun: '☀️',
  peach: '🍑',
  star: '⭐',
  fourLeafClover: '🍀',
  unicorn: '🦄',
  sakura: '🌸',
  wheelChair: '♿',
  clown: '🤡',
  dog: '🐶',
  mouse: '🐭',
  fire: '🔥',
  crystalBall: '🔮',
  rose: '🌹',
  lightning: '⚡',
  monster: '👾',
  butterfly: '🦋',
  crown: '👑',
  eggplant: '🍆',
  kiwifruit: '🥝',
  cherry: '🍒',
  mushroom: '🍄',
  beer: '🍺',
  fox: '🦊',
  frog: '🐸',
  fish: '🐟',
  earth: '🌎',
  sunflower: '🌻',
  umbrella: '☔',
  dice: '🎲',
  ribbon: '🎀',
  ghost: '👻',
  alien: '👽',
  robot: '🤖',
  grape: '🍇',
  coffee: '☕',
  candy: '🍬',
  rainbow: '🌈',
  bomb: '💣',
  barber: '💈',
  gift: '🎁',
  pill: '💊',
  doughnut: '🍩',
  watermelon: '🍉',
  pineapple: '🍍',
  Cocktail: '🍸',
} as const;

export type tileKey = keyof typeof TILE_TEXT_MAP;

export enum TILE_STATUS {
  PENDING,
  COLLECT,
  STORAGE,
}

export interface ITile {
  key: tileKey;
  text: string;
  position: number;
  gridIndex: number;
  zIndex: number;
  id: string;
  left: number;
  top: number;
  status?: TILE_STATUS;
}

export interface ICollect extends ITile {
  startX: number;
  startY: number;
  step?: number;
  el?: HTMLDivElement;
}

export enum GAME_STATUS {
  PLAYING,
  SUCCESS,
  FAIL,
}
