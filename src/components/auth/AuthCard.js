import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

const AuthCard = (props) => {
  const { children, title } = props;

  return (
    <Box display="flex" justifyContent="center">
      <Paper
        sx={{
          width: "100%",
          maxWidth: "320px",
          p: 4,
        }}
      >
        <Typography variant="h4" mb={2}>{title}</Typography>
        {children}
      </Paper>
    </Box>
  );
}

export default AuthCard;