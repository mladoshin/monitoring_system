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
import { setLoading } from "../store/slices/missionSlice";
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

function getNextMission(dir, file) {
  let directory = +dir;
  let file_name = +file;

  if (file_name === process.env.TEST_COUNT) {
    return [++directory, 1];
  } else {
    return [directory, ++file_name];
  }
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
  const { metrics: metricsData } = useSelector((state) => state.mission);

  const navigate = useNavigate();
  const formikRef = useRef(null);
  const dispatch = useDispatch();

  const toastId = React.useRef(null);

  //process the status of a mission and update a toast message
  useEffect(() => {
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

      //show results if needed
      if (show_results && directory_name && file_name) {
        navigate(`/missions?mode=${directory_name}&test=${file_name}`);
      }
    }
  }, [status]);

  const ChannelConfig = useConfigureMission({});

  const formik = {
    initialValues: {
      input_type: "PseudoDifferential",
      trigger_source: "NoWait",
      repeat_interval: 5,
      repeat_times: "1",
      sample_rate: 16000,
      data_count: 16000,
      record_duration: 1,
      file_name: 1,
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

      await startMission({
        ...values,
        repeat_interval: values.repeat_interval * 1000,
        channel_config: ChannelConfig.config,
      })
        .then((res) => {
          dispatch(setLoading());
          toast.update(toastId.current, {
            render: `Миссия запущена`,
            position: "bottom-right",
            type: "success",
            autoClose: (values.data_count / values.sample_rate) * 1000 + 3000,
            hideProgressBar: false,
          });

          setTimeout(() => {
            const [new_dir, new_file] = getNextMission(
              values.directory_name,
              values.file_name
            );
            // Auto increment file_name
            actions.setFieldValue("file_name", new_file);
            if (!isNaN(new_dir)) {
              actions.setFieldValue("directory_name", new_dir);
            }
          }, (values.data_count / values.sample_rate) * 1000 + 3500);
        })
        .catch((err) => {
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
        });
    },
  };

  //handle select the user profile
  function handleSelectProfile(name, values) {
    setSelectedProfile(name);
    addProfile({
      name,
      data: { ...values, channel_config: ChannelConfig.config },
    });
    setModalOpen(false);
  }

  // fetch the user profile and update the ui
  async function handleFetchProfile(name, setValues) {
    const res = await getUserProfiles({ profile_name: name });
    const { channel_config, ...rest } = res;
    await setValues(rest);
    ChannelConfig.setConfig(channel_config);
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
                const test_number = props.values.file_name;
                handleFetchProfile(name, props.setValues).then(() => {
                  console.log(props.values);
                  if (name === "vibro_16.json") {
                    props.setFieldValue("directory_name", "16кГц");
                  } else if (name === "vibro_32.json") {
                    props.setFieldValue("directory_name", "32кГц");
                  }
                  props.setFieldValue("file_name", test_number);

                  setTimeout(() => props.handleSubmit(), 250);
                });
              }}
            />

            <MissionConfiguratorWidget
              ChannelConfig={ChannelConfig}
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
