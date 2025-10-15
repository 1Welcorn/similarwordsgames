import type { ReactNode } from 'react';

export interface Word {
    id: number;
    word: string;
    type: string;
    meaning: string;
    image: string;
    audio: string;
    example: string;
}

export type CardType = 'image' | 'audio' | 'definition' | 'word';

export interface CardData {
    id: number;
    uniqueId: number;
    type: CardType;
    content: string;
    image?: string;
    audio?: string;
    word?: string;
}

export type GameMode = 'solo' | 'pair';

export type GameState = 'playing' | 'paused' | 'finished';

export interface Message {
    type: 'match' | 'triad' | 'end_level' | 'info' | 'start_level_3' | 'end_game' | 'final_challenge_intro';
    title: string;
    content: ReactNode;
    wordData?: Word;
    buttonText?: string;
    scores?: { 1: number; 2: number };
}