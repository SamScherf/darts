import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import { Login } from './pages/Login.tsx';
import { Home } from './pages/Home.tsx';
import { Stats } from './pages/Stats.tsx';
import { Play } from './pages/Play.tsx';

export function App() {
	const [secret, setSecret] = React.useState<string | undefined>(undefined)

	const handleLogout = React.useCallback(() => setSecret(undefined), [setSecret])

	return (
	<Router>
      <Routes>
        <Route path="/login" element={<Login setSecret={setSecret} />} />
        <Route path="/" element={secret != null ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/Play" element={secret != null ? <Play /> : <Navigate to="/login" />} />
        <Route path="/Stats" element={secret != null ? <Stats /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
	);
}
