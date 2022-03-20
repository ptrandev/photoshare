import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Box ml={{ xs: 0, lg: "240px" }} mt={4}>
        <Container
          maxWidth="lg"
          sx={{
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </>
  );
}

export default MainLayout;