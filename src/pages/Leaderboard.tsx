import { useEffect, useState } from "react";
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
import axios from "../utils/axios";


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

interface Leader {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  contribution_score: number;
}

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  const getLeaders = () => {
    axios.get("/user/leaderboard").then(res => {
      setLeaders(res.data.users);
    });
  }

  useEffect(() => {
    getLeaders();
  }, [])

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Leaderboard</Typography>
      {leaders.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Place</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contribution Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaders?.map((leader, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {leader.first_name} {leader.last_name}
                    </TableCell>
                    <TableCell>{leader.email}</TableCell>
                    <TableCell>{leader.contribution_score}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {
        leaders.length === 0 && (
          <Typography variant="body1">
            No users have contributed to the site yet.
          </Typography>
        )
      }
    </Stack>
  );
}

export default Leaderboard;