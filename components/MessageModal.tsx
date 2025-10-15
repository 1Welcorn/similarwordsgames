import React from 'react';
import type { Message } from '../types';

interface MessageModalProps {
    message: Message | null;
    onClose: () => void;
    onNextLevel?: () => void;
    onRestart?: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onClose, onNextLevel, onRestart }) => {
    if (!message) return null;

    const isActionModal = message.type === 'end_level' || message.type === 'end_game' || message.type === 'final_challenge_intro';
    const hasNextLevelAction = onNextLevel && (message.type === 'end_level' || message.type === 'final_challenge_intro');

    const handleNextLevelClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onNextLevel) {
            onNextLevel();
        }
    };

    const renderEndGameContent = () => {
        if (message.type === 'end_game' && message.scores) {
            const { scores } = message;
            let winnerTitle = '';
            if (scores[1] > scores[2]) {
                winnerTitle = '🏆 JOGADOR 1 VENCEU! 🏆';
            } else if (scores[2] > scores[1]) {
                winnerTitle = '🏆 JOGADOR 2 VENCEU! 🏆';
            } else {
                winnerTitle = '🤝 EMPATE! 🤝';
            }
            return (
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-4">{winnerTitle}</h2>
                    <div className="text-lg mb-6 bg-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
                        <p className="font-semibold text-green-700">Jogador 1: {scores[1]} pontos</p>
                        <p className="font-semibold text-blue-700">Jogador 2: {scores[2]} pontos</p>
                    </div>
                </div>
            );
        }
        // Default solo end game content
        return (
            <>
                <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">{message.title}</h2>
                <div className="text-base md:text-lg mb-6">{message.content}</div>
            </>
        );
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center"
        >
            <div 
                className={`relative bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-w-lg w-full text-center border-4 border-green-400 animate-messagePulse ${!isActionModal ? 'cursor-pointer' : ''}`}
                onClick={!isActionModal ? onClose : undefined}
            >
                {message.type === 'end_game' ? renderEndGameContent() : (
                    <>
                        <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">{message.title}</h2>
                        <div className="text-base md:text-lg mb-6">{message.content}</div>
                    </>
                )}


                {message.wordData && (
                    <div className="bg-green-100 p-4 rounded-lg border-2 border-green-200 mb-6">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">📚 Exemplo de uso:</h3>
                        <p className="text-lg italic text-green-700">"{message.wordData.example}"</p>
                    </div>
                )}
                
                {hasNextLevelAction && (
                    <button
                        onClick={handleNextLevelClick}
                        className="bg-green-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-green-600 transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                        {message.buttonText || '🎮 Iniciar Próximo Nível'}
                    </button>
                )}
                
                {message.type === 'end_game' && onRestart && (
                    <button
                        onClick={onRestart}
                        className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-yellow-600 transition-all duration-300 shadow-lg transform hover:scale-105 mt-4"
                    >
                        🏆 Jogar Novamente
                    </button>
                )}
                
                {!isActionModal && (
                     <p className="text-sm text-gray-500 mt-4 italic">Toque para continuar</p>
                )}
            </div>
        </div>
    );
};

export default MessageModal;