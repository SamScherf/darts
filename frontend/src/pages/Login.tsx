import { Button, Card, InputGroup, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { getToaster } from '../util/toaster';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'
import { login } from 'src/util/backend';

interface LoginProps {
    setSecret: (secret: string) => void;
}
export const Login: React.FC<LoginProps> = ({ setSecret }) => {
	const [password, setPassword] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<Boolean>(false);
	
	const navigate = useNavigate();
	const handleLockClick = React.useCallback(() => setShowPassword(currentVal => !currentVal), [])
	const handleLogin = React.useCallback(async () => {
		const toaster = await getToaster();
		try {
			await login(password);
		} catch(e: any) {
			if (e.response) {
				const statusCode = e.response.status;
				if (statusCode === 401) {
					toaster.show({intent: "danger", message: "Invalid password" });
				} else if (statusCode === 429) {
					toaster.show({intent: "danger", message: "Too many attempts, please wait 1 minute" });
				}
			} else {
				toaster.show({intent: "danger", message: "Error" });
			}
			console.warn(e);
			return;
		}

		toaster.show({intent: "success", message: "Password accepted" });
        setSecret(password);
		navigate("/")
	}, [password, setSecret, navigate])

	const lockButton = (
           <Tooltip content={`${showPassword ? "Hide" : "Show"} Password`}>
               <Button
                   icon={showPassword ? "unlock" : "lock"}
				   intent="warning"
                   minimal={true}
                   onClick={handleLockClick}
               />
           </Tooltip>
       );

  return (
		<div className={styles.login}>
    		<Card className={styles.loginContainer}>
				<InputGroup
					type={showPassword ? "text" : "password"}
					placeholder="Enter your password..."
					rightElement={lockButton}
					className={styles.passwordField}
					value={password}
					onValueChange={setPassword}
				/>
				<Button text="Login" intent="success" fill={true} onClick={handleLogin}/>
  			</Card>
		</div>
  );
};