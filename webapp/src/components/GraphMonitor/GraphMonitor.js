import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

function GraphMonitor({ data = [] }) {
  const chart = {
    options: {
      chart: {
        toolbar: {
          show: false,
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
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: Array.from(Array(100).keys()),
        type: "numeric",
        labels: {
          show: false,
        },
      },
    },
  };

  useEffect(() => {
    data.forEach((el, idx) => {
      ApexCharts.exec(String(idx), "updateSeries", [
        {
          data: el,
        },
      ]);
    });
  }, [data]);

  return (
    <Grid container style={{ width: "100%" }}>
      {Array.from(Array(4).keys())?.map((_, idx) => {
        const series = [
          {
            name: `Канал ${idx + 1}`,
            data: data[idx] || [],
          },
        ];

        const options = {...chart.options};
        options.chart.id = idx;
        options.title = { text: `Канал ${idx + 1}`, align: "left" };
        return (
          <Grid item xs={12} lg={6} key={idx}>
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={250}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default GraphMonitor;
