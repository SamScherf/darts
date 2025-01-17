import React from 'react';
import axios from 'axios';
import { Button, Card, InputGroup, Tooltip } from "@blueprintjs/core";
import './App.css';
import { getToaster } from './toaster.ts';

const BACKEND_URL = "http://localhost:5000"

export function App() {
	const [password, setPassword] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<Boolean>(false);
	

	const handleLockClick = React.useCallback(() => setShowPassword(currentVal => !currentVal), [])
	const handleLogin = React.useCallback(async () => {
		const toaster = getToaster();
		try {
			await post("/validate-password", {password})
		} catch(e) {
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
	}, [password])


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
		<div className="homepage">
			<Card className="login-container">
				<InputGroup
					type={showPassword ? "text" : "password"}
					placeholder="Enter your password..."
					rightElement={lockButton}
					className="password-field"
					value={password}
					onValueChange={setPassword}
				/>
				<Button text="Login" intent="success" fill={true} onClick={handleLogin}/>
			</Card>
		</div>
	);
}


async function post(relativeUrl: string, payload?) {
	return axios.post(BACKEND_URL + relativeUrl, payload)
}