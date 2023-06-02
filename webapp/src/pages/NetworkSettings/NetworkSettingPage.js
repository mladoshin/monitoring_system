import React, { useEffect, useRef } from "react";
import {
  useGetSocketConnectionsQuery,
  useResetSocketConnectionsMutation,
} from "../../store/api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

function NetworkSettingPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <SocketSettings />
      </Grid>
      <Grid item xs={6}>
        <MemorySettings />
      </Grid>
    </Grid>
  );
}

function SocketSettings() {
  const { data, error, isLoading, isSuccess } = useGetSocketConnectionsQuery();
  const [resetSocketConnections, { isLoading: isResetLoading }] =
    useResetSocketConnectionsMutation();
  const toastId = useRef(null);

  if (isLoading) {
    return <Skeleton variant="rounded" height={150} />;
  }

  const handleReset = async (...props) => {
    toastId.current = toast(
      <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CircularProgress size="30px" /> <p>Загрузка...</p>
      </Box>,
      { position: "bottom-right", hideProgressBar: true }
    );

    try {
      await resetSocketConnections(...props);

      toast.dismiss(toastId.current);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 1, textDecoration: "underline" }}>
        Подключения
      </Typography>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>IP адрес</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Порт
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>
              Статус
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.host?.map((host) => (
            <TableRow
              key={`${host.address}${host.port}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {host.address}
              </TableCell>
              <TableCell align="right">{host.port}</TableCell>
              <TableCell align="right">
                {host.connected ? "Подключено" : "Не подключено"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Stack direction="row" justifyContent="space-between">
        <Button onClick={() => handleReset()} disabled={isResetLoading}>
          Сбросить ненужные соединения
        </Button>
        <Button onClick={() => handleReset(true)} disabled={isResetLoading}>
          Полный сброс
        </Button>
      </Stack>
    </TableContainer>
  );
}

function MemorySettings() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 1, textDecoration: "underline" }}>
        История измерений
      </Typography>
      <Button>Очистить историю измерений</Button>
    </Paper>
  );
}

export default NetworkSettingPage;
