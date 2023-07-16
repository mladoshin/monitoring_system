import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import MissionConfiguratorWidget from "../../components/MissionConfigurator/MissionConfiguratorWidget";
import * as Yup from "yup";
import useConfigureMission from "../../hooks/useConfigureMission";
import MonitoringControl from "../../components/MonitoringControl/MonitoringControl";
import GraphMonitor from "../../components/GraphMonitor/GraphMonitor";
import { toast } from "react-toastify";
import { startMission, stopMission } from "../../api";
import { MODE } from "../../../../common/enums.mjs";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../../../../common/enums.mjs";
import ParameterMonitor from "../../components/ParameterMonitor/ParameterMonitor";
import SocketService from "../../utils/SocketService";

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

const initMaxRange = [
  { min: null, max: null },
  { min: null, max: null },
  { min: null, max: null },
  { min: null, max: null },
];

const MonitoringControlWidget = withItemWrapper(MonitoringControl);
const GraphMonitorWidget = withItemWrapper(GraphMonitor);
const ParameterMonitorWidget = withItemWrapper(ParameterMonitor);

function centerSignal(data) {
  let offsets = [];

  data.forEach((ch, idx) => {
    let sum = 0;
    for (let i = 0; i < ch.length; i++) {
      sum += ch[i];
    }
    offsets.push(sum / ch.length);
  });

  let tmp = [];

  data.forEach((ch, idx) => {
    tmp.push(ch.map((el) => el - offsets[idx]));
  });

  return tmp;
}

function MonitoringPage() {
  const ChannelConfig = useConfigureMission({ monitoring: true });
  const toastId = React.useRef(null);
  const running = React.useRef(false);

  const [monitoringData, setMonitoringData] = useState(
    Array.from(Array(4).keys()).map((el) => [])
  );

  const [paramData, setParamData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [maxAmplitude, setMaxAmplitude] = useState([...initMaxRange]);

  useEffect(() => {
    const { socket } = new SocketService();

    socket.on(SOCKET_EVENTS.MISSION_COMPLETE, ({ data }) => {
      if (!running.current) {
        return;
      }
      
      console.log(data)

      Object.keys(data).map(key => {
        if(data[key].G){
          data[key].G = data[key].G.slice(0, 1000)
        }
      })
      
      //console.log(data)
      const tmp = centerSignal(
        Object.values(data)
          .map((el) => el["G"])
          .filter((el) => Array.isArray(el))
      );

      setMonitoringData(tmp);
    });
  }, []);

  useEffect(() => {
    const { socket } = new SocketService();

    socket.once(SOCKET_EVENTS.METRICS_UPDATE, onMetricUpdate);
  }, [paramData]);

  function resetMaxAmplitude() {
    setMaxAmplitude((state) => {
      let tmp = [...state];
      tmp.forEach((el) => {
        el.max = 0;
        el.min = 0;
      });

      return tmp
    });
  }


  function onMetricUpdate({ data }) {
    setParamData(data);
    const ranges = data.map((el) => ({ max: el.max, min: el.min }));

    const tmp = [...maxAmplitude];

    ranges.forEach((r, idx) => {
      if (tmp[idx].max === null || r.max > tmp[idx].max) {
        tmp[idx].max = r.max;
      }

      if (tmp[idx].min === null || r.min < tmp[idx].min) {
        tmp[idx].min = r.min;
      }
    });

    // console.log(tmp);

    setMaxAmplitude(tmp);
  }

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
      //console.log(values);
    },
  };

  async function handleStart() {
    toastId.current = toast(
      <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <CircularProgress size="30px" /> <p>Загрузка...</p>
      </Box>,
      { position: "bottom-right", hideProgressBar: true }
    );

    //reset the max range
    resetMaxAmplitude();

    return new Promise(async (resolve, reject) => {
      try {
        await startMission({
          input_type: "PseudoDifferential",
          trigger_source: "NoWait",
          repeat_times: 4,
          record_duration: 4.0,
          sample_rate: 16000,
          data_count: 16384,
          repeat_interval: 0,
          channel_config: ChannelConfig.config,
          mode: MODE.TEST_MONITORING,
        });

        running.current = true;
        toast.update(toastId.current, {
          render: "Миссия успешно запущена!",
          position: "bottom-right",
          type: "success",
        });
        resolve();
      } catch (err) {
        let msg = err.message;
        toast.update(toastId.current, {
          render: msg,
          position: "bottom-right",
          type: "error",
        });
        reject(err);
      }
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
      running.current = false;
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
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Grid container rowSpacing={2}>
                  <ParameterMonitorWidget
                    data={paramData}
                    channel={selectedChannel}
                    maxAmplitude={maxAmplitude}
                    resetMaxAmplitude={resetMaxAmplitude}
                  />

                  {/* Graph monitor with line chart for every channel */}
                  <GraphMonitorWidget
                    data={monitoringData}
                    channel={selectedChannel}
                    setChannel={setSelectedChannel}
                  />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container spacing={2}>
                  {/* Monitoring Control widget */}
                  <MonitoringControlWidget
                    onStart={handleStart}
                    onStop={handleStop}
                  />

                  {/* Channel configuration widget */}
                  <Grid item xs={12}>
                    <MissionConfiguratorWidget
                      ChannelConfig={ChannelConfig}
                      monitoring
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Box>
  );
}

function withItemWrapper(Component) {
  return (props) => {
    return (
      <Grid item xs={12}>
        <Component {...props} />
      </Grid>
    );
  };
}
export default MonitoringPage;
