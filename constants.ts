import React from 'react';
import type { Word } from './types';

export const WORDS: Word[] = [
    {
        id: 1,
        word: "Through",
        type: "Preposição",
        meaning: "Através de (movimento ou tempo).",
        image: "https://raw.githubusercontent.com/1Welcorn/assetsforsimilarwordsmemorygames/main/through.png",
        audio: "https://cdn.jsdelivr.net/gh/1Welcorn/assetsforsimilarwordsmemorygames@main/through.wav",
        example: "I walked through the forest."
    },
    {
        id: 2,
        word: "Though",
        type: "Conjunção",
        meaning: "Embora, apesar de.",
        image: "https://raw.githubusercontent.com/1Welcorn/assetsforsimilarwordsmemorygames/main/though.png",
        audio: "https://cdn.jsdelivr.net/gh/1Welcorn/assetsforsimilarwordsmemorygames@main/though.wav",
        example: "Though it's raining, I'll go out."
    },
    {
        id: 3,
        word: "Tough",
        type: "Adjetivo",
        meaning: "Difícil, resistente, corajoso.",
        image: "https://raw.githubusercontent.com/1Welcorn/assetsforsimilarwordsmemorygames/main/tough.png",
        audio: "https://cdn.jsdelivr.net/gh/1Welcorn/assetsforsimilarwordsmemorygames@main/tough.wav",
        example: "This exam was really tough."
    },
    {
        id: 4,
        word: "Thought",
        type: "Substantivo/Verbo",
        meaning: "Pensamento ou passado de 'Think'.",
        image: "https://raw.githubusercontent.com/1Welcorn/assetsforsimilarwordsmemorygames/main/thought.png",
        audio: "https://cdn.jsdelivr.net/gh/1Welcorn/assetsforsimilarwordsmemorygames@main/thought.wav",
        example: "I thought about you yesterday."
    },
    {
        id: 5,
        word: "Thorough",
        type: "Adjetivo",
        meaning: "Minucioso, detalhado, completo.",
        image: "https://raw.githubusercontent.com/1Welcorn/assetsforsimilarwordsmemorygames/main/thorough.png",
        audio: "https://cdn.jsdelivr.net/gh/1Welcorn/assetsforsimilarwordsmemorygames@main/thorough.wav",
        example: "She did a thorough investigation."
    },
    {
        id: 6,
        word: "Throughout",
        type: "Preposição/Advérbio",
        meaning: "Por toda parte, durante todo (o tempo).",
        image: "https://raw.githubusercontent.com/1Welcorn/assetsforsimilarwordsmemorygames/main/throughout.png",
        audio: "https://cdn.jsdelivr.net/gh/1Welcorn/assetsforsimilarwordsmemorygames@main/throughout.wav",
        example: "It rained throughout the day."
    }
];

export const LEVEL_DESCRIPTIONS: Record<number, React.ReactNode> = {
    1: React.createElement('p', null, React.createElement('strong', null, 'Nível 1:'), ' Combine as imagens com seus áudios correspondentes (6 pares). Clique no ícone 🎧 para ouvir a pronúncia.'),
    2: React.createElement('p', null, React.createElement('strong', null, 'Nível 2:'), ' Combine as imagens com suas definições.'),
    3: React.createElement('p', null, React.createElement('strong', null, 'Nível 3:'), ' Encontre as 6 tríades completas: Áudio + Definição + Imagem.'),
    4: React.createElement('p', null, React.createElement('strong', null, 'Nível 4:'), ' Complete as frases e depois as palavras cruzadas. Dica: as cores nas letras te ajudarão a acertar!')
};

export const LEVEL_NAMES: Record<number, string> = {
    1: 'Nível 1: Imagem + Áudio',
    2: 'Nível 2: Imagem + Definição',
    3: 'Nível 3: Áudio + Definição + Imagem',
    4: 'Nível 4: Desafio Final'
};