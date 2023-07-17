import React, { useState, useEffect, useMemo, useRef } from "react";
import Button from "@mui/material/Button";
import { Formik, useFormik } from "formik";
import { Box } from "@mui/system";
import {
  startMission,
  getAllFiles,
  generateResult,
  //connectController,
  getUserProfiles,
} from "../api";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import MissionConfiguratorWidget from "./MissionConfigurator/MissionConfiguratorWidget";
import ControllerConfigurator from "./ControllerConfigurator/ControllerConfigurator";
import MissionModeConfig from "./MissionConfigurator/MissionModeConfig";
import FileExplorer from "./FileExplorer/FileExplorer";
import ResultGeneratorWidget from "./ResultGeneratorWidget/ResultGeneratorWidget";
import useConfigureMission from "../hooks/useConfigureMission";
import useProfiles from "../hooks/useProfiles";
import ProfileModal from "./ProfileModal";
import { _transformToStatData } from "../../../common/utils/utils.mjs";
import { preventEnterKey, transformMetrics } from "../utils/utils";
import { MODE, SOCKET_EVENTS } from "../../../common/enums.mjs";
import {
  incrementCounter16,
  incrementCounter32,
  resetCounters,
  setConfig,
  setCounter16,
  setCounter32,
  setLoading,
} from "../store/slices/missionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useConnectControllerMutation } from "../store/api";
import { setConnected } from "../store/slices/controllerSlice";
import { setFiles } from "../store/slices/fileSlice";
import FileModal from "./FileExplorer/FileModal";
import SocketService from "../utils/SocketService";
import { useNavigate } from "react-router";

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

function formatNumber(num) {
  if (num < 10) {
    return "00" + num;
  } else if (num < 100) {
    return "0" + num;
  } else if (num < 999) {
    return JSON.stringify(nums);
  }
}

function getNextMission(dir, file) {
  const idx = file.indexOf("vibro");
  if (idx != -1) {
    let number_str = parseInt(file.substr(idx + 5, 3));
    number_str++;
    const file_name = file.slice(0, -3) + formatNumber(number_str);
    return [dir, file_name];
  }

  return [dir, file];
}

