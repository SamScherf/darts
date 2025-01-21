import { Button, Dialog, DialogBody, InputGroup, MenuItem, Spinner } from '@blueprintjs/core';
import React from 'react';
import { getToaster } from '../util/toaster';
import styles from './GameConfig.module.css'
import { User, useUsers } from 'src/hooks/useUsers';
import { ItemRenderer, Select } from '@blueprintjs/select';
import { post } from 'src/util/backend';
import { useQueryClient } from '@tanstack/react-query';

interface GameConfigProps {
    startGame: () => void;
    onSavePlayerOne: (player: string) => void;
    onSavePlayerTwo: (player: string) => void;
    password: string;
}
export const GameConfig: React.FC<GameConfigProps> = ({ startGame, onSavePlayerOne, onSavePlayerTwo, password }) => {
    const queryClient = useQueryClient()
    const {isLoading, data: users} = useUsers(password);

    const [playerOne, setPlayerOne] = React.useState<User | undefined>(undefined);
    const [playerTwo, setPlayerTwo] = React.useState<User | undefined>(undefined);
    const [isAddPlayerDialogOpen, setIsAddPlayerDialogOpen] = React.useState(false);
    const [newPlayerUsername, setNewPlayerUsername] = React.useState<string | undefined>(undefined)

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

    const openAddPlayerDialog = React.useCallback(() => setIsAddPlayerDialogOpen(true), [setIsAddPlayerDialogOpen]);
    const closeAddPlayerDialog = React.useCallback(() => setIsAddPlayerDialogOpen(false), [setIsAddPlayerDialogOpen]);

    const handleAddPlayer = React.useCallback(async () => {
		const toaster = await getToaster();
		try {
			await post("/create-user", {password, username: newPlayerUsername})
		} catch(e: any) {
			if (e.response) {
				const statusCode = e.response.status;
				if (statusCode === 401) {
					toaster.show({intent: "danger", message: "Invalid password" });
				} else if (statusCode === 429) {
					toaster.show({intent: "danger", message: "Too many attempts, please wait 1 minute" });
				}
				toaster.show({intent: "danger", message: "Error adding user" });
			} else {
				toaster.show({intent: "danger", message: "Error adding user" });
			}
			console.warn(e);
			return;
		}

		toaster.show({intent: "success", message: "Player added" });
        queryClient.invalidateQueries({ queryKey: ['users'] })
        setNewPlayerUsername(undefined);
        setIsAddPlayerDialogOpen(false);
    }, [newPlayerUsername, password, setNewPlayerUsername, setIsAddPlayerDialogOpen, queryClient]);

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
            <Button text="Start" onClick={handleStart} intent="success" fill={true} large={true} />
            <Button text="Add Player" onClick={openAddPlayerDialog} intent="warning" fill={true} large={true} />
            <Dialog isOpen={isAddPlayerDialogOpen} onClose={closeAddPlayerDialog} canEscapeKeyClose={true} canOutsideClickClose={true} >
                <DialogBody className={styles.addPlayerBody}>
                    Please be careful here and don't add the same person twice with different usernames. One day this username will be your login.
                    <InputGroup type="text" value={newPlayerUsername} onValueChange={setNewPlayerUsername}/>
                    <Button text="Add Player" onClick={handleAddPlayer} intent="success" fill={true} large={true} disabled={newPlayerUsername == null}/>
                </DialogBody>
            </Dialog>
        </div>
    )
}

const renderUser: ItemRenderer<User> = (user, { handleClick, handleFocus }) => {
    return (
        <MenuItem text={user.username} key={user.username} onClick={handleClick} onFocus={handleFocus}/>
    )
}