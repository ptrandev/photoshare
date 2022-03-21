import { Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from "./pages/NotFound";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import AlbumCreate from "./pages/album/AlbumCreate";
import AlbumEdit from "./pages/album/AlbumEdit";
import AlbumMyAlbums from "./pages/album/AlbumMyAlbums";
import AlbumView from "./pages/album/AlbumView";

import MainLayout from './components/MainLayout';

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
        <Route path="/album/create" element={<AlbumCreate />} />
        <Route path="/album/edit/:album_id" element={<AlbumEdit />} />
        <Route path="/albums/my" element={<AlbumMyAlbums />} />
        <Route path="/album/:album_id" element={<AlbumView />} />
      </Route>
    </Routes>
  );
}

export default App;
