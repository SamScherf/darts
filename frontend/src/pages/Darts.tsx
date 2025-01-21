import React from 'react';
import { GameConfig } from '../componets/GameConfig';
import { DartGameTracker } from '../componets/DartGameTracker';

interface DartsProps {
    password: string
}
export const Darts: React.FC<DartsProps> = ({ password }) => {
    const [ready, setReady] = React.useState<Boolean>(false);
    const [playerOne, setPlayerOne] = React.useState<string | undefined>(undefined);
    const [playerTwo, setPlayerTwo] = React.useState<string | undefined>(undefined);

    const handleStartGame = React.useCallback(() => setReady(true), [setReady])

    return ready && playerOne != null && playerTwo != null ? (
        <DartGameTracker playerOne={playerOne} playerTwo={playerTwo} />
    ) : (
        <GameConfig startGame={handleStartGame} onSavePlayerOne={setPlayerOne} onSavePlayerTwo={setPlayerTwo} password={password} />
    )
}