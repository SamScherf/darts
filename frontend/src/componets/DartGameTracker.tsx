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
    const [throwIndex, setThrowIndex] = React.useState<number>(0);
    const [playerOneThrows, setPlayerOneThrows] = React.useState<Throw[]>([])
    const [playerTwoThrows, setPlayerTwoThrows] = React.useState<Throw[]>([])

    const playerOneCurrentScore = React.useMemo(() => {
        const lastThrow = playerOneThrows[playerOneThrows.length - 1];
        const lastScore = lastThrow?.startingScore ?? STARTING_SCORE;
        const lastValue = lastThrow?.value ?? 0;
        return lastScore - lastValue;
    }, [playerOneThrows])
    const playerTwoCurrentScore = React.useMemo(() => {
        const lastThrow = playerTwoThrows[playerTwoThrows.length - 1];
        const lastScore = lastThrow?.startingScore ?? STARTING_SCORE;
        const lastValue = lastThrow?.value ?? 0;
        return lastScore - lastValue;
    }, [playerTwoThrows])

    const thingOne = React.useMemo(() => {
        const roundIndex = throwIndex % 6;
        if (roundIndex < 1) {
            return undefined;
        } else {
            const offSet = roundIndex < 3 ? roundIndex : 3;
            return playerOneThrows[playerOneThrows.length - offSet].value;
        }
    }, [throwIndex, playerOneThrows])
    const thingTwo = React.useMemo(() => {
        const roundIndex = throwIndex % 6;
        if (roundIndex < 2) {
            return undefined;
        } else {
            const offSet = roundIndex < 3 ? roundIndex : 3;
            return playerOneThrows[playerOneThrows.length - offSet + 1].value;
        }
    }, [throwIndex, playerOneThrows])
    const thingThree = React.useMemo(() => {
        const roundIndex = throwIndex % 6;
        if (roundIndex < 3) {
            return undefined;
        } else {
            const offSet = roundIndex < 3 ? roundIndex : 3;
            return playerOneThrows[playerOneThrows.length - offSet + 2].value;
        }
    }, [throwIndex, playerOneThrows])

    const [selectedModifier, setSelectedModifier] = React.useState<Modifier | undefined>(undefined)

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

        // Set based on who threw
        if (throwIndex % 6 < 3) {
            setPlayerOneThrows(oldThrows => {
                    const startingScore = oldThrows.length === 0
                        ? STARTING_SCORE
                        : oldThrows[oldThrows.length - 1].startingScore - oldThrows[oldThrows.length - 1].value;
                    const newThrow = {hit: value, modifier: modifier ?? selectedModifier, startingScore, value};
                    return [...oldThrows, newThrow];
                }
            )
        } else {
            setPlayerTwoThrows(oldThrows => {
                    const startingScore = oldThrows.length === 0
                        ? STARTING_SCORE
                        : oldThrows[oldThrows.length - 1].startingScore - oldThrows[oldThrows.length - 1].value;
                    const newThrow = {hit: value, modifier: modifier ?? selectedModifier, startingScore, value};
                    return [...oldThrows, newThrow];
                }
            )
        }

        setThrowIndex(currentThrowIndex => currentThrowIndex + 1);
        setSelectedModifier(undefined);
    }, [setPlayerOneThrows, setSelectedModifier, selectedModifier, throwIndex])
    return (
        <div className={styles.play}>
            <div className={styles.scoreHalf}>
                <Card elevation={2}>
                    <div className={styles.scoreContainer}>
                        <h2>{playerOneCurrentScore}</h2>
                        <p>{playerOne}</p>
                    </div>
                    <div>
                        <div className={styles.throws}>
                            <div>
                                {thingOne}
                            </div>
                            <div>
                                {thingTwo}
                            </div>
                            <div>
                                {thingThree}
                            </div>
                        </div>
                        <div className={styles.roundTotal}>
                            9
                        </div>
                    </div>
                    <div className={styles.stats}>
                        <p>Game Avg:</p>
                        <p>10</p>
                    </div>
                </Card>
                <Card elevation={2}>
                    <div className={styles.scoreContainer}>
                        <h2>{playerTwoCurrentScore}</h2>
                        <p>{playerTwo}</p>
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