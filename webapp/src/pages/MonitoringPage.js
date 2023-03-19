import { Box, Button } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import ControllerConfigurator from "../components/ControllerConfigurator/ControllerConfigurator";
import MissionConfiguratorWidget from "../components/MissionConfigurator/MissionConfiguratorWidget";
import * as Yup from 'yup'

const MissionConfigSchema = Yup.object().shape({
    file_name: Yup.string()
        .max(50, 'Слишком длинное')
        .required('Обязательное поле'),
    directory_name: Yup.string()
        .max(50, 'Слишком длинное')
        .required('Обязательное поле'),
    record_duration: Yup.number()
        .min(0, 'От 0 до 600c')
        .max(600, 'От 0 до 600c')
        .required('Обязательное поле'),
    data_count: Yup.number()
        .min(0, 'От 0 до 128000')
        .max(7680000, 'От 0 до 7680000')
        .required('Обязательное поле'),
    sample_rate: Yup.number()
        .min(0, 'От 0 до 128000')
        .max(128000, 'От 0 до 128000')
        .required('Обязательное поле'),
    repeat_times: Yup.number()
        .min(0, 'От 0 до 128000')
        .max(128000, 'От 0 до 128000')
        .required('Обязательное поле'),
    repeat_interval: Yup.number()
        .min(0, 'От 0 до 86400')
        .max(86400, 'От 0 до 86400')
        .required('Обязательное поле'),
})

function MonitoringPage() {
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
      file_name: "",
      directory_name: "",
      comment: "",
      channels: [],
      modal_open: false,
      current_channel: null,
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
          toast.update(toastId.current, {
            render: `Миссия запущена`,
            position: "bottom-right",
            type: "success",
            autoClose: (values.data_count / values.sample_rate) * 1000 + 3000,
            hideProgressBar: false,
          });

          setTimeout(() => {
            toast(`Миссия успешно завершена!`, {
              position: "bottom-right",
              type: "success",
              autoClose: 3000,
              hideProgressBar: true,
            });

            const [new_dir, new_file] = getNextMission(
              values.directory_name,
              values.file_name
            );
            // Auto increment file_name
            actions.setFieldValue("file_name", new_file);
            actions.setFieldValue("directory_name", new_dir);

            //poll the csv file from server

            pollFile({
              timeout: 300 * 1000,
              path: `${values.directory_name}/${values.file_name}/metrics.json`,
            })
              .then((res) => {
                console.log(transformMetrics(res));
                // setParamsData(data.map(_transformToStatData))
                setMetricsData(transformMetrics(res));
              })
              .catch((err) => console.log(err));
          }, (values.data_count / values.sample_rate) * 1000 + 3500);
        })
        .catch((err) => {
          let msg = err.message;
          console.log(msg);

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

  return (
    <Box sx={{ maxWidth: 1220, margin: "auto", overflow: "hidden" }}>
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
            <ControllerConfigurator
              onSave={() => setModalOpen(true)}
              onSelect={() => setSelectOpen(true)}
              profile={selectedProfile}
            />

            <MissionConfiguratorWidget
              ChannelConfig={ChannelConfig}
              paramsData={paramsData}
              metrics={metricsData}
            />

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

export default MonitoringPage;
