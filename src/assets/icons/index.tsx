import React from 'react';

// Custom icon components for the match-3 game
// Each icon is a simple SVG representation matching the hand-drawn style

export const CampfireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C14 6 16 8 16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10C8 8 10 6 12 3Z" fill="#FF6B35"/>
    <path d="M12 15C14.2091 15 16 16.7909 16 19H8C8 16.7909 9.79086 15 12 15Z" fill="#994021"/>
  </svg>
);

export const LettuceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" fill="#4CAF50"/>
    <path d="M12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7Z" fill="#81C784"/>
  </svg>
);

export const ScissorsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="12" r="2" fill="#9E9E9E"/>
    <circle cx="18" cy="12" r="2" fill="#9E9E9E"/>
    <path d="M8 12L16 6M8 12L16 18" stroke="#757575" strokeWidth="2"/>
  </svg>
);

export const YarnBallIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="#9C27B0"/>
    <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="#CE93D8" strokeWidth="2"/>
    <path d="M12 8C14.2091 8 16 9.79086 16 12" stroke="#CE93D8" strokeWidth="2"/>
  </svg>
);

export const GloveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C14 4 18 6 18 12C18 16 15 20 12 20C9 20 6 16 6 12C6 6 10 4 12 4Z" fill="#2196F3"/>
    <path d="M12 8C13 8 15 9 15 12" stroke="#90CAF9" strokeWidth="2"/>
  </svg>
);

export const TreeStumpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8H17V16H7V8Z" fill="#795548"/>
    <circle cx="12" cy="12" r="3" fill="#8D6E63"/>
    <path d="M9 8C9 8 10 10 12 10C14 10 15 8 15 8" stroke="#6D4C41"/>
  </svg>
);

export const GardenForkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20" stroke="#795548" strokeWidth="2"/>
    <path d="M8 4V10M12 4V10M16 4V10" stroke="#795548" strokeWidth="2"/>
  </svg>
);

export const CarrotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L16 8L12 20L8 8L12 4Z" fill="#FF5722"/>
    <path d="M12 4C12 4 14 6 14 8" stroke="#4CAF50" strokeWidth="2"/>
  </svg>
);

export const HayBundleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="12" height="8" rx="2" fill="#FFC107"/>
    <path d="M8 8C8 8 12 10 16 8M8 12C8 12 12 14 16 12M8 16C8 16 12 18 16 16" stroke="#FFE082"/>
  </svg>
);

export const CottonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="6" fill="#E0E0E0"/>
    <circle cx="10" cy="10" r="2" fill="white"/>
    <circle cx="14" cy="14" r="2" fill="white"/>
  </svg>
);

export const CornIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L16 8V16L12 20L8 16V8L12 4Z" fill="#FDD835"/>
    <path d="M10 8L14 12M10 12L14 16M10 16L14 8" stroke="#F9A825"/>
  </svg>
);

// Export a mapping of icon types to components
export const ICONS = {
  campfire: CampfireIcon,
  lettuce: LettuceIcon,
  scissors: ScissorsIcon,
  yarn: YarnBallIcon,
  glove: GloveIcon,
  stump: TreeStumpIcon,
  fork: GardenForkIcon,
  carrot: CarrotIcon,
  hay: HayBundleIcon,
  cotton: CottonIcon,
  corn: CornIcon,
} as const;

export type IconType = keyof typeof ICONS;
