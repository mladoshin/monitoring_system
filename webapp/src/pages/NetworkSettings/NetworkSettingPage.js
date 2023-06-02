import React, { useEffect, useRef } from "react";
import {
  useConnectControllerMutation,
  useGetNetworkInfoQuery,
  useGetSocketConnectionsQuery,
  useResetSocketConnectionsMutation,
} from "../../store/api";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
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
import styles from "./NetworkSettingPage.module.scss";

function NetworkSettingPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <SocketSettings />
      </Grid>
      <Grid item xs={6}>
        <NetworkInfo />
      </Grid>
    </Grid>
  );
}

function SocketSettings() {
  const { data, error, isLoading, isSuccess } = useGetSocketConnectionsQuery();
  const [resetSocketConnections, { isLoading: isResetLoading }] =
    useResetSocketConnectionsMutation();

  const [connectController, { isLoading: isConnectLoading }] =
    useConnectControllerMutation();

  const toastId = useRef(null);

  if (isLoading) {
    return <Skeleton variant="rounded" height={200} />;
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

  const handleConnectController = async () => {
    toastId.current = toast(
      <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CircularProgress size="30px" />{" "}
        <p>Добавление TCP сокета к контроллеру</p>
      </Box>,
      { position: "bottom-right", hideProgressBar: true }
    );

    try {
      await connectController();

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

      {data.host.length === 0 && <i>Нет подключений</i>}
      
      {data.host.length > 0 && (
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
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ my: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleConnectController()}
          disabled={isConnectLoading}
        >
          Добавить текущее устройство
        </Button>
      </Stack>

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

function NetworkInfo() {
  const { data, isLoading } = useGetNetworkInfoQuery();

  if (isLoading) {
    return <Skeleton variant="rounded" height={150} />;
  }

  const info = data.interfaces[0];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, textDecoration: "underline" }}>
        Сетевая информация
      </Typography>

      <Stack direction="row" spacing={3} className={styles.row}>
        <b>Имя </b>
        <span>{info.name}</span>
      </Stack>

      <Stack direction="row" spacing={3} className={styles.row}>
        <b>MAC адрес </b>
        <span>{info.mac}</span>
      </Stack>

      <Stack direction="row" spacing={3} className={styles.row}>
        <b>IP адрес контроллера </b>
        <span>{info.addresses[0].address}</span>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={3} className={styles.row}>
        <b>IP адрес сервера </b>
        <span>{data.server_ip}</span>
      </Stack>
    </Paper>
  );
}

export default NetworkSettingPage;
