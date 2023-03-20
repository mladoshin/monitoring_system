import { Card, Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import BarChart from "./BarChart";

function ParameterMonitor({}) {
  return (
    <Card>
      <Stack direction="row">
        <Box sx={{ flexGrow: 1 }}>
          <BarChart />
        </Box>
        <Divider orientation="vertical" flexItem />
        <div>
          <span>m = -0.00746</span>
          <br />
          <span>СКЗ = 9.7777</span>
        </div>
      </Stack>
    </Card>
  );
}

export default ParameterMonitor;
