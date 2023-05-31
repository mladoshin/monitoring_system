import { Button, Card, Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import BarChart from "./BarChart";

function ParameterMonitor({ data, channel, maxAmplitude, resetMaxAmplitude }) {
  const channel_params = data?.find((el) => el.channel == channel);

  const chart_data = maxAmplitude?.map(item => item.max-item.min)
  return (
    <Card>
      <Stack direction="row" alignItems="center">
        <Button variant="outlined" onClick={resetMaxAmplitude}>Сбросить</Button>
        <Box sx={{ flexGrow: 1 }}>
          <BarChart data={chart_data}/>
        </Box>
        <Divider orientation="vertical" flexItem />
        {channel_params && (
          <Stack direction="column" px={3}>
            <span><b>M</b>{` = ${Number(channel_params?.avg).toFixed(6)}`}</span>
            <span><b>СКЗ</b>{` = ${Number(channel_params?.rms).toFixed(6)}`}</span>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export default ParameterMonitor;
