import React from 'react';
import type { GameMode } from '../types';
import { LEVEL_DESCRIPTIONS } from '../constants';
import GameStats from './GameStats';

interface ControlsPanelProps {
    gameMode: GameMode;
    setGameMode: (mode: GameMode) => void;
    currentLevel: number;
    setCurrentLevel: (level: number) => void;
    unlockedLevels: number[];
    moves: number;
    timer: number;
    accuracy: number;
    onRestart: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
    gameMode,
    setGameMode,
    currentLevel,
    setCurrentLevel,
    unlockedLevels,
    moves,
    timer,
    accuracy,
    onRestart,
}) => {
    const handleLevelClick = (level: number) => {
        if (unlockedLevels.includes(level)) {
            setCurrentLevel(level);
        }
    };

    return (
        <div className="w-full lg:w-[280px] lg:max-w-[280px] shrink-0 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg animate-panelFloat flex flex-col max-h-[calc(100vh-120px)] lg:max-h-full">
            <div className="text-center font-semibold text-white p-3 rounded-t-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
                🎮 Controles do Jogo
            </div>
            <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                <div>
                    <div className="flex justify-center bg-black/20 p-1 rounded-full">
                        <button
                            onClick={() => setGameMode('solo')}
                            className={`w-full py-1.5 text-sm font-bold rounded-full transition-all duration-300 ${gameMode === 'solo' ? 'bg-green-500 text-white' : 'text-gray-200 hover:bg-white/20'}`}
                        >
                            Solo
                        </button>
                        <button
                            onClick={() => setGameMode('pair')}
                            className={`w-full py-1.5 text-sm font-bold rounded-full transition-all duration-300 ${gameMode === 'pair' ? 'bg-green-500 text-white' : 'text-gray-200 hover:bg-white/20'}`}
                        >
                            Dupla
                        </button>
                    </div>
                </div>

                <div className="p-3 bg-white/10 rounded-lg shadow-inner">
                    <h3 className="text-center text-sm font-bold text-white mb-2">Escolha o Nível</h3>
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3, 4].map(level => (
                            <button
                                key={level}
                                onClick={() => handleLevelClick(level)}
                                disabled={!unlockedLevels.includes(level)}
                                className={`w-full py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center min-h-[40px]
                                ${currentLevel === level ? 'bg-green-500 text-white scale-105 shadow-lg' : ''}
                                ${unlockedLevels.includes(level) ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/20 text-gray-400 cursor-not-allowed opacity-60'}`}
                            >
                                {unlockedLevels.includes(level) ? `Nível ${level}` : `🔒 Nível ${level}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-3 text-center text-xs text-indigo-200 bg-blue-900/30 rounded-lg min-h-[70px] flex items-center justify-center">
                    {LEVEL_DESCRIPTIONS[currentLevel]}
                </div>

                <GameStats moves={moves} timer={timer} accuracy={accuracy} />
                
                <button onClick={onRestart} className="w-full bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-300 shadow-md">
                    Novo Jogo
                </button>
            </div>
        </div>
    );
};

export default ControlsPanel;