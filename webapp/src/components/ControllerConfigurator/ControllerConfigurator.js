import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage";

function ControllerConfigurator({
  onSave,
  profile,
  onSelect,
  is_monitoring = false,
  handleFetchProfile,
  startMission,
}) {
  const formik = useFormikContext();
  const [dataCountMode, setDataCountMode] = useState(false);
  const handleChangeDuration = (duration) => {
    const { sample_rate } = formik.values;
    if (duration < 0) return;

    const data_count = duration * sample_rate;
    formik.setFieldValue("data_count", data_count);
    formik.setFieldValue("record_duration", duration);
  };

  const handleChangeSampleRate = (sample_rate) => {
    const { record_duration, data_count } = formik.values;

    if (dataCountMode) {
      const record_duration = data_count / sample_rate;
      formik.setFieldValue("record_duration", record_duration);
    } else {
      const data_count = sample_rate * record_duration;
      formik.setFieldValue("data_count", data_count);
    }

    formik.setFieldValue("sample_rate", sample_rate);
  };

  const handleChangeDataCount = (data_count) => {
    const { sample_rate } = formik.values;

    const record_duration = data_count / sample_rate;
    formik.setFieldValue("data_count", data_count);
    formik.setFieldValue("record_duration", record_duration);
  };

  const constrainInput = (min, max) => {
    return (e, handleChange) => {
      const val = e.target.value;
      if (val < min || val > max) return;

      handleChange(e);
    };
  };

  const inputInterval = constrainInput(0, 600);
  const inputRepeatTimes = constrainInput(0, 99999);
  const inputSampleRate = constrainInput(0, 128000);
  const inputDuration = constrainInput(0, 600);
  const inputDataCount = constrainInput(0, 7680000);

  useEffect(() => {
    const { record_duration, sample_rate } = formik.values;
    formik.setFieldValue("data_count", sample_rate * record_duration);
  }, []);

  return (
    <Paper sx={{ padding: "25px" }}>
      <Typography variant="h5">Конфигурация контроллера</Typography>

      <Grid container spacing={2}>
        <Grid item>
          <InputLabel>Тип сигнала</InputLabel>
          <Select
            error={formik.errors?.input_type && formik.touched?.input_type}
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
          <ErrorMessage
            error={formik.errors.input_type}
            touched={formik.touched.input_type}
          />
        </Grid>

        <Grid item>
          <InputLabel>Триггер</InputLabel>
          <Select
            error={
              formik.errors.trigger_source && formik.touched.trigger_source
            }
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formik.values.trigger_source}
            placeholder="Триггер"
            name="trigger_source"
            onChange={formik.handleChange}
            sx={{ width: "100px" }}
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
          <ErrorMessage
            error={formik.errors.trigger_source}
            touched={formik.touched.trigger_source}
          />
        </Grid>

        {!is_monitoring && (
          <Grid item>
            <InputLabel>Период записи, с</InputLabel>
            <TextField
              error={
                formik.errors.repeat_interval && formik.touched.repeat_interval
              }
              id="repeat_interval"
              placeholder="Интервал, мс"
              variant="outlined"
              type="number"
              name="repeat_interval"
              onChange={(e) => inputInterval(e, formik.handleChange)}
              onBlur={formik.handleBlur}
              value={formik.values.repeat_interval}
            />
            <ErrorMessage
              error={formik.errors.repeat_interval}
              touched={formik.touched.repeat_interval}
            />
          </Grid>
        )}

        {!is_monitoring && (
          <Grid item>
            <InputLabel>Количество периодов</InputLabel>
            <TextField
              error={formik.errors.repeat_times && formik.touched.repeat_times}
              id="repeat_times"
              placeholder="Количество итераций"
              variant="outlined"
              type="number"
              name="repeat_times"
              onChange={(e) => inputRepeatTimes(e, formik.handleChange)}
              onBlur={formik.handleBlur}
              value={formik.values.repeat_times}
            />
            <ErrorMessage
              error={formik.errors.repeat_times}
              touched={formik.touched.repeat_times}
            />
          </Grid>
        )}

        <Grid item>
          <InputLabel>Частота дискретизации</InputLabel>
          <TextField
            error={formik.errors.sample_rate && formik.touched.sample_rate}
            id="sample_rate"
            placeholder="Частота обработки"
            variant="outlined"
            type="number"
            name="sample_rate"
            onChange={(e) =>
              inputSampleRate(e, (e) => handleChangeSampleRate(e.target.value))
            }
            onBlur={formik.handleBlur}
            value={formik.values.sample_rate}
          />
          <ErrorMessage
            error={formik.errors.sample_rate}
            touched={formik.touched.sample_rate}
          />
        </Grid>

        {!is_monitoring && (
          <Grid item>
            <InputLabel>Время записи, с</InputLabel>
            <TextField
              error={
                formik.errors.record_duration && formik.touched.record_duration
              }
              id="record_duration"
              placeholder="Время записи"
              variant="outlined"
              type="number"
              name="record_duration"
              onChange={(e) =>
                inputDuration(e, (e) => handleChangeDuration(e.target.value))
              }
              onBlur={formik.handleBlur}
              value={formik.values.record_duration}
              disabled={dataCountMode}
            />
            <ErrorMessage
              error={formik.errors.record_duration}
              touched={formik.touched.record_duration}
            />
          </Grid>
        )}

        <Grid item>
          <InputLabel>Число точек</InputLabel>
          <TextField
            error={formik.errors.data_count && formik.touched.data_count}
            id="data_count"
            placeholder="Число точек"
            variant="outlined"
            type="number"
            name="data_count"
            onBlur={formik.handleBlur}
            value={formik.values.data_count}
            disabled={!dataCountMode}
            onChange={(e) =>
              inputDataCount(e, (e) => handleChangeDataCount(e.target.value))
            }
          />
          <ErrorMessage
            error={formik.errors.data_count}
            touched={formik.touched.data_count}
          />
        </Grid>
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dataCountMode}
                onChange={(val) => setDataCountMode(val.target.checked)}
              />
            }
            label="Указать количество точек явно"
            sx={{ marginTop: "23px" }}
          />
        </Grid>
      </Grid>

      {!is_monitoring && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pt: "50px",
            gap: "1rem",
          }}
        >
          <Button variant="outlined" size="large" onClick={onSave}>
            Сохранить
          </Button>

          <Button variant="outlined" size="large" onClick={onSelect}>
            Загрузить
          </Button>

          {profile && (
            <span>
              <b>Текущая конфигурация:</b> {profile}
            </span>
          )}

          <Box sx={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                handleFetchProfile("vibro_16.json")
              }}
              sx={{ marginRight: 2 }}
            >
              Режим 16 кГц
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={() => {
                handleFetchProfile("vibro_32.json")
              }}
            >
              Режим 32 кГц
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default ControllerConfigurator;
