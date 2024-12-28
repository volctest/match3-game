import { useState, useEffect } from 'react';
import { Card } from './types';
import { ICONS, type IconType } from './assets/icons';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// ICONS imported from './assets/icons'

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

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

  const isTopCard = (card: Card): boolean => {
    const cardsAbove = cards.filter(c => 
      c.x === card.x && 
      c.y === card.y && 
      c.z > card.z &&
      c.visible
    );
    return cardsAbove.length === 0;
  };

  const handleCardClick = (clickedCard: Card) => {
    if (!clickedCard.visible || !isTopCard(clickedCard) || gameStatus !== 'playing') return;

    const newCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, selected: true } : card
    );
    
    const newSelected = [...selectedCards, clickedCard];
    
    if (newSelected.length === 3) {
      if (newSelected.every(card => card.type === newSelected[0].type)) {
        // Match found - remove cards and update visibility
        const removedIds = new Set(newSelected.map(card => card.id));
        const updatedCards = cards.map(card => {
          if (removedIds.has(card.id)) {
            return { ...card, visible: false, selected: false };
          }
          // Only reveal cards from the layer directly below any removed card
          if (!card.visible) {
            const removedCardsAbove = newSelected.filter(c => 
              c.x === card.x && 
              c.y === card.y && 
              c.z > card.z &&
              removedIds.has(c.id)
            );
            const isDirectlyBelow = removedCardsAbove.some(c => c.z === card.z + 1);
            if (isDirectlyBelow) {
              return { ...card, visible: true };
            }
          }
          return card;
        });
        setCards(updatedCards);
        setSelectedCards([]);

        // Check win condition
        const remainingVisibleCards = updatedCards.filter(c => c.visible);
        if (remainingVisibleCards.length === 0) {
          setGameStatus('won');
        } else {
          // Check for possible matches
          const hasMatch = remainingVisibleCards.some(card1 =>
            remainingVisibleCards.filter(c => c.type === card1.type).length >= 3
          );
          if (!hasMatch) {
            setGameStatus('lost');
          }
        }
      } else {
        // No match - deselect all
        setCards(cards.map(card => ({ ...card, selected: false })));
        setSelectedCards([]);
      }
    } else {
      setCards(newCards);
      setSelectedCards(newSelected);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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

        <div className="flex justify-center mb-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            重新开始游戏
          </button>
        </div>

        <div className="relative w-full h-screen py-8">
          {cards
            .filter(card => card.visible)
            .map(card => {
              const Icon = ICONS[card.type as keyof typeof ICONS];
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  style={{
                    position: 'absolute',
                    left: `${card.x * 60}px`,
                    top: `${card.y * 60}px`,
                    transform: `translate(${card.z * 2}px, ${card.z * 2}px)`,
                    zIndex: card.z
                  }}
                  className={`p-4 rounded-xl shadow-xl transition-all ${
                    card.selected 
                      ? 'bg-blue-200 ring-4 ring-blue-500 scale-95' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  disabled={gameStatus !== 'playing'}
                >
                  <Icon className="w-8 h-8" />
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App
