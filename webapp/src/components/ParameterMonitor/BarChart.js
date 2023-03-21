import { Box, Stack } from "@mui/system";
import React from "react";
import "./BarChart.scss";

function BarChart({ data = [] }) {
  return (
    <Stack direction="row" spacing={5} justifyContent="center" py={1}>
      {data.map((el) => (
        <Bar value={el / 10 * 10000}/>
      ))}
    </Stack>
  );
}

function Bar({value}) {
  let color = 'green'

  if(value > 1.0){
    value = 1.0
    color = "#ff1744"
  }

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
        <Box sx={{width: 10, height: `${value*100}%`}} bgcolor={color}></Box>
    </Stack>
  );
}

export default BarChart;
