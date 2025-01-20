import { Button, Card, Dialog, DialogBody } from '@blueprintjs/core';
import React from 'react';
import { Modifier, Throw } from '../util/Throw';
import styles from './DartGameTracker.module.css'
import { useNavigate } from 'react-router-dom';

const STARTING_SCORE = 501;

interface DartGameTrackerProps {
    playerOne: string;
    playerTwo: string;
}
export const DartGameTracker: React.FC<DartGameTrackerProps> = ({playerOne, playerTwo}) => {
	const navigate = useNavigate();

    const [throws, setThrows] = React.useState<Throw[]>([]);
    const [selectedModifier, setSelectedModifier] = React.useState<Modifier | undefined>(undefined)

    const players = React.useMemo(() => [playerOne, playerTwo], [playerOne, playerTwo]);

    const currentTurnIndex = React.useMemo(() => {
        const lastThrow = throws[throws.length - 1];

        // Start of game
        if (lastThrow == null) {
            return 0;
        }

        const isNewTurn = getIsLastThrowOfTurn(lastThrow);
        return isNewTurn ? lastThrow.turnIndex + 1 : lastThrow.turnIndex;
    }, [throws])

    const scoreByPlayer = React.useMemo<number[]>(() => {
        return players.map(player => {
            const playersLastTurn = getPlayersLastTurn(player, throws);

            // Start of game
            if (playersLastTurn.length === 0) {
                return STARTING_SCORE
            }

            const playersLastThrow = playersLastTurn[playersLastTurn.length - 1];
            const isPlayersLastThrowBust = getIsBust(playersLastThrow);

            return isPlayersLastThrowBust
                    ? playersLastTurn[0].startingScore
                    : playersLastThrow.startingScore - playersLastThrow.value;

        })
    }, [throws, players]);

    const lastTurnByPlayer = React.useMemo<Throw[][]>(() => {
        return players.map(player => {
            const playersLastTurn = getPlayersLastTurn(player, throws);
            const playersLastThrow = playersLastTurn[playersLastTurn.length - 1];

            // Start of game
            if (playersLastThrow == null) {
                return [];
            }

            const turnsSinceLastThrow = currentTurnIndex - playersLastThrow.turnIndex;
            const isStartOfUsersTurn = turnsSinceLastThrow !== 0 && turnsSinceLastThrow % 2 === 0;
            
            return isStartOfUsersTurn ? [] : playersLastTurn;
        });
    }, [throws, players, currentTurnIndex])

    const averageByPlayer = React.useMemo(() => {
        return players.map((player, playerIndex) => {
            const playersPointsScore = STARTING_SCORE - scoreByPlayer[playerIndex];
            const playersThrowCount = throws.filter(_throw => _throw.user === player).length;
            return playersThrowCount === 0 ? 0 : (playersPointsScore / playersThrowCount) * 3;
        })
    }, [players, scoreByPlayer, currentTurnIndex])


    const createHandleModifierSelected = React.useCallback((modifier: Modifier) =>
        () => setSelectedModifier(oldSelectedModifier => oldSelectedModifier === modifier ? undefined : modifier)
    , [setSelectedModifier])

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

            const isNewTurn = getIsLastThrowOfTurn(lastThrow);
            const throwIndex = isNewTurn ? 0 : lastThrowIndex + 1;
            const turnIndex = isNewTurn ? lastTurnIndex + 1 : lastTurnIndex;
            const user = players[turnIndex % 2];

            const playersLastTurn = getPlayersLastTurn(user, oldThrows);
            const playersLastThrow = playersLastTurn[playersLastTurn.length - 1]
            
            // If playersLastThrow != null then playersLastTurn[0] is also != null
            const startingScore = playersLastThrow == null ? STARTING_SCORE : getIsBust(playersLastThrow)
                                    ? playersLastTurn[0].startingScore
                                    : playersLastThrow.startingScore - playersLastThrow.value;

            const newThrow: Throw = {
                value,
                modifier: modifier ?? selectedModifier,
                user,
                turnIndex,
                throwIndex,
                hit,
                startingScore,
            } 
            return [...oldThrows, newThrow];
        })
        setSelectedModifier(undefined);
    }, [setThrows, setSelectedModifier, selectedModifier, players]);

    const handleUndo = React.useCallback(() => setThrows(oldThrows => oldThrows.slice(0, -1)), [setThrows])

    const handleDiscardGame = React.useCallback(() => navigate("/"), [navigate])

    return (
        <div className={styles.play}>
            <Dialog isOpen={scoreByPlayer.some(score => score === 0)} >
                <DialogBody className={styles.winningDialog}>
                    {players[scoreByPlayer.findIndex(score => score === 0)]} won
                    <Button text="Save Game" intent="success" />
                    <Button text="Discard Game" intent="danger" onClick={handleDiscardGame}/>
                </DialogBody>
            </Dialog>
            <div className={styles.scoreHalf}>
                <Card elevation={2}>
                    <div className={styles.leftColumn}>
                        <div className={currentTurnIndex % 2 === 0 ? styles.activeTurn : styles.inactiveTurn}/>
                        <div className={styles.scoreContainer}>
                            <h2>{scoreByPlayer[0]}</h2>
                            <p>{playerOne}</p>
                        </div>
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
                        <h4>
                            Avg: {averageByPlayer[0].toFixed(2)}
                        </h4>
                        <h4>
                            Turn: {getPlayersTurnCount(currentTurnIndex, 0)}
                        </h4>
                    </div>
                </Card>
                <Card elevation={2}>
                    <div className={styles.leftColumn}>
                        <div className={currentTurnIndex % 2 === 1 ? styles.activeTurn : styles.inactiveTurn}/>
                        <div className={styles.scoreContainer}>
                            <h2>{scoreByPlayer[1]}</h2>
                            <p>{playerTwo}</p>
                        </div>
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
                        <h4>
                            Avg: {averageByPlayer[1].toFixed(2)}
                        </h4>
                        <h4>
                            Turn: {getPlayersTurnCount(currentTurnIndex, 1)}
                        </h4>
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
                <Button key={31} icon="undo" onClick={handleUndo} intent="danger" disabled={selectedModifier != null && selectedModifier != null} />
            </div>
        </div>
    ) 
}

// TODO: Optimize this to be O(1) instead of O(n)
function getPlayersLastTurn(user: string, throws: Throw[]): Throw[] {
    const playersThrows = throws.filter(_throw => _throw.user === user);
    const playersLastThrow = playersThrows[playersThrows.length - 1];

    // Start of game
    if (playersLastThrow == null) {
        return [];
    } else {
        return playersThrows.filter(_throw => _throw.turnIndex === playersLastThrow.turnIndex);
    }
}

function getIsLastThrowOfTurn(_throw: Throw) {
    return getIsBust(_throw) || _throw.throwIndex === 2;
}

function getIsBust(_throw: Throw) {
    return _throw.value > _throw.startingScore ;
}

function getPlayersTurnCount(currentTurnIndex: number, userIndex: number) {
    const roundIndex =  Math.floor(currentTurnIndex / 2);
    const playerTurnCount = userIndex <= currentTurnIndex % 2 ? roundIndex + 1 : roundIndex;
    return playerTurnCount;
}