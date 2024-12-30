import React, { useState, useEffect } from 'react';
import { Card } from './types';
import { ICONS, type IconType } from './assets/icons';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// ICONS imported from './assets/icons'

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [slotCards, setSlotCards] = useState<(Card | null)[]>([null, null, null, null, null]);

  // Initialize game board
  useEffect(() => {
    const types: IconType[] = ['campfire', 'lettuce', 'scissors', 'yarn', 'glove', 'stump', 'fork', 'carrot', 'hay', 'cotton', 'corn'];
    const initialCards: Card[] = [];
    
    // Create layers of cards (10x8 grid)
    for (let z = 0; z < 4; z++) {
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 10; x++) {
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
    if (cards.length === 0) return; // Don't check until game is initialized
    
    const visibleCards = cards.filter(c => c.visible);
    const slotCardsArray = slotCards.filter((c): c is Card => c !== null);
    const allPlayableCards = [...visibleCards, ...slotCardsArray];
    
    // Only check win/lose if we have cards in play
    if (allPlayableCards.length > 0) {
      // Check for possible matches
      const hasMatch = allPlayableCards.some(card1 =>
        allPlayableCards.filter(c => c.type === card1.type).length >= 3
      );
      
      if (!hasMatch) {
        setGameStatus('lost');
      }
    } else if (cards.every(card => !card.visible)) {
      // Win if all cards are cleared
      setGameStatus('won');
    }
  }, [cards, slotCards]);

  return (
    <div className="min-h-screen bg-[#D0FFB0] p-8 flex justify-center">
      <div className="w-full max-w-[1200px]">
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

        <div className="flex justify-center gap-4 mb-4 relative z-50">
          <button
            onClick={() => {
              const types: IconType[] = ['campfire', 'lettuce', 'scissors', 'yarn', 'glove', 'stump', 'fork', 'carrot', 'hay', 'cotton', 'corn'];
              const initialCards: Card[] = [];
              
              // Create layers of cards (10x8 grid)
              for (let z = 0; z < 4; z++) {
                for (let y = 0; y < 8; y++) {
                  for (let x = 0; x < 10; x++) {
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

        <div className="relative w-full h-[600px] flex items-center justify-center bg-[#D0FFB0]/50 rounded-lg z-10 mx-auto overflow-visible">
          {cards
            .filter(card => card.visible)
            .map(card => {
              const Icon = ICONS[card.type as keyof typeof ICONS];
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    // If card is already selected, ignore the click
                    if (card.selected) {
                      return;
                    }

                    // If we're starting a new selection and this card type doesn't match previous selections, reset
                    if (selectedCards.length > 0 && card.type !== selectedCards[0].type) {
                      setSelectedCards([]);
                      setCards(cards.map(c => ({
                        ...c,
                        selected: false
                      })));
                      return;
                    }

                    // Add the new card to selection
                    const newSelectedCards = [...selectedCards, card];
                    
                    // Update card selection state with consistent green color
                    setCards(cards.map(c => ({
                      ...c,
                      selected: newSelectedCards.some(sc => sc.id === c.id)
                    })));
                    
                    if (newSelectedCards.length === 3) {
                      // Check if all three cards match
                      if (newSelectedCards.every(c => c.type === newSelectedCards[0].type)) {
                        // Remove matched cards and reveal next layer if needed
                        const removedIds = new Set(newSelectedCards.map(c => c.id));
                        let updatedCards = cards.map(c => ({
                          ...c,
                          visible: removedIds.has(c.id) ? false : c.visible,
                          selected: false
                        }));

                        // Check each layer from top to bottom
                        for (let layer = 3; layer >= 0; layer--) {
                          const layerStillHasVisible = updatedCards.some(c => c.z === layer && c.visible);
                          if (!layerStillHasVisible && layer > 0) {
                            // Reveal the next layer down
                            updatedCards = updatedCards.map(c => {
                              if (c.z === layer - 1) {
                                return { ...c, visible: true };
                              }
                              return c;
                            });
                          }
                        }

                        // Update game state
                        setCards(updatedCards);
                        setSelectedCards([]);

                        // Check if any cards are still visible
                        const hasVisibleCards = updatedCards.some(c => c.visible);
                        if (!hasVisibleCards) {
                          setGameStatus('won');
                        }
                      } else {
                        // Reset selection if three cards don't match
                        setCards(cards.map(c => ({ ...c, selected: false })));
                        setSelectedCards([]);
                      }
                    } else {
                      setSelectedCards(newSelectedCards);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${(card.x * 40) + (card.z * 20) + ((1200 - (10 * 40)) / 2)}px`,
                    top: `${(card.y * 40) + (card.z * 20) + ((600 - (8 * 40)) / 2)}px`,
                    transform: `${card.visible ? 'scale(1)' : 'scale(0)'}`,
                    opacity: card.visible ? 1 : 0,
                    transition: 'all 0.3s ease',
                    zIndex: card.z
                  }}
                  className={`
                    p-0 rounded-xl
                    border-[6px]
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)]
                    transition-all duration-300
                    w-[40px] h-[40px]
                    flex items-center justify-center
                    group
                    ${card.selected 
                      ? 'bg-green-100 scale-95 border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.5)]' 
                      : 'bg-[#FFFDD0] border-green-200 hover:border-green-300'
                    }
                  `}
                  disabled={gameStatus !== 'playing'}
                >
                  <Icon className="w-8 h-8 transform transition-transform group-hover:scale-110 drop-shadow-lg" />
                </button>
              );
            })}
          
          {/* Card slots */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4 mb-8 z-40">
            {slotCards.map((slotCard, index) => (
              <button
                key={`slot-${index}`}
                className={`
                  w-[80px] h-[80px]
                  p-0 rounded-xl
                  border-[6px]
                  shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.15)]
                  flex items-center justify-center
                  group
                  ${slotCard 
                    ? (selectedCards.includes(slotCard) 
                      ? 'bg-green-100 scale-95 border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                      : 'bg-[#FFFDD0] border-green-200 hover:border-green-300')
                    : 'bg-gray-200 border-green-100 hover:border-green-200'
                  }
                  transition-all duration-300
                `}
                onClick={() => {
                  if (selectedCards.length > 0 && !slotCard) {
                    // Place selected card in empty slot
                    const selectedCard = selectedCards[selectedCards.length - 1];
                    const newSlots = [...slotCards];
                    newSlots[index] = selectedCard;
                    setSlotCards(newSlots);
                    // Hide the card from the board
                    setCards(cards.map(c => 
                      c.id === selectedCard.id ? { ...c, visible: false, selected: false } : c
                    ));
                    setSelectedCards([]);
                  } else if (slotCard) {
                    // Select card from slot
                    setSelectedCards([...selectedCards, slotCard]);
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
