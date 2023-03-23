import { Button, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import StopIcon from "@mui/icons-material/Stop";
import StartIcon from "@mui/icons-material/PlayArrow";
import ResetIcon from "@mui/icons-material/RestartAlt";
import { Stack } from "@mui/system";

function MonitoringControl({ onStart, onStop }) {
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const tickDuration = 100;

  useEffect(() => {
    let interval;
    if (active) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + tickDuration);
      }, tickDuration);
    } else if (!active) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active]);

  function startTimer() {
    onStart().then(() => {
      setActive(true);
      setTime(0);
    });
  }

  function stopTimer() {
    setActive(false);
    onStop();
  }

  function resetTimer() {
    setTime(0);
  }

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time - hours * 3600000) / 60000);
  const seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);
  const milliseconds =
    time - hours * 3600000 - minutes * 60000 - seconds * 1000;

  const timeString =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0") +
    ":" +
    milliseconds.toString().padStart(2, "0");

  return (
    <Card sx={{ height: "66px" }} px={2}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
        justifyContent="center"
      >
        {active && (
          <Button variant="contained" onClick={stopTimer}>
            <StopIcon />
          </Button>
        )}

        {!active && (
          <>
            <Button variant="contained" onClick={startTimer} type="submit">
              <StartIcon />
            </Button>
          </>
        )}

        <h3 style={{width: 80}}>{timeString}</h3>

        <Button variant="contained" onClick={resetTimer} disabled={active}>
          <ResetIcon />
        </Button>
      </Stack>
    </Card>
  );
}

export default MonitoringControl;
