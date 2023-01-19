import React, { useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import { Formik, useFormik } from 'formik';
import { Box } from '@mui/system';
import { startMission, getAllFiles, generateResult, connectController } from '../api';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import MissionConfiguratorWidget from './MissionConfigurator/MissionConfiguratorWidget';
import ControllerConfigurator from './ControllerConfigurator/ControllerConfigurator';
import MissionModeConfig from './MissionConfigurator/MissionModeConfig';
import FileExplorer from './FileExplorer/FileExplorer';
import ResultGeneratorWidget from './ResultGeneratorWidget/ResultGeneratorWidget';
import useConfigureMission from '../hooks/useConfigureMission';

const MissionConfigSchema = Yup.object().shape({
  file_name: Yup.string()
    .max(50, 'Слишком длинное')
    .required('Обязательное поле'),
  directory_name: Yup.string()
    .max(50, 'Слишком длинное')
    .required('Обязательное поле'),
  data_count: Yup.number()
    .min(0, "От 0 до 128000")
    .max(128000, "От 0 до 128000")
    .required('Обязательное поле'),
  sample_rate: Yup.number()
    .min(0, "От 0 до 128000")
    .max(128000, "От 0 до 128000")
    .required('Обязательное поле'),
  repeat_times: Yup.number()
    .min(0, "От 0 до 128000")
    .max(128000, "От 0 до 128000")
    .required('Обязательное поле'),
  repeat_interval: Yup.number()
    .min(0, "От 0 до 86400")
    .max(86400, "От 0 до 86400")
    .required('Обязательное поле'),
});

export default function Content() {
  const [allFiles, setAllFiles] = useState({})
  const toastId = React.useRef(null);

  async function fetchFiles() {
    const res = await getAllFiles().catch(err => console.log(err.message))
    setAllFiles(res)
  }

  useEffect(() => {
    fetchFiles()
    connectController()
  }, [])

  const ChannelConfig = useConfigureMission({})

  const formik = {
    initialValues: {
      input_type: 'PseudoDifferential',
      trigger_source: 'NoWait',
      repeat_interval: '5000',
      repeat_times: '1',
      sample_rate: 16000,
      data_count: 16000,
      file_name: '',
      directory_name: '',
      channels: [
      ],
      modal_open: false,
      current_channel: null
    },
    validationSchema: MissionConfigSchema,
    onSubmit: async (values) => {
      toastId.current = toast(<Box sx={{ display: 'flex', alignItems: 'center', gap: "15px" }}><CircularProgress size="30px" /> <p>Загрузка...</p></Box>, { position: 'bottom-right', hideProgressBar: true })

      await startMission({...values, channel_config: ChannelConfig.config}).then((res) => {
        toast.update(toastId.current, { render: `Миссия запущена`, position: 'bottom-right', type: 'success', autoClose: values.data_count/values.sample_rate*1000+3000, hideProgressBar: false })

        setTimeout(() => {
          toast(`Миссия успешно завершена!`, { position: 'bottom-right', type: 'success', autoClose: 3000, hideProgressBar: true })
        }, values.data_count/values.sample_rate*1000+3500)

      }).catch(err => {
        toast.update(toastId.current, { render: err.message, position: 'bottom-right', type: 'error' })
      })
    }

  };
  
  return (
    <Box sx={{ maxWidth: 1220, margin: 'auto', overflow: 'hidden' }}>
      <Formik {...formik}>
        {props => (
          <form
            onSubmit={props.handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
          >
            <ControllerConfigurator />

            <MissionConfiguratorWidget ChannelConfig={ChannelConfig}/>

            <MissionModeConfig/>

            <Button
              variant="contained"
              size='large'
              sx={{ marginTop: '50px', marginLeft: 'auto' }}
              type="submit"
              disabled={props.isSubmitting}
            >
              Начать миссию
            </Button>

          </form>
        )}
      </Formik>

      <ResultGeneratorWidget generateResult={generateResult} />
      <FileExplorer allFiles={allFiles} refresh={fetchFiles} />

    </Box>
  );
}