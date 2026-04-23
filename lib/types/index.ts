export enum GameType {
  BALLOON_POP = 'BALLOON_POP',
  BIRTHDAY_CAKE = 'BIRTHDAY_CAKE',
  GIFT_BOX = 'GIFT_BOX',
  SPIN_WHEEL = 'SPIN_WHEEL',
  STICKY_NOTE = 'STICKY_NOTE',
  REWARD_DISPLAY = 'REWARD_DISPLAY',
  MOOD_RATING = 'MOOD_RATING',
  MEMORY_COLLAGE = 'MEMORY_COLLAGE',
  DART_GAME = 'DART_GAME',
  FISHING_GAME = 'FISHING_GAME',
  LUCKY_DRAW = 'LUCKY_DRAW',
  EGG_SHOOTER = 'EGG_SHOOTER',
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  gradient: string;
}

export interface GameInstance {
  id: string;
  cardId: string;
  gameType: GameType;
  order: number;
  config: Record<string, any>;
  createdAt: string;
}

export interface BirthdayCard {
  id: string;
  slug: string;
  recipientName: string;
  userId: string;
  themeId: string;
  backgroundMusicUrl?: string;
  publishedAt: string;
  viewCount: number;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  theme: Theme;
  games: GameInstance[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface CreateCardData {
  recipientName: string;
  themeId: string;
  backgroundMusicUrl?: string;
}

export interface UpdateCardData {
  recipientName?: string;
  themeId?: string;
  backgroundMusicUrl?: string | null;
}

export interface AddGameData {
  cardId: string;
  gameType: GameType;
  order: number;
  config: Record<string, any>;
}

export interface UpdateGameData {
  gameType?: GameType;
  order?: number;
  config?: Record<string, any>;
}

export interface ReorderGamesData {
  games: Array<{
    id: string;
    order: number;
  }>;
}
