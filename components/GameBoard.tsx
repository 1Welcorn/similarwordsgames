import React from 'react';
import type { CardData } from '../types';
import Card from './Card';

interface GameBoardProps {
    cards: CardData[];
    flippedCardIndices: number[];
    matchedCardIds: number[];
    onCardClick: (index: number) => void;
    currentLevel: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, flippedCardIndices, matchedCardIds, onCardClick, currentLevel }) => {
    
    const boardLayoutClasses: Record<number, string> = {
        1: 'grid-cols-6 grid-rows-2 gap-0 p-0',
        2: 'grid-cols-4 md:grid-cols-6 gap-2 md:gap-4',
        3: 'grid-cols-3 md:grid-cols-6 grid-rows-3 gap-1 md:gap-2',
        4: 'grid-cols-4 md:grid-cols-6 gap-2 md:gap-4',
    };

    const cardAspectRatio: Record<number, string> = {
        1: 'aspect-auto',
        2: 'aspect-auto',
        3: 'aspect-auto',
        4: 'aspect-[3/4]',
    }

    return (
        <div className={`w-full h-full p-2.5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg animate-boardFloat box-border`}>
            <div className={`grid h-full w-full ${boardLayoutClasses[currentLevel]}`}>
                {cards.map((card, index) => (
                    <div key={card.uniqueId} className={`${cardAspectRatio[currentLevel]}`}>
                        <Card
                            cardData={card}
                            isFlipped={flippedCardIndices.includes(index)}
                            isMatched={matchedCardIds.includes(card.id)}
                            onClick={() => onCardClick(index)}
                            level={currentLevel}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;