import React from 'react';
import type { CardData } from '../types';

interface CardProps {
    cardData: CardData;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: (uniqueId: number) => void;
    level: number;
}

const Card: React.FC<CardProps> = ({ cardData, isFlipped, isMatched, onClick, level }) => {
    const { uniqueId, type, content, image, audio, word } = cardData;

    const isRevealed = isFlipped || isMatched;
    const isSpecialCard = (level === 2 && type === 'definition') || (level === 3 && (type === 'audio' || type === 'definition'));

    const handleCardClick = () => {
        if (!isRevealed) {
            onClick(uniqueId);
        }
    };
    
    const handleAudioClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audio) {
            const audioEl = new Audio(audio);
            audioEl.play().catch(err => console.error("Audio play failed:", err));
        }
    };

    const cardBaseClasses = "card-face absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center p-2 box-border";

    const getCardBackContent = () => {
        switch (type) {
            case 'image':
                return (
                    <div className="relative w-full h-full">
                        <img src={image} alt={content} className="w-full h-full object-contain" />
                        {audio && (
                           <button onClick={handleAudioClick} className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-full z-10 hover:bg-black transition-colors">
                                🎧
                            </button>
                        )}
                    </div>
                );
            case 'audio':
                 return (
                    <div 
                        className="text-center w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onClick={handleAudioClick}
                    >
                        <span className="text-5xl md:text-7xl" aria-label="Play sound">🔊</span>
                        <p className="text-xs text-gray-500 mt-2">Clique para ouvir</p>
                    </div>
                );
            case 'definition':
                return (
                     <div className="text-center">
                        <p className="text-sm md:text-base text-gray-800">{content}</p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">({word})</p>
                    </div>
                );
            case 'word':
                 return (
                    <div className="text-center w-full h-full flex items-center justify-center">
                        <span className="text-xl md:text-3xl font-bold text-gray-800">{content}</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            className={`relative w-full h-full cursor-pointer transition-transform duration-500 preserve-3d
                ${isMatched ? 'opacity-50 cursor-default' : 'hover:-translate-y-2 hover:shadow-2xl'}
                ${level === 1 ? 'rounded-none' : 'rounded-lg'}
            `}
            onClick={handleCardClick}
        >
            <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isRevealed && !isSpecialCard ? 'rotate-y-180' : ''}`}>
                {/* Card Front */}
                <div className={`${cardBaseClasses} bg-indigo-500 text-white text-3xl md:text-5xl font-bold ${isRevealed ? (isSpecialCard ? 'hidden' : '') : ''}`}>
                    ?
                </div>
                {/* Card Back */}
                <div className={`${cardBaseClasses} bg-gray-200 text-gray-800 ${isSpecialCard ? '' : 'rotate-y-180'} ${isRevealed ? 'flex' : 'hidden'}`}>
                    {getCardBackContent()}
                </div>
            </div>
        </div>
    );
};

export default Card;