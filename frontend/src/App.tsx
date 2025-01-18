import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import { Login } from './pages/Login.tsx';
import { Home } from './pages/Home.tsx';

export function App() {
	const [secret, setSecret] = React.useState<string | undefined>(undefined)

	return (
	<Router>
      <Routes>
        <Route path="/login" element={<Login setSecret={setSecret} />} />
        <Route path="/" element={secret != null ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
	);
}
