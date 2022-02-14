import { Routes, Route } from "react-router-dom";

import Home from 'pages/Home';
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import NotFound from "pages/NotFound";
import Friends from "pages/Friends";
import Leaderboard from "pages/Leaderboard";

import MainLayout from 'components/MainLayout';

function App() {
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
      <Route />
    </Routes>
  );
}

export default App;
