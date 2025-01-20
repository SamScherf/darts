import { Button, Card } from '@blueprintjs/core';
import React from 'react';
import { Modifier, Throw } from '../util/Throw';
import styles from './DartGameTracker.module.css'

const STARTING_SCORE = 501;

interface DartGameTrackerProps {
    playerOne: string;
    playerTwo: string;
}
export const DartGameTracker: React.FC<DartGameTrackerProps> = ({playerOne, playerTwo}) => {
    const [throws, setThrows] = React.useState<Throw[]>([]);
    const [selectedModifier, setSelectedModifier] = React.useState<Modifier | undefined>(undefined)

    const players = React.useMemo(() => [playerOne, playerTwo], [playerOne, playerTwo]);

    const scoreByPlayer = React.useMemo<number[]>(() => {
        // Start of game
        if (throws.length === 0) {
            return [STARTING_SCORE, STARTING_SCORE];
        }

        // Filter out busted rounds
        const bustedTurns = throws.filter(_throw => _throw.value > _throw.startingScore).map(_throw => _throw.turnIndex);
        const throwsWithoutBustedRounds = throws.filter(_throw => !bustedTurns.includes(_throw.turnIndex))
        
        // Sum by players
        const playerOneScore = STARTING_SCORE - throwsWithoutBustedRounds
                        .filter(_throw => _throw.user === playerOne)
                        .map(_throw => _throw.value)
                        .reduce((acc, num) => acc + num, 0);
        const playerTwoScore = STARTING_SCORE - throwsWithoutBustedRounds
                        .filter(_throw => _throw.user === playerTwo)
                        .map(_throw => _throw.value)
                        .reduce((acc, num) => acc + num, 0);

        return [playerOneScore, playerTwoScore];

    }, [throws, playerOne, playerTwo]);

    const lastTurnByPlayer = React.useMemo<Throw[][]>(() => {
        return players.map(player => {
            const playersThrows = throws.filter(_throw => _throw.user === player);
            const playersLastThrow = playersThrows[playersThrows.length - 1];

            // Start of game
            if (playersLastThrow == null) {
                return [];
            }

            // Start of users turn
            const lastThrow = throws[throws.length - 1];
            const isNewTurn =  lastThrow.value > lastThrow.startingScore || lastThrow.throwIndex === 2;
            const currentTurnIndex = isNewTurn ? lastThrow.turnIndex + 1 : lastThrow.turnIndex;
            const turnsSinceLastThrow = currentTurnIndex - playersLastThrow.turnIndex;
            if (turnsSinceLastThrow !== 0 && turnsSinceLastThrow % 2 === 0) {
                return [];
            }

            return playersThrows.filter(_throw => _throw.turnIndex === playersLastThrow.turnIndex);
        });
    }, [throws, players])

    const averageByPlayer = React.useMemo(() => {
        return players.map((player, playerIndex) => {
            const playersThrows = throws.filter(_throw => _throw.user === player);

            // Hasn't thrown yet
            if (playersThrows.length === 0) {
                return 0;
            } else {
                const numOfTurns = new Set(playersThrows.map(_throw => _throw.turnIndex)).size
                const totalPointsScore = STARTING_SCORE - scoreByPlayer[playerIndex]
                return totalPointsScore / numOfTurns;
            }
        })
    }, [throws, players])


    const createHandleModifierSelected = React.useCallback((modifier: Modifier) =>
        () => setSelectedModifier(selectedModifier === modifier ? undefined : modifier)
    , [setSelectedModifier, selectedModifier])
    const createHandleNewThrow = React.useCallback((hit: number, modifier?: Modifier) => () => {
        // Calculate value of throw
        let value: number;
        if (selectedModifier === Modifier.double) {
            value = hit*2;
        } else if (selectedModifier === Modifier.treble) {
            value = hit*3
        } else {
            value = hit;
        }
   
        setThrows(oldThrows => {
            const lastThrow = oldThrows[oldThrows.length - 1];
            if (lastThrow == null) {
                return [
                    {
                    value,
                    modifier: modifier ?? selectedModifier,
                    user: players[0],
                    turnIndex: 0,
                    throwIndex: 0,
                    hit,
                    startingScore: STARTING_SCORE
                    }
                ]
            }

            const lastThrowIndex = lastThrow.throwIndex;
            const lastTurnIndex = lastThrow.turnIndex;

            const isNewTurn =  lastThrow.value > lastThrow.startingScore || lastThrowIndex === 2;
            const throwIndex = isNewTurn ? 0 : lastThrowIndex + 1;
            const turnIndex = isNewTurn ? lastTurnIndex + 1 : lastTurnIndex;
            const user = players[turnIndex % 2];

            const usersThrows = oldThrows.filter(_throw => _throw.user === user);
            const lastThrowByUser = usersThrows[usersThrows.length - 1];
            const startingScore = lastThrowByUser == null ? STARTING_SCORE : lastThrowByUser.startingScore < lastThrowByUser.value
                                    ? lastThrowByUser.startingScore - lastThrowByUser.value
                                    : lastThrowByUser.startingScore;

            const newThrow: Throw = {
                value,
                modifier: modifier ?? selectedModifier,
                user: players[turnIndex % 2],
                turnIndex,
                throwIndex,
                hit,
                startingScore,
            } 
            return [...oldThrows, newThrow];
        })
        setSelectedModifier(undefined);
    }, [setThrows, setSelectedModifier, selectedModifier, players]);

    return (
        <div className={styles.play}>
            <div className={styles.scoreHalf}>
                <Card elevation={2}>
                    <div className={styles.scoreContainer}>
                        <h2>{scoreByPlayer[0]}</h2>
                        <p>{playerOne}</p>
                    </div>
                    <div>
                        <div className={styles.throws}>
                            <div>
                                {lastTurnByPlayer[0][0]?.value}
                            </div>
                            <div>
                                {lastTurnByPlayer[0][1]?.value}
                            </div>
                            <div>
                                {lastTurnByPlayer[0][2]?.value}
                            </div>
                        </div>
                        <div className={styles.roundTotal}>
                            {lastTurnByPlayer[0].reduce((acc, _throw) => acc + _throw.value, 0)}
                        </div>
                    </div>
                    <div className={styles.stats}>
                        <p>Game Avg:</p>
                        <p>{averageByPlayer[0]}</p>
                    </div>
                </Card>
                <Card elevation={2}>
                    <div className={styles.scoreContainer}>
                        <h2>{scoreByPlayer[1]}</h2>
                        <p>{playerTwo}</p>
                    </div>
                    <div>
                        <div className={styles.throws}>
                            <div>
                                {lastTurnByPlayer[1][0]?.value}
                            </div>
                            <div>
                                {lastTurnByPlayer[1][1]?.value}
                            </div>
                            <div>
                                {lastTurnByPlayer[1][2]?.value}
                            </div>
                        </div>
                        <div className={styles.roundTotal}>
                            {lastTurnByPlayer[1].reduce((acc, _throw) => acc + _throw.value, 0)}
                        </div>
                    </div>
                    <div className={styles.stats}>
                        <p>Game Avg:</p>
                        <p>{averageByPlayer[1]}</p>
                    </div>
                </Card>
            </div>
            <div className={styles.controls}>
                {Array.from({ length: 20 }, (_, index) => (
                    <Button key={index + 1} text={`${index + 1}`} onClick={createHandleNewThrow(index + 1)} />
                ))}
                <Button key={21} text={"25"} onClick={createHandleNewThrow(25)} disabled={selectedModifier != null}/>
                <Button key={22} text={"50"} onClick={createHandleNewThrow(50)} disabled={selectedModifier != null}/>
                <Button
                    key={23}
                    text={"2x"}
                    onClick={createHandleModifierSelected(Modifier.double)}
                    intent="success"
                    disabled={selectedModifier != null && selectedModifier !== Modifier.double}
                />
                <Button key={24} text={"3x"} onClick={createHandleModifierSelected(Modifier.treble)}
                        intent="success" disabled={selectedModifier != null && selectedModifier !== Modifier.treble} />
                <Button key={25} text={"Board-0"} onClick={createHandleNewThrow(0, Modifier.board)} intent="warning" disabled={selectedModifier != null} />
                <Button key={26} text={"Wood-0"} onClick={createHandleNewThrow(0, Modifier.wood)} intent="warning" disabled={selectedModifier != null} />
                <Button key={27} text={"Wall-0"} onClick={createHandleNewThrow(0, Modifier.wall)} intent="warning" disabled={selectedModifier != null} />
                <Button key={28} text={"Floor-0"} onClick={createHandleNewThrow(0, Modifier.floor)} intent="warning" disabled={selectedModifier != null} />
                <Button key={29} text={"Inner-Circle"} onClick={createHandleModifierSelected(Modifier.inner)}
                        intent="primary" disabled={selectedModifier != null && selectedModifier !== Modifier.inner} />
                <Button key={30} text={"Outer-Circle"} onClick={createHandleModifierSelected(Modifier.outer)} intent="primary" disabled={selectedModifier != null && selectedModifier !== Modifier.outer} />
                <Button key={31} icon="undo" onClick={createHandleNewThrow(25)} intent="danger" disabled={selectedModifier != null && selectedModifier != null} />
            </div>
        </div>
    ) 
}