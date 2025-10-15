import React from 'react';

interface SentenceCompletionProps {
    sentence: string;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    feedback: 'correct' | 'incorrect' | null;
}

const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ sentence, onDrop, onDragOver, feedback }) => {
    const parts = sentence.split('___');

    const getBorderColor = () => {
        if (feedback === 'correct') return 'border-green-500';
        if (feedback === 'incorrect') return 'border-red-500';
        return 'border-dashed border-white/50';
    };

    return (
        <div className="w-full h-full p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg animate-boardFloat flex flex-col items-center justify-center text-center">
             <h2 className="text-xl font-bold text-indigo-200 mb-6">Complete a Frase:</h2>
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className={`w-full max-w-2xl bg-black/20 p-6 md:p-8 rounded-lg text-2xl md:text-3xl lg:text-4xl text-white font-serif italic border-2 transition-all duration-300 ${getBorderColor()}`}
            >
                <span>{parts[0]}</span>
                <span className={`inline-block bg-black/30 rounded-md px-4 min-w-[150px] mx-2 text-gray-400 ${getBorderColor()}`}>
                    {feedback === 'correct' ? '✓' : '...'}
                </span>
                <span>{parts[1]}</span>
            </div>
            {feedback === 'incorrect' && (
                <p className="mt-4 text-red-400 font-bold animate-pulse">Tente novamente!</p>
            )}
        </div>
    );
};

export default SentenceCompletion;
