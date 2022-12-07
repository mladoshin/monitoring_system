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

export default function Content() {
  const [allFiles, setAllFiles] = useState({})

  async function fetchFiles() {
    const res = await getAllFiles().catch(err => console.log(err.message))
    setAllFiles(res)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  console.log(allFiles)

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
    onSubmit: values => {
      startMission(values).then(() => alert("Success")).catch(err => alert("Error!"))
    },
  });

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
              >
                <MenuItem value="PseudoDifferential">PseudoDifferential</MenuItem>
              </Select>
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
            </Grid>

            <Grid item>
              <InputLabel>Интервал, мс</InputLabel>
              <TextField
                id="outlined-basic"
                placeholder="Интервал, мс"
                variant="outlined"
                type="number"
                name="repeat_interval"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item>
              <InputLabel>Количество итераций</InputLabel>
              <TextField
                id="outlined-basic"
                placeholder="Количество итераций"
                variant="outlined"
                type="number"
                name="repeat_times"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item>
              <InputLabel>Частота обработки</InputLabel>
              <TextField
                id="outlined-basic"
                placeholder="Частота обработки"
                variant="outlined"
                type="number"
                name="sample_rate"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item>
              <InputLabel>Число точек</InputLabel>
              <TextField
                id="outlined-basic"
                placeholder="Число точек"
                variant="outlined"
                type="number"
                Аname="data_count"
                onChange={formik.handleChange}
              />
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
                id="outlined-basic"
                placeholder="Имя каталога"
                variant="outlined"
                type="text"
                name="directory_name"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item>
              <InputLabel>Имя файла</InputLabel>
              <TextField
                id="outlined-basic"
                placeholder="Имя файла"
                variant="outlined"
                type="text"
                name="file_name"
                onChange={formik.handleChange}
              />
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

  // console.log('Subtree')
  // console.log(subtree)

  // console.log('current folder')
  // console.log(currentFolder)

  const files = useMemo(() => {
    return Object.keys(subtree)
  }, [subtree])

  function goUp() {
    const newpath = path.split("/").slice(0, -1).join('/')
    setPath(newpath)

    const keys = newpath.split("/").filter(k => k !== '')

    console.log(keys)

    let temp = allFiles
    for (let key of keys) {
      console.log(temp)
      temp = temp[key]
    }

    // console.log("temp")
    // console.log(temp)
    setSubTree({...temp})
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