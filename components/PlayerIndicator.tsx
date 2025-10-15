
import React from 'react';

interface PlayerIndicatorProps {
    currentPlayer: 1 | 2;
    scores: { 1: number; 2: number };
}

const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ currentPlayer, scores }) => {
    return (
        <div className="absolute top-5 left-5 bg-yellow-200 border-2 border-yellow-400 p-4 rounded-xl shadow-lg z-20 text-yellow-800 animate-playerIndicatorPulse">
            <div className="font-bold text-lg text-center mb-2">Vez do Jogador {currentPlayer}</div>
            <div className="text-sm space-y-1">
                <div className="font-semibold text-green-700">Jogador 1: {scores[1]} pontos</div>
                <div className="font-semibold text-blue-700">Jogador 2: {scores[2]} pontos</div>
            </div>
        </div>
    );
};

export default PlayerIndicator;
