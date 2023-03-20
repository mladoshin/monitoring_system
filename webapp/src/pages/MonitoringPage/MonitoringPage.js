import { Box, Button, Card, CircularProgress, Grid } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ControllerConfigurator from "../../components/ControllerConfigurator/ControllerConfigurator";
import MissionConfiguratorWidget from "../../components/MissionConfigurator/MissionConfiguratorWidget";
import * as Yup from "yup";
import useConfigureMission from "../../hooks/useConfigureMission";
import MonitoringControl from "../../components/MonitoringControl/MonitoringControl";
import GraphMonitor from "../../components/GraphMonitor/GraphMonitor";
import { toast } from "react-toastify";
import { startMission, stopMission } from "../../api";
import { MODE } from "../../../enums";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../../../../server/EventService";

const MissionConfigSchema = Yup.object().shape({
  file_name: Yup.string()
    .max(50, "Слишком длинное")
    .required("Обязательное поле"),
  directory_name: Yup.string()
    .max(50, "Слишком длинное")
    .required("Обязательное поле"),
  record_duration: Yup.number()
    .min(0, "От 0 до 600c")
    .max(600, "От 0 до 600c")
    .required("Обязательное поле"),
  data_count: Yup.number()
    .min(0, "От 0 до 128000")
    .max(7680000, "От 0 до 7680000")
    .required("Обязательное поле"),
  sample_rate: Yup.number()
    .min(0, "От 0 до 128000")
    .max(128000, "От 0 до 128000")
    .required("Обязательное поле"),
  repeat_times: Yup.number()
    .min(0, "От 0 до 128000")
    .max(128000, "От 0 до 128000")
    .required("Обязательное поле"),
  repeat_interval: Yup.number()
    .min(0, "От 0 до 86400")
    .max(86400, "От 0 до 86400")
    .required("Обязательное поле"),
});

function MonitoringPage() {
  const ChannelConfig = useConfigureMission({});
  const toastId = React.useRef(null);

  const [monitoringData, setMonitoringData] = useState(Array.from(Array(4).keys()).map(el => []))

  useEffect(()=>{

    const socket = io("ws://localhost:3000", {
      reconnectionDelayMax: 10000
    });

    socket.on(SOCKET_EVENTS.MISSION_COMPLETE, ({data}) => {
      console.log("Mission data received!");
      console.log(data)
      setMonitoringData(Object.values(data).map(el => el['G']).filter(el => Array.isArray(el)))  
    });
  }, [])

  const formik = {
    initialValues: {
      input_type: "PseudoDifferential",
      trigger_source: "NoWait",
      repeat_interval: 5,
      repeat_times: "1",
      sample_rate: 16000,
      data_count: 16000,
      record_duration: 1,
      file_name: "",
      directory_name: "",
      comment: "",
      channels: [],
      modal_open: false,
      current_channel: null,
    },
    validationSchema: MissionConfigSchema,
    onSubmit: async (values, actions) => {
      console.log(values);
    },
  };

  async function handleStart() {
    toastId.current = toast(
      <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CircularProgress size="30px" /> <p>Загрузка...</p>
      </Box>,
      { position: "bottom-right", hideProgressBar: true }
    );

    await startMission({
      input_type: "PseudoDifferential",
      trigger_source: "NoWait",
      repeat_times: 0,
      record_duration: 0.1,
      sample_rate: 1000,
      data_count: 100,
      repeat_interval: 500,
      channel_config: ChannelConfig.config,
      mode: MODE.MONITORING,
    })
      .then(() => {
        toast.update(toastId.current, {
          render: "Миссия успешно запущена!",
          position: "bottom-right",
          type: "success",
        });
      })
      .catch((err) => {
        let msg = err.message;

        toast.update(toastId.current, {
          render: msg,
          position: "bottom-right",
          type: "error",
        });
      });
  }

  async function handleStop() {
    toastId.current = toast(
      <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CircularProgress size="30px" /> <p>Загрузка...</p>
      </Box>,
      { position: "bottom-right", hideProgressBar: true }
    );

    await stopMission().then(() => {
      toast.update(toastId.current, {
        render: "Миссия успешно завершена",
        position: "bottom-right",
        type: "success",
      });
    });
  }

  return (
    <Box sx={{ margin: "auto", overflow: "hidden", width: "100%" }}>
      <Formik {...formik}>
        {(props) => (
          <form
            onSubmit={props.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
              }
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Grid container>
                  <Grid item xs={12}>
                    <Card>Metrics component (edited)</Card>
                  </Grid>

                  {/* Graph monitor with line chart for every channel */}
                  <GraphMonitorWidget data={monitoringData} />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container>
                  {/* Monitoring Control widget */}
                  <MonitoringControlWidget
                    onStart={handleStart}
                    onStop={handleStop}
                  />

                  {/* Channel configuration widget */}
                  <Grid item xs={12}>
                    <MissionConfiguratorWidget ChannelConfig={ChannelConfig} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                marginBottom: "3rem",
                marginTop: "1rem",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{ marginLeft: "auto" }}
                type="submit"
                disabled={props.isSubmitting}
              >
                Начать миссию
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function MonitoringControlWidget(props) {
  return (
    <Grid item xs={12}>
      <MonitoringControl {...props} />
    </Grid>
  );
}

function GraphMonitorWidget(props) {
  return (
    <Grid item xs={12}>
      <GraphMonitor {...props} />
    </Grid>
  );
}

export default MonitoringPage;