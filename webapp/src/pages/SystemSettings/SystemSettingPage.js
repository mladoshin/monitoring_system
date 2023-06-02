import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useClearHistoryMutation } from "../../store/api";
import { toast } from "react-toastify";

function SystemSettingPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <HistorySettings />
      </Grid>
      <Grid item xs={6}>
        {/* <NetworkInfo /> */}
      </Grid>
    </Grid>
  );
}

function HistorySettings() {
  const [clearHistory, { isLoading: isLoading }] = useClearHistoryMutation();
  const toastId = useRef(null);

  const handleClear = async () => {
    toastId.current = toast(
      <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CircularProgress size="30px" /> <p>Очистка...</p>
      </Box>,
      { position: "bottom-right", hideProgressBar: true }
    );

    try {
      await clearHistory().unwrap();
      toast.dismiss(toastId.current);
    } catch (err) {
      console.log(err);
      displayErrorToast();
    }
  };

  const displayErrorToast = () => {
    toast.update(toastId.current, {
      render: `Ошибка`,
      position: "bottom-right",
      type: "error",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, textDecoration: "underline" }}>
        История измерений
      </Typography>

      <Button variant="contained" onClick={handleClear}>
        Очистить историю
      </Button>
    </Paper>
  );
}

export default SystemSettingPage;
