import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import axios from 'axios';

import useToken from './hooks/useToken';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from "./pages/NotFound";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";

import MainLayout from './components/MainLayout';

axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.withCredentials = true;

function App() {
  const { token } = useToken();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    }
  }, [token])

  return (
    <Routes>
      <Route path="*" element={<NotFound/>} />
      <Route element={<MainLayout/>}>
        <Route index element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
