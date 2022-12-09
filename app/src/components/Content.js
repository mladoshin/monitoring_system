import React, { useState, useEffect, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, OutlinedInput, Select, Slider } from '@mui/material';
import { InputLabel } from '@mui/material';
import SelectInput from '@mui/material/Select/SelectInput';
import { useFormik } from 'formik';
import { Box } from '@mui/system';
import { startMission, getAllFiles, generateResult } from '../api';
import FolderIcon from '@mui/icons-material/Folder';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import * as Yup from 'yup';

const MissionConfigSchema = Yup.object().shape({
  file_name: Yup.string()
    .max(50, 'Too Long!')
    .required('Required'),
  directory_name: Yup.string()
    .max(50, 'Too Long!')
    .required('Required'),
  data_count: Yup.number()
    .min(0)
    .max(128000)
    .required('Required'),
  sample_rate: Yup.number()
    .min(0)
    .max(128000)
    .required('Required'),
});

const ErrorMessage = ({error, touched}) => {
  if(!touched) return null

  return (
    <span style={{display: 'block', color: "#f44336"}}>{error}</span>
  )
}

export default function Content() {
  const [allFiles, setAllFiles] = useState({})

  async function fetchFiles() {
    const res = await getAllFiles().catch(err => console.log(err.message))
    setAllFiles(res)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const formik = useFormik({
    initialValues: {
      input_type: 'PseudoDifferential',
      trigger_source: 'NoWait',
      repeat_interval: '5000',
      repeat_times: '1',
      sample_rate: 16000,
      data_count: 16000,
      file_name: '',
      directory_name: ''
    },
    validationSchema: MissionConfigSchema,
    onSubmit: values => {

      //startMission(values).then(() => alert("Success")).catch(err => alert("Error!"))
    }

  });

  console.log(formik.touched)

  return (
    <Box sx={{ maxWidth: 1220, margin: 'auto', overflow: 'hidden' }}>
      <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Paper sx={{ padding: '25px' }}>
          <Typography variant='h5'>
            Конфигурация контроллера
          </Typography>

          <Grid container spacing={2}>
            <Grid item>
              <InputLabel>Тип ввода</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.input_type}
                placeholder="Тип ввода"
                name="input_type"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="PseudoDifferential">PseudoDifferential</MenuItem>
              </Select>
              <ErrorMessage error={formik.errors.input_type} touched={formik.touched.input_type}/>
            </Grid>

            <Grid item>
              <InputLabel>Триггер</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.trigger_source}
                placeholder="Триггер"
                name="trigger_source"
                onChange={formik.handleChange}
                sx={{ width: '100px' }}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="NoWait">NoWait</MenuItem>
                <MenuItem value="AI0">AI0</MenuItem>
                <MenuItem value="AI1">AI1</MenuItem>
                <MenuItem value="AI2">AI2</MenuItem>
                <MenuItem value="AI3">AI3</MenuItem>

                <MenuItem value="DIO0">DIO0</MenuItem>
                <MenuItem value="DIO1">DIO1</MenuItem>
                <MenuItem value="DIO2">DIO2</MenuItem>
                <MenuItem value="DIO3">DIO3</MenuItem>

              </Select>
              <ErrorMessage error={formik.errors.trigger_source} touched={formik.touched.trigger_source}/>
            </Grid>

            <Grid item>
              <InputLabel>Интервал, мс</InputLabel>
              <TextField
                id="repeat_interval"
                placeholder="Интервал, мс"
                variant="outlined"
                type="number"
                name="repeat_interval"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.repeat_interval}
              />
              <ErrorMessage error={formik.errors.repeat_interval} touched={formik.touched.repeat_interval}/>
            </Grid>

            <Grid item>
              <InputLabel>Количество итераций</InputLabel>
              <TextField
                id="repeat_times"
                placeholder="Количество итераций"
                variant="outlined"
                type="number"
                name="repeat_times"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.repeat_times}
              />
              <ErrorMessage error={formik.errors.repeat_times} touched={formik.touched.repeat_times}/>
            </Grid>

            <Grid item>
              <InputLabel>Частота обработки</InputLabel>
              <TextField
                id="sample_rate"
                placeholder="Частота обработки"
                variant="outlined"
                type="number"
                name="sample_rate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sample_rate}
              />
              <ErrorMessage error={formik.errors.sample_rate} touched={formik.touched.sample_rate}/>
            </Grid>

            <Grid item>
              <InputLabel>Число точек</InputLabel>
              <TextField
                id="data_count"
                placeholder="Число точек"
                variant="outlined"
                type="number"
                name="data_count"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.data_count}
              />
              <ErrorMessage error={formik.errors.data_count} touched={formik.touched.data_count}/>
            </Grid>

          </Grid>

        </Paper>

        <Paper sx={{ width: '100%', padding: '25px', marginTop: '50px' }}>
          <Typography variant='h5'>
            Параметры испытания
          </Typography>


          <Grid container spacing={2}>
            <Grid item>
              <InputLabel>Имя каталога</InputLabel>
              <TextField
                id="directory_name"
                placeholder="Имя каталога"
                variant="outlined"
                type="text"
                name="directory_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.directory_name}
              />
              <ErrorMessage error={formik.errors.directory_name} touched={formik.touched.directory_name}/>
            </Grid>

            <Grid item>
              <InputLabel>Имя файла</InputLabel>
              <TextField
                id="file_name"
                placeholder="Имя файла"
                variant="outlined"
                type="text"
                name="file_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.file_name}
              />
              <ErrorMessage error={formik.errors.file_name} touched={formik.touched.file_name}/>
            </Grid>

          </Grid>

        </Paper>

        <Button
          variant="contained"
          size='large'
          sx={{ marginTop: '50px', marginLeft: 'auto' }}
          type="submit"
        >
          Начать миссию
        </Button>

      </form>

      <ResultGenerator generateResult={generateResult} />
      <FileExplorer allFiles={allFiles} refresh={fetchFiles} />

    </Box>
  );
}

