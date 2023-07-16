import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Modal,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import "./FileModal.scss";
import "./SpectrumModal.scss";
import {
  _axisGenerator,
  _jsonGenerator,
} from "../../../../common/utils/utils.mjs";
import { useLazyGetMissionSpectrumDataQuery } from "../../store/api";
import ReactApexChart from "react-apexcharts";

function SpectrumModal({ open, handleClose, path = "" }) {
  const [getSpectrumData, { isError, isLoading, isSuccess, data }] =
    useLazyGetMissionSpectrumDataQuery();

  useEffect(() => {
    if (!path) {
      console.error("No path specified to fetch spetrum data!");
    }

    if (open) {
      handleFetchSpectrumData(path);
    }
  }, [open, path]);

  useEffect(() => {
    if (!data) return;

    data.forEach(displaySpectrumData);
  }, [data, open]);

  async function handleFetchSpectrumData(path) {
    try {
      const res = await getSpectrumData(path.substr(1)).unwrap();
      //res.forEach(displaySpectrumData);
    } catch (err) {
      console.error(err);
    }
  }

  function displaySpectrumData(channel_fft_data, idx) {
    console.log("display spectrum data");
    ApexCharts.exec(`spectrum_chart${idx}`, "updateSeries", [
      {
        data: channel_fft_data.map((el) => el.magnitude),
      },
    ]);

    ApexCharts.exec(`spectrum_chart${idx}_1`, "updateSeries", [
      {
        data: channel_fft_data.map((el) => el.magnitude),
      },
    ]);

    ApexCharts.exec(
      `spectrum_chart${idx}`,
      "updateOptions",
      {
        xaxis: {
          categories: channel_fft_data.map((el) => el.frequency),
          labels: {
            show: true,
          },
        },
      },
      false,
      false
    );

    console.log(channel_fft_data[channel_fft_data.length - 1].frequency);
    ApexCharts.exec(
      `spectrum_chart${idx}_1`,
      "updateOptions",
      {
        chart: {
          ...chart.optionsLine.chart,
          selection: {
            enabled: true,
            xaxis: {
              categories: channel_fft_data.map((el) => el.frequency),
            },
          },
        },
      },
      false,
      false
    );
  }

  const chart = useMemo(() => ({
    options: {
      chart: {
        toolbar: {
          show: true,
        },
        type: "line",
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
        width: 2,
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
    seriesLine: [
      {
        data: data,
      },
    ],
    optionsLine: {
      chart: {
        id: "chart1",
        height: 130,
        type: "area",
        events: {
          mounted: function (chartContext, config) {
            console.log("Loaded brush");
          },
        },
        brush: {
          target: "chart2",
          enabled: true,
        },
        selection: {
          enabled: true,
          xaxis: {
            min: 0,
            max: 512,
          },
        },
      },
      colors: ["#008FFB"],
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.91,
          opacityTo: 0.1,
        },
      },
      xaxis: {
        type: "numeric",
      },
      yaxis: {
        tickAmount: 2,
        decimalsInFloat: 3,
      },
    },
  }));

  const experiment_number = path.split("/")[1];
  const test_number = path.split("/")[2];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="modal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted
    >
      <Box className="inner">
        <div className="modal-header">
          <h3>{`Номер эксперимента: ${experiment_number}, номер теста: ${test_number}`}</h3>
          <Button variant="outlined" onClick={handleClose}>
            закрыть
          </Button>
        </div>
        <div className="main">
          {isLoading && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <CircularProgress />
              <p>Загрузка</p>
            </Stack>
          )}
          {isSuccess && (
            <Grid container spacing={5}>
              {data?.map((_, idx) => {
                const series = [
                  {
                    name: `Канал ${idx + 1}`,
                    data: [],
                  },
                ];

                const options = {
                  ...chart.options,
                  chart: { ...chart.options.chart, id: `spectrum_chart${idx}` },
                };
                options.title = { text: `Канал ${idx + 1}`, align: "left" };

                return (
                  <Grid item xs={6}>
                    <ReactApexChart
                      options={options}
                      series={series}
                      type="line"
                      height={300}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </div>
      </Box>
    </Modal>
  );
}

export default SpectrumModal;
