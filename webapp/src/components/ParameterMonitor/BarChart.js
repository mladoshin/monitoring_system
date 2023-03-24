import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import CustomPopover from "../Popover";
import "./BarChart.scss";

function BarChart({ data = [] }) {
  return (
    <Stack direction="row" spacing={5} justifyContent="center" py={1}>
      {data.map((el, idx) => (
        <Stack direction="column" alignItems="center">
          <Typography sx={{fontSize: 12, fontWeight: "bold"}}>{idx+1}</Typography>
          <Bar value={(el / 10) * 10000} id={idx} />
        </Stack>
      ))}
    </Stack>
  );
}

function Bar({ value, id }) {
  let color = "green";

  if (value > 1.0) {
    value = 1.0;
    color = "#ff1744";
  }

  return (
    <CustomPopover
      component={
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontWeight: "bold" }}>Канал {id + 1}</Typography>
          <Typography>Максимум: {Number(value).toFixed(3)}</Typography>
        </Box>
      }
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
          height: 40,
          width: 15,
        }}
      >
        <Box
          sx={{ width: 10, height: `${value * 100}%` }}
          bgcolor={color}
        ></Box>
      </Stack>
    </CustomPopover>
  );
}

export default BarChart;
