import { Button, MenuItem, Spinner } from '@blueprintjs/core';
import React from 'react';
import { getToaster } from '../util/toaster';
import styles from './GameConfig.module.css'
import { User, useUsers } from 'src/hooks/useUsers';
import { ItemRenderer, Select } from '@blueprintjs/select';

interface GameConfigProps {
    startGame: () => void;
    onSavePlayerOne: (player: string) => void;
    onSavePlayerTwo: (player: string) => void;
    password: string;
}
export const GameConfig: React.FC<GameConfigProps> = ({ startGame, onSavePlayerOne, onSavePlayerTwo, password }) => {
    const {isLoading, data: users} = useUsers(password);

    const [playerOne, setPlayerOne] = React.useState<User | undefined>(undefined);
    const [playerTwo, setPlayerTwo] = React.useState<User | undefined>(undefined);

    const handleStart = React.useCallback(async () => {
        const toaster = await getToaster();
        if (playerOne === playerTwo) {
            toaster.show({intent: "warning", message: "You can't play a game against yourself. Why? Because I said so." })
            return
        }

        if(playerOne == null || playerTwo == null) {
            toaster.show({intent: "warning", message: "All users have not been set" })
            return
        }

        onSavePlayerOne(playerOne.username)
        onSavePlayerTwo(playerTwo.username)
        startGame();
    }, [startGame, playerOne, playerTwo, onSavePlayerOne, onSavePlayerTwo]);

    const myFunc = () => {debugger};
    return (
        <div className={styles.pickPlayers}>
            <div className={styles.instructions}>
                Pick your players
            </div>
            {isLoading || users == null ? <Spinner />
            : (
                <div className={styles.playerSelectionContainer}>
                    <Select<User>
                        items={users}
                        itemRenderer={renderUser}
                        onItemSelect={setPlayerOne}
                        fill={true}
                        filterable={false}
                        popoverProps={{minimal: true, matchTargetWidth: true}}
                    >
                        <Button text={playerOne?.username ?? "Select a user"} rightIcon="double-caret-vertical" fill={true}/>
                    </Select>
                    <Select<User>
                        items={users}
                        itemRenderer={renderUser}
                        onItemSelect={setPlayerTwo}
                        fill={true}
                        filterable={false}
                        popoverProps={{minimal: true, matchTargetWidth: true}}
                    >
                        <Button text={playerTwo?.username ?? "Select a user"} rightIcon="double-caret-vertical" fill={true}/>
                    </Select>
                </div>
            )
        }
            <Button text="Start" onClick={handleStart} intent="success" fill={true} />
        </div>
    )
}

const renderUser: ItemRenderer<User> = (user, { handleClick, handleFocus }) => {
    return (
        <MenuItem text={user.username} key={user.username} onClick={handleClick} onFocus={handleFocus}/>
    )
}