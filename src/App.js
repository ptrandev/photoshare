import { Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';

import MainLayout from './components/MainLayout';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route />
    </Routes>
  );
}

export default App;
