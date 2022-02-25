import { Routes, Route } from "react-router-dom";

import useToken from './hooks/useToken';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from "./pages/NotFound";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";

import MainLayout from './components/MainLayout';

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <Routes>
      <Route path="*" element={<NotFound/>} />
      <Route element={<MainLayout token={token} removeToken={removeToken}/>}>
        <Route index element={<Home />} />
        <Route path="/auth/login" element={<Login setToken={setToken}/>} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
