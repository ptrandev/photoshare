import { useState } from "react";
import {
  Stack,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";


const mockLeaders = [
  {
    name: "John Doe",
    score: 100
  },
  {
    name: "Jane Doe",
    score: 90,
  },
  {
    name: "Jack Doe",
    score: 80,
  },
]

const Leaderboard = () => {
  const [leaders, setLeaders] = useState(mockLeaders);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Leaderboard</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Place</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contribution Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaders.map((leader, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{leader.name}</TableCell>
                  <TableCell>{leader.score}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default Leaderboard;