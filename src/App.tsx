import React, { useState, useEffect } from 'react';
import { Card } from './types';
import { ICONS, type IconType } from './assets/icons';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// ICONS imported from './assets/icons'

// Card dimensions including padding and border
const CARD_WIDTH = 124; // 80px + 2×16px padding + 2×6px border
const CARD_HEIGHT = 124;

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [slotCards, setSlotCards] = useState<(Card | null)[]>([null, null, null, null, null]);
  const [pendingCard, setPendingCard] = useState<Card | null>(null);

  // Initialize game board
  useEffect(() => {
    const types: IconType[] = ['campfire', 'lettuce', 'scissors', 'yarn', 'glove', 'stump', 'fork', 'carrot', 'hay', 'cotton', 'corn'];
    const initialCards: Card[] = [];
    
    // Create 4 layers of cards
    for (let z = 0; z < 4; z++) {
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          initialCards.push({
            id: `${x}-${y}-${z}`,
            type: types[Math.floor(Math.random() * types.length)],
            visible: z === 3, // Only top layer visible initially
            selected: false,
            x,
            y,
            z,
          });
        }
      }
    }
    
    setCards(initialCards);
  }, []);

  // Check for game over conditions after each card removal
  useEffect(() => {
    const visibleCards = cards.filter(c => c.visible);
    if (visibleCards.length === 0) {
      setGameStatus('won');
    } else {
      // Check for possible matches including slot cards
      const allPlayableCards = [...visibleCards, ...slotCards.filter((c): c is Card => c !== null)];
      const hasMatch = allPlayableCards.some(card1 =>
        allPlayableCards.filter(c => c.type === card1.type).length >= 3
      );
      if (!hasMatch) {
        setGameStatus('lost');
      }
    }
  }, [cards, slotCards]);

  return (
    <div className="min-h-screen bg-[#D0FFB0] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">消消乐游戏</h1>
        
        {gameStatus !== 'playing' && (
          <Alert className="mb-4">
            <AlertTitle>{gameStatus === 'won' ? '恭喜你赢了！' : '游戏结束'}</AlertTitle>
            <AlertDescription>
              {gameStatus === 'won' 
                ? '你成功消除了所有卡片！' 
                : '没有更多可以匹配的卡片了。'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => {
              const types: IconType[] = ['campfire', 'lettuce', 'scissors', 'yarn', 'glove', 'stump', 'fork', 'carrot', 'hay', 'cotton', 'corn'];
              const initialCards: Card[] = [];
              
              // Create 4 layers of cards
              for (let z = 0; z < 4; z++) {
                for (let y = 0; y < 4; y++) {
                  for (let x = 0; x < 4; x++) {
                    initialCards.push({
                      id: `${x}-${y}-${z}`,
                      type: types[Math.floor(Math.random() * types.length)],
                      visible: z === 3, // Only top layer visible initially
                      selected: false,
                      x,
                      y,
                      z,
                    });
                  }
                }
              }
              
              setCards(initialCards);
              setSelectedCards([]);
              setPendingCard(null);
              setSlotCards([null, null, null, null, null]);
              setGameStatus('playing');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            重新开始游戏
          </button>
          <button
            onClick={() => {
              const visibleCards = cards.filter(c => c.visible);
              if (visibleCards.length < 2) return; // Need at least 2 cards to shuffle
              
              // Fisher-Yates shuffle of positions
              const positions = visibleCards.map(card => ({ x: card.x, y: card.y }));
              for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
              }
              
              // Update card positions
              const newCards = cards.map(card => {
                if (!card.visible) return card;
                const index = visibleCards.findIndex(vc => vc.id === card.id);
                if (index === -1) return card;
                return {
                  ...card,
                  x: positions[index].x,
                  y: positions[index].y,
                };
              });
              
              setCards(newCards);
            }}
            disabled={gameStatus !== 'playing'}
            className={`px-4 py-2 rounded-md transition-colors ${
              gameStatus === 'playing'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            洗牌
          </button>
        </div>

        <div className="relative w-full h-[1000px] py-8 overflow-visible">
          {cards
            .filter(card => card.visible)
            .map(card => {
              const Icon = ICONS[card.type as keyof typeof ICONS];
              const isPending = pendingCard?.id === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    if (pendingCard) {
                      // If we have a pending card and click another card, try to match
                      if (pendingCard.type === card.type) {
                        const matchingCards = [...selectedCards, card, pendingCard];
                        if (matchingCards.length === 3) {
                          // Remove matched cards
                          const removedIds = new Set(matchingCards.map(c => c.id));
                          const updatedCards = cards.map(c => ({
                            ...c,
                            visible: removedIds.has(c.id) ? false : c.visible,
                            selected: false
                          }));
                          setCards(updatedCards);
                          setSelectedCards([]);
                          setPendingCard(null);
                        } else {
                          setSelectedCards(matchingCards);
                        }
                      } else {
                        setPendingCard(null);
                        setSelectedCards([]);
                      }
                    } else {
                      // Set this card as pending for slot placement or matching
                      setPendingCard(card);
                      setSelectedCards([card]);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${(card.x * (CARD_WIDTH + 8)) + (card.z * ((CARD_WIDTH + 8) / 2))}px`,
                    top: `${(card.y * (CARD_HEIGHT + 8)) + (card.z * ((CARD_HEIGHT + 8) / 2))}px`,
                    transform: `${card.visible ? 'scale(1)' : 'scale(0)'}`,
                    opacity: card.visible ? 1 : 0,
                    transition: 'all 0.3s ease',
                    zIndex: card.z * 10
                  }}
                  className={`
                    p-4 rounded-xl
                    border-[6px] border-[#556B2F]
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)]
                    transition-all duration-300
                    w-20 h-20
                    flex items-center justify-center
                    group
                    ${isPending 
                      ? 'bg-[#FFFDD0]/60 scale-90 border-yellow-500 shadow-[0_2px_4px_rgba(0,0,0,0.1)]' 
                      : card.selected 
                        ? 'bg-[#FFFDD0]/80 scale-95 border-[#6B8E23] shadow-[0_3px_6px_rgba(0,0,0,0.1)]' 
                        : 'bg-[#FFFDD0] hover:bg-[#FFFDD0]/90 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] hover:scale-105'
                    }
                  `}
                  disabled={gameStatus !== 'playing' || (!isPending && pendingCard !== null)}
                >
                  <Icon className="w-12 h-12 transform transition-transform group-hover:scale-110 drop-shadow-lg" />
                </button>
              );
            })}
          
          {/* Card slots */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4 mb-8">
            {slotCards.map((slotCard, index) => (
              <button
                key={`slot-${index}`}
                className={`
                  w-20 h-20
                  p-4 rounded-xl
                  border-[6px] border-[#556B2F]
                  shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)]
                  flex items-center justify-center
                  group
                  ${slotCard 
                    ? 'bg-[#FFFDD0] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] hover:scale-105' 
                    : 'bg-gray-200 hover:bg-gray-300'
                  }
                  transition-all duration-300
                `}
                onClick={() => {
                  if (pendingCard && !slotCard) {
                    // Place pending card in empty slot
                    const newSlots = [...slotCards];
                    newSlots[index] = pendingCard;
                    setSlotCards(newSlots);
                    // Hide the card from the board
                    setCards(cards.map(c => 
                      c.id === pendingCard.id ? { ...c, visible: false } : c
                    ));
                    setPendingCard(null);
                    setSelectedCards([]);
                  } else if (slotCard && !pendingCard) {
                    // Select card from slot
                    setPendingCard(slotCard);
                    setSelectedCards([slotCard]);
                    // Remove card from slot
                    const newSlots = [...slotCards];
                    newSlots[index] = null;
                    setSlotCards(newSlots);
                  }
                }}

                disabled={gameStatus !== 'playing'}
              >
                {slotCard && React.createElement(ICONS[slotCard.type], {
                  className: 'w-16 h-16'
                })}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
