import { Button } from '@blueprintjs/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
	onLogout: () => void;
}
export const Home: React.FC<HomeProps> = ({ onLogout }) => {
	const navigate = useNavigate()

	const handlePlayClick = React.useCallback(() => navigate("/play"), [navigate]);
	const handleStatsClick = React.useCallback(() => navigate("/stats"), [navigate]);
	const handleLogoutClick = React.useCallback(() => {
		onLogout();
	}, [onLogout]);

  	return (
		<div className="home">
			<div className="logo-container">
				<img src="/dwat-logo.png" className="logo" alt="DWAT logo" />
			</div>
			<div className="buttons-container">
				<Button text="Play" intent="success" large={true} fill={true} onClick={handlePlayClick} />
				<Button text="Stats" intent="primary" large={true} fill={true} onClick={handleStatsClick} />
				<Button text="Logout" intent="danger" large={true} fill={true} onClick={handleLogoutClick} />
			</div>
		</div>
  );
};