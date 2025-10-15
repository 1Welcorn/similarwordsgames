
import React from 'react';

interface GameStatsProps {
    moves: number;
    timer: number;
    accuracy: number;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center flex-1 min-w-0 px-1">
        <div className="text-xs text-gray-300 mb-0.5 truncate">{label}</div>
        <div className="text-base font-bold text-white truncate">{value}</div>
    </div>
);

const GameStats: React.FC<GameStatsProps> = ({ moves, timer, accuracy }) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="bg-white/10 p-2 rounded-lg shadow-inner flex justify-around items-center w-full gap-2">
            <StatItem label="Movimentos" value={moves} />
            <StatItem label="Tempo" value={formatTime(timer)} />
            <StatItem label="Precisão" value={`${accuracy}%`} />
        </div>
    );
};

export default GameStats;
