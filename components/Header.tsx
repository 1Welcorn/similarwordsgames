import React from 'react';
import { LEVEL_NAMES } from '../constants';

interface HeaderProps {
    currentLevel: number;
}

const Header: React.FC<HeaderProps> = ({ currentLevel }) => {
    return (
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-2 text-white">
            <div></div>
            <h1 className="text-xl md:text-2xl font-bold text-center whitespace-nowrap">
                Desafio de Palavras: 4 Níveis de Aprendizado
            </h1>
            <div className="flex justify-end">
                <div className="bg-green-500 text-white py-1.5 px-3 rounded-full font-bold text-sm md:text-base whitespace-nowrap">
                    {LEVEL_NAMES[currentLevel]}
                </div>
            </div>
        </header>
    );
};

export default Header;