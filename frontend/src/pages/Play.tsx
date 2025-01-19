import React from 'react';
import { GameConfig } from '../componets/GameConfig.tsx';
import { DartGameTracker } from '../componets/DartGameTracker.tsx';

export const Play: React.FC = () => {
    const [ready, setReady] = React.useState<Boolean>(false);
    const [playerOne, setPlayerOne] = React.useState<string | undefined>(undefined);
    const [playerTwo, setPlayerTwo] = React.useState<string | undefined>(undefined);

    const handleStartGame = React.useCallback(() => setReady(true), [setReady])

    return ready && playerOne != null && playerTwo != null ? (
        <DartGameTracker playerOne={playerOne} playerTwo={playerTwo} />
    ) : (
        <GameConfig startGame={handleStartGame} onSavePlayerOne={setPlayerOne} onSavePlayerTwo={setPlayerTwo} />
    )
}