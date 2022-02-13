import { Outlet } from 'react-router-dom';
import Nav from './Nav';

const MainLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default MainLayout;