import React from 'react';
import type { CardData } from '../types';

interface CardProps {
    cardData: CardData;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
    level: number;
}

const Card: React.FC<CardProps> = ({ cardData, isFlipped, isMatched, onClick, level }) => {
    const { type, content, image, audio, word } = cardData;

    const isRevealed = isFlipped || isMatched;

    const handleCardClick = () => {
        if (!isRevealed) {
            onClick();
        }
    };
    
    const handleAudioClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audio) {
            const audioEl = new Audio(audio);
            audioEl.play().catch(err => console.error("Audio play failed:", err));
        }
    };

    const getCardContent = () => {
        switch (type) {
            case 'image':
                return (
                    <div className="relative w-full h-full">
                        <img src={image} alt={content} className="w-full h-full object-contain" />
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
            className={`relative w-full h-full cursor-pointer transition-all duration-300
                ${isMatched ? 'opacity-50 cursor-default' : 'hover:-translate-y-2 hover:shadow-2xl'}
                ${level === 1 ? 'rounded-none' : 'rounded-lg'}
            `}
            onClick={handleCardClick}
        >
            {isRevealed ? (
                <div className="w-full h-full rounded-lg flex items-center justify-center p-2 box-border bg-gray-200 text-gray-800">
                    {getCardContent()}
                </div>
            ) : (
                <div className="w-full h-full rounded-lg flex items-center justify-center p-2 box-border bg-indigo-500 text-white text-3xl md:text-5xl font-bold">
                    ?
                </div>
            )}
        </div>
    );
};

export default Card;