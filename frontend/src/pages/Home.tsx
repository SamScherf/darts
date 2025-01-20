import { Button } from '@blueprintjs/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'

interface HomeProps {
	onLogout: () => void;
}
export const Home: React.FC<HomeProps> = ({ onLogout }) => {
	const navigate = useNavigate()

	const handleDartsClick = React.useCallback(() => navigate("/darts"), [navigate]);
	const handleStatsClick = React.useCallback(() => navigate("/stats"), [navigate]);
	const handleLogoutClick = React.useCallback(() => {
		onLogout();
	}, [onLogout]);

  	return (
		<div className={styles.home}>
			<div className={styles.logoContainer}>
				<img src="/trust.png" className={styles.logo} alt="DWAT logo" />
			</div>
			<div className={styles.buttonsContainer}>
				<Button text="Darts" intent="success" large={true} fill={true} onClick={handleDartsClick} />
				<Button text="Stats" intent="primary" large={true} fill={true} onClick={handleStatsClick} />
				<Button text="Logout" intent="danger" large={true} fill={true} onClick={handleLogoutClick} />
			</div>
		</div>
  );
};