import React, { useState, useEffect, useRef } from 'react';
import type { Word } from '../types';

interface CrosswordProps {
    words: Word[];
    onGuess: (wordId: number, guess: string) => void;
    letterStatuses: Record<number, ('correct' | 'present' | 'absent' | 'neutral')[]>;
    solvedWords: number[];
}

const Crossword: React.FC<CrosswordProps> = ({ words, onGuess, letterStatuses, solvedWords }) => {
    const [guesses, setGuesses] = useState<Record<number, string[]>>({});
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        const initialGuesses: Record<number, string[]> = {};
        words.forEach(word => {
            initialGuesses[word.id] = Array(word.word.length).fill('');
        });
        setGuesses(initialGuesses);
    }, [words]);

    const handleAudioPlay = (audioSrc: string) => {
        const audio = new Audio(audioSrc);
        audio.play().catch(err => console.error("Audio playback failed:", err));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, wordId: number, letterIndex: number) => {
        if (solvedWords.includes(wordId)) return;
        const char = e.target.value.toUpperCase().slice(-1);
        const newGuesses = { ...guesses };
        newGuesses[wordId][letterIndex] = char;
        setGuesses(newGuesses);

        const currentGuess = newGuesses[wordId].join('');
        const wordLength = words.find(w => w.id === wordId)!.word.length;
        
        if (currentGuess.length === wordLength) {
            onGuess(wordId, currentGuess);
        }

        if (char && letterIndex < wordLength - 1) {
            inputRefs.current[`${wordId}-${letterIndex + 1}`]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, wordId: number, letterIndex: number) => {
        if (e.key === 'Backspace' && !guesses[wordId][letterIndex] && letterIndex > 0) {
            inputRefs.current[`${wordId}-${letterIndex - 1}`]?.focus();
        }
    };

    const handleRetryWord = (wordId: number) => {
        const isEvaluated = letterStatuses[wordId]?.some(s => s !== 'neutral');
        if (!solvedWords.includes(wordId) && isEvaluated) {
            const wordLength = words.find(w => w.id === wordId)!.word.length;
            setGuesses(prev => ({ ...prev, [wordId]: Array(wordLength).fill('') }));
            // The parent will clear the letter statuses when a new guess is made
            inputRefs.current[`${wordId}-0`]?.focus();
        }
    };

    const getLetterStatusColor = (status: 'correct' | 'present' | 'absent' | 'neutral') => {
        switch (status) {
            case 'correct': return 'bg-green-500 border-green-400 text-white';
            case 'present': return 'bg-yellow-500 border-yellow-400 text-white';
            case 'absent': return 'bg-gray-600 border-gray-500 text-white';
            default: return 'bg-black/30 border-white/20 text-white';
        }
    };

    return (
        <div className="w-full h-full p-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg animate-boardFloat flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-200 mb-4">Nível 4: Palavras Cruzadas</h2>
            <div className="w-full overflow-y-auto space-y-4 pr-2">
                {words.map((word, index) => (
                    <div key={word.id} className="flex items-center gap-2 md:gap-4 p-2 bg-black/20 rounded-lg">
                        <span className="font-bold text-lg">{index + 1}.</span>
                        <button
                            onClick={() => handleAudioPlay(word.audio)}
                            className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors text-white"
                            aria-label={`Ouvir a palavra para a dica ${index + 1}`}
                        >
                            <span className="text-3xl md:text-4xl">🔊</span>
                        </button>
                        <div className="flex gap-1">
                            {guesses[word.id]?.map((char, letterIndex) => (
                                <input
                                    key={letterIndex}
                                    ref={el => (inputRefs.current[`${word.id}-${letterIndex}`] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={char}
                                    onChange={(e) => handleInputChange(e, word.id, letterIndex)}
                                    onKeyDown={(e) => handleKeyDown(e, word.id, letterIndex)}
                                    onClick={() => handleRetryWord(word.id)}
                                    disabled={solvedWords.includes(word.id)}
                                    className={`w-8 h-8 md:w-10 md:h-10 text-center text-white font-bold text-xl rounded-md transition-colors duration-300 ${getLetterStatusColor(letterStatuses[word.id]?.[letterIndex] ?? 'neutral')}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Crossword;