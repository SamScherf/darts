import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Stats } from './pages/Stats';
import { Darts } from './pages/Darts';

export const App: React.FC = () => {
	const [secret, setSecret] = React.useState<string | undefined>(undefined)

	const handleLogout = React.useCallback(() => setSecret(undefined), [setSecret])

	return (
	<Router>
      <Routes>
        <Route path="/login" element={<Login setSecret={setSecret} />} />
        <Route path="/" element={secret != null ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/darts" element={secret != null ? <Darts /> : <Navigate to="/login" />} />
        <Route path="/stats" element={secret != null ? <Stats /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
	);
}
