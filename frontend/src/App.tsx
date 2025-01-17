import React from 'react';
import axios from 'axios';
import { Button, Card, InputGroup, Tooltip } from "@blueprintjs/core";
import './App.css';

export function App() {
	const [message, setMessage] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<Boolean>(false);

	const handleLockClick = React.useCallback(() => setShowPassword(currentVal => !currentVal), [])

	React.useEffect(() => {
		axios.get('http://localhost:5000')
		.then(response => setMessage(response.data))
		.catch(error => console.error('Error fetching data', error));
	}, []);

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
				<div>{message}</div>
				<InputGroup
					type={showPassword ? "text" : "password"}
					placeholder="Enter your password..."
					rightElement={lockButton}
					className="password-field"
				/>
				<Button text="Login" intent="success" fill={true} />
			</Card>
		</div>
	);
}
