import { Button, Card } from '@blueprintjs/core';
import React from 'react';
import { Throw } from '../util/Throw.ts';

const STARTING_SCORE = 501;

interface DartGameTrackerProps {
    playerOne: string;
    playerTwo: string;
}
export const DartGameTracker: React.FC<DartGameTrackerProps> = ({playerOne, playerTwo}) => {
    const [playerOneThrows, setPlayerOneThrows] = React.useState<Throw[]>([])

    const playerOneScore = React.useMemo(() => {
        if (playerOneThrows.length === 0) {
            return STARTING_SCORE;
        }

        return STARTING_SCORE - 1;

    }, [playerOneThrows])

    const createHandleNewThrow = React.useCallback((value: number) => () => {
        setPlayerOneThrows(oldThrows => [...oldThrows, {value}])
    }, [setPlayerOneThrows])
    return (
        <div className="play">
            <div className="scores">
                <Card elevation={2}>
                    <div className="score-container">
                        <h2>{playerOneScore}</h2>
                        <p>{playerOne}</p>
                    </div>
                    <div>
                        <div className="throws">
                            <div>
                                1
                            </div>
                            <div>
                                2
                            </div>
                            <div>
                                3
                            </div>
                        </div>
                        <div className="round-total">
                            9
                        </div>
                    </div>
                    <div className="stats-col">
                        <p>Game Avg:</p>
                        <p>10</p>
                    </div>
                </Card>
                <Card elevation={2}>
                    <div className="score-container">
                        <h2>501</h2>
                        <p>{playerTwo}</p>
                    </div>
                </Card>
            </div>
            <div className="controls">
                <Button text="1" onClick={createHandleNewThrow(1)} />
            </div>
        </div>
    ) 
}