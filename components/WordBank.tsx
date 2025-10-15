import React from 'react';
import type { Word } from '../types';

interface WordBankProps {
    words: Word[];
    completedWords: number[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, wordId: number) => void;
}

const WordBank: React.FC<WordBankProps> = ({ words, completedWords, onDragStart }) => {
    return (
        <div className="w-full lg:w-[280px] lg:max-w-[280px] shrink-0 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col gap-3 animate-panelFloat">
            <h2 className="text-center font-bold text-white text-lg">Banco de Palavras</h2>
            <div className="flex flex-col gap-2">
                {words.map(word => {
                    const isCompleted = completedWords.includes(word.id);
                    return (
                        <div
                            key={word.id}
                            draggable={!isCompleted}
                            onDragStart={(e) => onDragStart(e, word.id)}
                            className={`p-3 rounded-lg text-center font-semibold transition-all duration-300
                                ${isCompleted
                                    ? 'bg-gray-500/50 text-gray-400 line-through'
                                    : 'bg-indigo-500 text-white cursor-grab hover:bg-indigo-600 hover:scale-105'
                                }
                            `}
                        >
                            {word.word}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WordBank;
