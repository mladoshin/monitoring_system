import { Box, Stack } from "@mui/system";
import React from "react";
import "./BarChart.scss";

function BarChart({ data = [] }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      {Array.from(Array(4).keys()).map((el) => (
        <Bar/>
      ))}
    </Stack>
  );
}

function Bar({value = 0.5}) {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
        height: 50,
        width: 15,
      }}
    >
        <Box sx={{width: 10, height: `${value*100}%`}} bgcolor="green"></Box>
    </Stack>
  );
}

export default BarChart;