export default function Content() {
  const {
    userProfiles,
    addProfile,
    selectedProfile,
    setSelectedProfile,
    removeProfile,
  } = useProfiles();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const { status } = useSelector((state) => state.mission);
  const {
    metrics: metricsData,
    counter16,
    counter32,
  } = useSelector((state) => state.mission);

  const navigate = useNavigate();
  const formikRef = useRef(null);
  const dispatch = useDispatch();

  const toastId = React.useRef(null);
  const Config = useConfigureMission({});

  //process the status of a mission and update a toast message
  useEffect(() => {
    if (!toastId.current) return;

    if (status === 2) {
      toast.update(toastId.current, {
        render: (
          <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <CircularProgress size="30px" /> <p>Миссия запущена...</p>
          </Box>
        ),
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
      });
    } else if (status === 0) {
      toast.update(toastId.current, {
        render: `Миссия успешно завершена!`,
        position: "bottom-right",
        type: "success",
        autoClose: 3000,
        hideProgressBar: true,
      });

      const { file_name, directory_name, show_results } =
        formikRef.current.values;

      //increment test number by one
      updateTestNumber();

      //show results if needed
      if (show_results && directory_name && file_name) {
        navigate(`/missions?mode=${directory_name}&test=${file_name}`);
      }
    }
  }, [status]);

  useEffect(() => {
    console.log("Set formik values");
    formikRef.current.setValues(Config.controllerConfig);
    const file_name = Config.controllerConfig.file_name;

    const idx = file_name.indexOf("vibro");
    if (idx != -1) {
      const number = parseInt(file_name.substr(idx + 5, 3));
      if (file_name.indexOf("16000") != -1) {
        dispatch(setCounter16(number));
      } else if (file_name.indexOf("32000") != -1) {
        dispatch(setCounter32(number));
      }
    }
  }, [Config.controllerConfig]);

  function updateTestNumber() {
    console.log("update test number");
    const [new_dir, new_file] = getNextMission(
      formikRef.current.values.directory_name,
      formikRef.current.values.file_name
    );

    if (formikRef.current.values.file_name.indexOf("16000") != -1) {
      dispatch(incrementCounter16());
    } else if (formikRef.current.values.file_name.indexOf("32000") != -1) {
      dispatch(incrementCounter32());
    }

    Config.updateTestNumber(new_dir, new_file);
    // Auto increment file_name
    formikRef.current.setFieldValue("file_name", new_file);
    formikRef.current.setFieldValue("directory_name", new_dir);
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
      mode: MODE.TESTING,
      show_results: true,
    },
    validationSchema: MissionConfigSchema,
    onSubmit: async (values, actions) => {
      toastId.current = toast(
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <CircularProgress size="30px" /> <p>Загрузка...</p>
        </Box>,
        { position: "bottom-right", hideProgressBar: true }
      );

      Config.saveControllerConfig(values);

      //start mission
      try {
        const res = await startMission({
          ...values,
          repeat_interval: values.repeat_interval * 1000,
          channel_config: Config.config,
        });

        // set mission status to loading
        dispatch(setLoading());
      } catch (err) {
        //handle mission errors
        onMissionError(err, values, actions);
      }
    },
  };

  function onMissionError(err, values, actions) {
    let msg = err.message;
    //console.log(msg);

    if (err.response.status === 300) {
      msg = err.response.data.msg;
    }

    toast.update(toastId.current, {
      render: msg,
      position: "bottom-right",
      type: "error",
    });

    if (err.response.status === 300) {
      if (
        confirm(
          `Вы уверены, что хотите перезаписать миссию ${values.directory_name}-${values.file_name}?`
        )
      ) {
        formik.onSubmit({ ...values, force: true }, actions);
      }
    }
  }

  //handle select the user profile
  function handleSelectProfile(name, values) {
    setSelectedProfile(name);
    addProfile({
      name,
      data: { ...values, channel_config: Config.config },
    });
    setModalOpen(false);
    Config.saveControllerConfig(values);
  }

  // fetch the user profile and update the ui
  async function handleFetchProfile(name, setValues) {
    const res = await getUserProfiles({ profile_name: name });
    const { channel_config, ...rest } = res;
    //await setValues(rest);
    Config.setConfig(channel_config);

    if (name === "vibro_16.json") {
      rest.file_name = `16000 Гц/vibro${formatNumber(counter16)}`;
    } else if (name === "vibro_32.json") {
      rest.file_name = `32000 Гц/vibro${formatNumber(counter32)}`;
    }

    rest.directory_name = formikRef.current.values.directory_name;

    Config.saveControllerConfig(rest);
  }

  return (
    <Box sx={{ maxWidth: 1220, margin: "auto", overflow: "hidden" }}>
      <Formik {...formik} innerRef={formikRef}>
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
            <ControllerConfigurator
              onSave={() => setModalOpen(true)}
              onSelect={() => setSelectOpen(true)}
              profile={selectedProfile}
              handleFetchProfile={(name) => {
                setSelectedProfile(name);
                handleFetchProfile(name, props.setValues);
              }}
            />

            <MissionConfiguratorWidget
              ChannelConfig={Config}
              metrics={metricsData}
              style={{ mt: 3, py: 2 }}
            />

            <MissionModeConfig />

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

            <ProfileModal
              profiles={userProfiles}
              open={modalOpen}
              handleClose={() => setModalOpen(false)}
              onSelect={(name) => handleSelectProfile(name, props.values)}
              onDelete={(name) => removeProfile(name)}
              selectedProfile={selectedProfile}
            />

            <ProfileModal
              select={true}
              profiles={userProfiles}
              open={selectOpen}
              handleClose={() => setSelectOpen(false)}
              onDelete={(name) => removeProfile(name)}
              onSelect={(name) => {
                // handleSelectProfile(name, props.values)
                setSelectedProfile(name);
                setSelectOpen(false);
                handleFetchProfile(name, props.setValues);
              }}
              selectedProfile={selectedProfile}
            />
          </form>
        )}
      </Formik>

      <FileExplorer />
    </Box>
  );
}
