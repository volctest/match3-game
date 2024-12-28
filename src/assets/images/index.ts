// Import card images
import card1 from './card1.png';
import card2 from './card2.png';
import card3 from './card3.png';
import card4 from './card4.png';
import card5 from './card5.png';
import card6 from './card6.png';
import card7 from './card7.png';
import card8 from './card8.png';

export const CARD_IMAGES = {
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
  card7,
  card8,
} as const;

export type CardImageType = keyof typeof CARD_IMAGES;