// function FileList({ files }) {
//   return (
//     files?.map((file, idx) => (

//     ))
//   )
// }

function FileExplorer({ allFiles, refresh }) {
  const [currentFolder, setCurrentFolder] = useState({ file: '' })
  const [subtree, setSubTree] = useState({ ...allFiles })
  const [path, setPath] = useState('')

  useEffect(() => {
    if (!currentFolder.file) {
      setSubTree({ ...allFiles })
      return
    }
    setPath(p => `${p}/${currentFolder.file}`)
    setSubTree(st => st[currentFolder.file])
  }, [currentFolder, allFiles])

  const files = useMemo(() => {
    return Object.keys(subtree)
  }, [subtree])

  function goUp() {
    const newpath = path.split("/").slice(0, -1).join('/')
    setPath(newpath)

    const keys = newpath.split("/").filter(k => k !== '')

    let temp = allFiles
    for (let key of keys) {
      console.log(temp)
      temp = temp[key]
    }

    setSubTree({ ...temp })
  }

  return (
    <Paper sx={{ padding: '25px' }}>

      <Toolbar >
        <Button sx={{ marginLeft: 'auto' }} onClick={goUp}>
          <ArrowUpwardIcon />
        </Button>
        <span>{path}</span>
        <Button sx={{ marginLeft: 'auto' }} onClick={refresh}>
          <ReplayIcon />
          Refresh
        </Button>
      </Toolbar>

      <Box sx={{ display: 'flex', height: "400px" }}>
        <List dense={true} sx={{ width: "100%" }}>
          {files.map((folder_name, idx) => (
            <ListItemButton
              key={`${folder_name}${Math.round(Math.random() * Date.now())}`}
              onDoubleClick={() => setCurrentFolder(st => ({ ...st, file: folder_name }))}
            // selected={folder_name === currentFolder}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={folder_name}
              />
            </ListItemButton>

          ))}
        </List>

      </Box>

    </Paper>
  )
}

function ResultGenerator({ generateResult }) {

  const formik = useFormik({
    initialValues: {
      folder_name: '',
      file_name: ''
    },
    onSubmit: values => {
      console.log(values)
      generateResult(values)
        .then(res => {
          console.log(res)
          handleDownloadFile(res, `${formik.values.file_name}.csv`)
        })
        .catch(err => console.log(err))
    },
  });

  function handleDownloadFile(data, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  return (
    <Paper sx={{ padding: '25px', marginTop: "50px", marginBottom: "50px" }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container alignItems="center" columnSpacing={4}>
          <Grid item xs={6}>
            <InputLabel>Номер режима испытания (имя папки)</InputLabel>
            <TextField
              id="outlined-basic"
              placeholder="Имя папки"
              variant="outlined"
              type="text"
              name="folder_name"
              value={formik.values.folder_name}
              onChange={formik.handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={6}>
            <InputLabel>Имя нового файла</InputLabel>
            <TextField
              id="outlined-basic"
              placeholder="Имя нового файла"
              variant="outlined"
              type="text"
              name="file_name"
              value={formik.values.file_name}
              onChange={formik.handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>

        </Grid>

        <Grid container justifyContent="end" sx={{ marginTop: "25px" }}>
          <Grid item>
            <Button variant='contained' type="submit">
              Сформировать результат
            </Button>
          </Grid>
        </Grid>

      </form>
    </Paper>
  )
}