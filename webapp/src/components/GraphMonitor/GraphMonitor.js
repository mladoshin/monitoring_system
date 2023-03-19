import { Grid } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

function GraphMonitor({ channels = [1, 1, 1, 1] }) {
  const chart = {
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        toolbar: {
            show: false
        },
        height: 250,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  };

  return (
    <Grid container>
      {channels?.map((ch) => (
        <Grid item xs={12} lg={6}>
          <ReactApexChart
            options={chart.options}
            series={chart.series}
            type="line"
            height={250}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default GraphMonitor;
