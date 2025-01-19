import { Button, Card } from '@blueprintjs/core';
import React from 'react';
import { Modifier, Throw } from '../util/Throw';

const STARTING_SCORE = 501;

interface DartGameTrackerProps {
    playerOne: string;
    playerTwo: string;
}
export const DartGameTracker: React.FC<DartGameTrackerProps> = ({playerOne, playerTwo}) => {
    const [playerOneThrows, setPlayerOneThrows] = React.useState<Throw[]>([])
    const [selectedModifier, setSelectedModifier] = React.useState<Modifier | undefined>(undefined)

    const playerOneScore = React.useMemo(() => {
        if (playerOneThrows.length === 0) {
            return STARTING_SCORE;
        }

        return STARTING_SCORE - 1;

    }, [playerOneThrows])

    const createHandleModifierSelected = React.useCallback((modifier: Modifier) =>
        () => setSelectedModifier(selectedModifier === modifier ? undefined : modifier)
    , [setSelectedModifier, selectedModifier])
    const createHandleNewThrow = React.useCallback((value: number, modifier?: Modifier) => () => {
        setPlayerOneThrows(oldThrows => [...oldThrows, {value, modifier: modifier ?? selectedModifier}])
        setSelectedModifier(undefined);
    }, [setPlayerOneThrows, setSelectedModifier, selectedModifier])
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