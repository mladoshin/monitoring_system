import { Card, Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import BarChart from "./BarChart";

function ParameterMonitor({ data, channel, maxAmplitude }) {
  const channel_params = data?.find((el) => el.channel == channel);
  return (
    <Card>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          <BarChart data={maxAmplitude}/>
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
