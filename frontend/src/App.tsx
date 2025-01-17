import React from 'react';
import axios from 'axios';
import './App.css';

export function App() {
	const [message, setMessage] = React.useState<string>('');

	React.useEffect(() => {
		axios.get('http://localhost:5000')
		.then(response => setMessage(response.data))
		.catch(error => console.error('Error fetching data', error));
	}, []);

	return (
		<div>
			<h1>{message}</h1>
		</div>
	);
}
