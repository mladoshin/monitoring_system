import { Card, Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fft, util } from "fft-js";

function GraphMonitor({
  data = [],
  scaleFactor = 10,
  channel: selectedChannel,
  setChannel: setSelectedChannel,
}) {
  const chart = useMemo(() => ({
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
        width: 1,
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
      yaxis: {
        type: "numeric",
        decimalsInFloat: 4,
      },
      xaxis: {
        // categories: Array.from(Array(100).keys()),
        type: "numeric",
        labels: {
          show: false,
        },
      },
    },
  }));

  const spectrum_chart_options = useMemo(() => {
    const options = {
      ...chart.options,
      chart: { ...chart.options.chart, id: "spectrum_chart" },
      stroke: {
        curve: "straight",
        width: 2,
      },
    };
    options.title.align = "center";
    return options;
  }, []);

  useEffect(() => {
    ApexCharts.exec(
      "spectrum_chart",
      "updateOptions",
      {
        title: {
          text:
            selectedChannel !== null
              ? `Канал ${selectedChannel + 1} (Спектр)`
              : ``,
        },
      },
      false,
      false
    );
  }, [selectedChannel]);

  useEffect(() => {
    try {
      const phasors = fft(data[selectedChannel].slice(0, 2048));

      const frequencies = util.fftFreq(phasors, 16000); // Sample rate and coef is just used for length, and frequency step
      const magnitudes = util.fftMag(phasors);

      const both = frequencies.map((f, ix) => ({
        frequency: f,
        magnitude: magnitudes[ix],
      }));

      ApexCharts.exec("spectrum_chart", "updateSeries", [
        {
          data: both.map((el) => el.magnitude),
        },
      ]);

      ApexCharts.exec(
        "spectrum_chart",
        "updateOptions",
        {
          xaxis: {
            categories: both.map((el) => el.frequency),
            labels: {
              show: true,
            },
          },
        },
        false,
        false
      );
    } catch (err) {
      ApexCharts.exec("spectrum_chart", "updateSeries", [
        {
          data: [],
        },
      ]);

      ApexCharts.exec(
        "spectrum_chart",
        "updateOptions",
        {
          xaxis: {
            categories: [],
            labels: {
              show: true,
            },
          },
        },
        false,
        false
      );
    }
  }, [data, selectedChannel]);

  //update main chart data
  useEffect(() => {
    data.forEach((el, idx) => {
      ApexCharts.exec(`chart${idx}`, "updateSeries", [
        {
          data: el.map((num) => num * scaleFactor),
        },
      ]);
    });
  }, [data]);

  return (
    <Grid container spacing={2}>
      {Array.from(Array(4).keys())?.map((_, idx) => {
        const series = [
          {
            name: `Канал ${idx + 1}`,
            data: [],
          },
        ];

        const options = {
          ...chart.options,
          chart: { ...chart.options.chart, id: `chart${idx}` },
        };
        options.title = { text: `Канал ${idx + 1}`, align: "left" };
        return (
          <Grid item xs={12} lg={6} key={idx}>
            <Card onClick={() => setSelectedChannel(idx)}>
              <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={200}
              />
            </Card>
          </Grid>
        );
      })}
      <Grid item xs={12}>
        <Card>
          <ReactApexChart
            options={spectrum_chart_options}
            series={[{ name: "Spectrum", data: [] }]}
            type="line"
            height={300}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default GraphMonitor;
