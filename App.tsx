import React, { useState, useEffect, useCallback } from 'react';
import type { CardData, GameMode, Message, Word } from './types';
import { WORDS } from './constants';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import ControlsPanel from './components/ControlsPanel';
import PlayerIndicator from './components/PlayerIndicator';
import MessageModal from './components/MessageModal';
import Crossword from './components/Crossword';
import WordBank from './components/WordBank';
import SentenceCompletion from './components/SentenceCompletion';

const App: React.FC = () => {
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [gameMode, setGameMode] = useState<GameMode>('solo');
    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedCardIndices, setFlippedCardIndices] = useState<number[]>([]);
    const [matchedCardIds, setMatchedCardIds] = useState<number[]>([]);
    const [moves, setMoves] = useState<number>(0);
    const [timer, setTimer] = useState<number>(0);
    const [timerActive, setTimerActive] = useState<boolean>(false);
    const [lockBoard, setLockBoard] = useState<boolean>(false);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [scores, setScores] = useState<{ 1: number; 2: number }>({ 1: 0, 2: 0 });
    const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1, 2, 3, 4]);
    const [message, setMessage] = useState<Message | null>(null);
    const [gameFinished, setGameFinished] = useState<boolean>(false);

    // State for Level 4
    const [level4Phase, setLevel4Phase] = useState<'sentences' | 'crossword'>('sentences');
    const [completedWords, setCompletedWords] = useState<number[]>([]); // For sentence phase
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [sentenceFeedback, setSentenceFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [draggedWordId, setDraggedWordId] = useState<number | null>(null);
    // State for Crossword moved up from component for multi-player
    const [letterStatuses, setLetterStatuses] = useState<Record<number, ('correct' | 'present' | 'absent' | 'neutral')[]>>({});
    const [solvedWords, setSolvedWords] = useState<number[]>([]); // For crossword phase
    
    const shuffle = <T,>(array: T[]): T[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const wordsForLevel = React.useMemo(() => WORDS.slice(0, 6), []);
    const sentencesForLevel = React.useMemo(() => shuffle(wordsForLevel), [wordsForLevel]);

    const renderLevel4 = () => {
        if (level4Phase === 'sentences') {
            return (
                <>
                    <SentenceCompletion 
                        sentence={sentencesForLevel[currentSentenceIndex].example.replace(
                            new RegExp(sentencesForLevel[currentSentenceIndex].word, 'i'), 
                            '___'
                        )}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        feedback={sentenceFeedback}
                    />
                     <WordBank
                        words={wordsForLevel}
                        completedWords={completedWords}
                        onDragStart={handleDragStart}
                    />
                </>
            );
        }
        if (level4Phase === 'crossword') {
             return (
                <div className="w-full h-full flex items-center justify-center">
                    <Crossword 
                        words={wordsForLevel}
                        onGuess={handleCrosswordGuess}
                        letterStatuses={letterStatuses}
                        solvedWords={solvedWords}
                    />
                </div>
            )
        }
        return null;
    }

    const startGame = useCallback(() => {
        setFlippedCardIndices([]);
        setMatchedCardIds([]);
        setMoves(0);
        setTimer(0);
        setTimerActive(true);
        setLockBoard(false);
        setCurrentPlayer(1);
        setScores({ 1: 0, 2: 0 });
        setMessage(null);
        setGameFinished(false);

        // Reset Level 4 specific state
        if (currentLevel === 4) {
            setLevel4Phase('sentences');
            setCompletedWords([]);
            setCurrentSentenceIndex(0);
            setSentenceFeedback(null);
            setSolvedWords([]);
            const initialLetterStatuses: Record<number, ('neutral')[]> = {};
            wordsForLevel.forEach(word => {
                initialLetterStatuses[word.id] = Array(word.word.length).fill('neutral');
            });
            setLetterStatuses(initialLetterStatuses);
        }

        let newCards: CardData[] = [];

        if (currentLevel === 1) {
            wordsForLevel.forEach(word => {
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'image', content: word.word, image: word.image });
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'audio', content: word.word, audio: word.audio });
            });
        } else if (currentLevel === 2) {
            wordsForLevel.forEach(word => {
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'image', content: word.word, image: word.image });
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'definition', content: word.meaning, word: word.word });
            });
        } else if (currentLevel === 3) {
            wordsForLevel.forEach(word => {
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'image', content: word.word, image: word.image });
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'audio', content: word.word, audio: word.audio });
                newCards.push({ id: word.id, uniqueId: Math.random(), type: 'definition', content: word.meaning, word: word.word });
            });
        }
        setCards(shuffle(newCards));
    }, [currentLevel, wordsForLevel]);
    
    useEffect(() => {
        startGame();
    }, [currentLevel, gameMode, startGame]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive]);

    // Effect to check for matches in memory games
    useEffect(() => {
        const checkCount = currentLevel === 3 ? 3 : 2;
        if (flippedCardIndices.length !== checkCount) return;

        setLockBoard(true);
        setMoves(prev => prev + 1);
        const flipped = flippedCardIndices.map(index => cards[index]);
        const isMatch = flipped.every(card => card.id === flipped[0].id);

        const timeoutId = setTimeout(() => {
            if (isMatch) {
                setMatchedCardIds(prev => [...prev, flipped[0].id]);
                const wordData = wordsForLevel.find(w => w.id === flipped[0].id);
                if (gameMode === 'pair') {
                    setScores(prev => ({...prev, [currentPlayer]: prev[currentPlayer] + 1}));
                }
                setMessage({
                    type: currentLevel === 3 ? 'triad' : 'match',
                    title: gameMode === 'pair' ? `🎉 PARABÉNS JOGADOR ${currentPlayer}!` : '🎉 PARABÉNS!',
                    content: currentLevel === 3 ? 'Você encontrou uma tríade!' : 'Você encontrou um par!',
                    wordData: wordData
                });
            } else {
                if (gameMode === 'pair') {
                    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
                }
            }
            setFlippedCardIndices([]);
            setLockBoard(false);
        }, 3200);

        return () => clearTimeout(timeoutId);

    }, [flippedCardIndices, cards, currentLevel, gameMode, currentPlayer, wordsForLevel]);
    
    useEffect(() => {
        const totalPairs = 6;
        if (matchedCardIds.length === totalPairs && currentLevel < 4 && !gameFinished) {
            setGameFinished(true);
            setTimerActive(false);

            setUnlockedLevels(prev => [...new Set([...prev, currentLevel + 1])].sort());

            setTimeout(() => {
                const accuracy = moves > 0 ? Math.round((totalPairs / moves) * 100) : 0;
                 setMessage({
                    type: 'end_level',
                    title: `🎉 NÍVEL ${currentLevel} COMPLETO! 🎉`,
                    content: (
                        <div>
                            <p>Você dominou o desafio!</p>
                            <div className="mt-4 text-left bg-gray-200/50 p-3 rounded-lg">
                                <p><strong>⏱️ Tempo:</strong> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                                <p><strong>🎯 Movimentos:</strong> {moves}</p>
                                <p><strong>🎪 Precisão:</strong> {accuracy}%</p>
                            </div>
                        </div>
                    )
                });
            }, 500);
        }
    }, [matchedCardIds, gameFinished, moves, timer, currentLevel]);

    // LEVEL 4 - Phase 1 (Sentences) Completion Check
    useEffect(() => {
        if (currentLevel === 4 && completedWords.length === wordsForLevel.length && level4Phase === 'sentences') {
            setLockBoard(true);
            setTimeout(() => {
                setMessage({
                    type: 'final_challenge_intro',
                    title: '🏆 Desafio Final se Aproxima! 🏆',
                    content: 'Você usou as palavras em contexto. Agora, o teste final de ortografia e memória aguarda. Prepare-se!',
                    buttonText: '🔥 Começar o Teste Final!',
                });
            }, 500);
        }
    }, [completedWords, currentLevel, level4Phase, wordsForLevel.length]);


    // LEVEL 4 - Phase 2 (Crossword) Completion Check
    useEffect(() => {
        if (currentLevel === 4 && solvedWords.length === wordsForLevel.length && !gameFinished) {
            setGameFinished(true);
            setTimerActive(false);
            setTimeout(() => {
                 setMessage({
                    type: 'end_game',
                    title: `🎉 JOGO CONCLUÍDO! 🎉`,
                    content: (
                        <div className="text-yellow-500 animate-pulse">
                            <p className="text-xl">VOCÊ É UM MESTRE DAS PALAVRAS!</p>
                        </div>
                    ),
                    scores: gameMode === 'pair' ? scores : undefined,
                });
            }, 500);
        }
    }, [solvedWords, currentLevel, gameFinished, wordsForLevel.length, scores, gameMode]);


    const handleCardClick = (index: number) => {
        if (lockBoard || flippedCardIndices.includes(index) || matchedCardIds.includes(cards[index].id)) return;
        
        const card = cards[index];
        if (card.audio) {
            const audio = new Audio(card.audio);
            audio.play().catch(err => console.error("Audio play failed:", err));
        }
        
        const checkCount = currentLevel === 3 ? 3 : 2;
        if (flippedCardIndices.length < checkCount) {
            setFlippedCardIndices(prev => [...prev, index]);
        }
    };
    
    const handleNextLevel = () => {
        if (message?.type === 'final_challenge_intro') {
            setLevel4Phase('crossword');
            setLockBoard(false);
        } else if (currentLevel < 4) {
            setCurrentLevel(prev => prev + 1);
        }
        setMessage(null);
    }

    const handleRestartGame = () => {
        setMessage(null);
        setCurrentLevel(1);
    }

    // Level 4 Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, wordId: number) => {
        setDraggedWordId(wordId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const correctWordId = sentencesForLevel[currentSentenceIndex].id;

        if (draggedWordId === correctWordId) {
            setCompletedWords(prev => [...prev, draggedWordId]);
            setSentenceFeedback('correct');
            if (gameMode === 'pair') {
                setScores(prev => ({...prev, [currentPlayer]: prev[currentPlayer] + 1}));
                setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
            }
            setTimeout(() => {
                if(currentSentenceIndex < sentencesForLevel.length - 1) {
                    setCurrentSentenceIndex(prev => prev + 1);
                }
                setSentenceFeedback(null);
            }, 1000);
        } else {
            setSentenceFeedback('incorrect');
            if (gameMode === 'pair') {
                setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
            }
            setTimeout(() => setSentenceFeedback(null), 1000);
        }
        setDraggedWordId(null);
    };
    
    const handleCrosswordGuess = (wordId: number, guess: string) => {
        const correctWord = wordsForLevel.find(w => w.id === wordId)!.word.toUpperCase();
        const newLetterStatuses: ('correct' | 'present' | 'absent')[] = Array(correctWord.length).fill('absent');
        const correctWordLetterCounts: Record<string, number> = {};

        for (const letter of correctWord) {
            correctWordLetterCounts[letter] = (correctWordLetterCounts[letter] || 0) + 1;
        }

        for (let i = 0; i < correctWord.length; i++) {
            if (guess[i] === correctWord[i]) {
                newLetterStatuses[i] = 'correct';
                correctWordLetterCounts[guess[i]]--;
            }
        }

        for (let i = 0; i < correctWord.length; i++) {
            if (newLetterStatuses[i] !== 'correct' && correctWordLetterCounts[guess[i]] > 0) {
                newLetterStatuses[i] = 'present';
                correctWordLetterCounts[guess[i]]--;
            }
        }

        setLetterStatuses(prev => ({ ...prev, [wordId]: newLetterStatuses }));
        
        const isWordCorrect = newLetterStatuses.every(status => status === 'correct');
        if (isWordCorrect) {
            setSolvedWords(prev => {
                if (!prev.includes(wordId)) {
                    if (gameMode === 'pair') {
                        setScores(s => ({...s, [currentPlayer]: s[currentPlayer] + 1}));
                    }
                    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
                    return [...prev, wordId];
                }
                return prev;
            });
        } else {
            if (gameMode === 'pair') {
                setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
            }
        }
    };


    const accuracy = moves > 0 ? Math.round((matchedCardIds.length / moves) * 100) : 0;

    const customStyles = `
        @keyframes panelFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
        @keyframes boardFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        @keyframes messagePulse { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes playerIndicatorPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    `;


    return (
        <div className="bg-gradient-to-br from-gray-800 via-purple-900 to-indigo-900 min-h-screen text-white flex flex-col font-sans">
            <style>{customStyles}</style>
            <Header currentLevel={currentLevel} />
            <main className="flex-grow flex flex-col lg:flex-row gap-5 p-2.5 lg:p-5 items-stretch">
                
                {currentLevel === 4 ? (
                    <div className="relative flex-grow flex flex-col lg:flex-row gap-5 items-stretch">
                       {gameMode === 'pair' && <PlayerIndicator currentPlayer={currentPlayer} scores={scores} />}
                       {renderLevel4()}
                    </div>
                ) : (
                    <div className="relative flex-grow flex items-center justify-center">
                        {gameMode === 'pair' && <PlayerIndicator currentPlayer={currentPlayer} scores={scores} />}
                        <GameBoard 
                            cards={cards}
                            flippedCardIndices={flippedCardIndices}
                            matchedCardIds={matchedCardIds}
                            onCardClick={handleCardClick}
                            currentLevel={currentLevel}
                        />
                    </div>
                )}


                <ControlsPanel 
                    gameMode={gameMode}
                    setGameMode={setGameMode}
                    currentLevel={currentLevel}
                    setCurrentLevel={setCurrentLevel}
                    unlockedLevels={unlockedLevels}
                    moves={moves}
                    timer={timer}
                    accuracy={accuracy}
                    onRestart={startGame}
                />
            </main>
            <MessageModal 
                message={message} 
                onClose={() => setMessage(null)} 
                onNextLevel={
                    ( (message?.type === 'end_level' && currentLevel < 4) || message?.type === 'final_challenge_intro' ) 
                    ? handleNextLevel 
                    : undefined
                }
                onRestart={(message?.type === 'end_game') ? handleRestartGame : undefined}
            />
        </div>
    );
};

export default App;