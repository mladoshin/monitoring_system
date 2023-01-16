import { Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import React from 'react'
import ErrorMessage from '../ErrorMessage';

function ControllerConfigurator() {
    const formik = useFormikContext();

    return (
        <Paper sx={{ padding: '25px' }}>
            <Typography variant='h5'>
                Конфигурация контроллера
            </Typography>

            <Grid container spacing={2}>
                <Grid item>
                    <InputLabel>Тип ввода</InputLabel>
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
                    <ErrorMessage error={formik.errors.input_type} touched={formik.touched.input_type} />
                </Grid>

                <Grid item>
                    <InputLabel>Триггер</InputLabel>
                    <Select
                        error={formik.errors.trigger_source && formik.touched.trigger_source}
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
                    <ErrorMessage error={formik.errors.trigger_source} touched={formik.touched.trigger_source} />
                </Grid>

                <Grid item>
                    <InputLabel>Интервал, мс</InputLabel>
                    <TextField
                        error={formik.errors.repeat_interval && formik.touched.repeat_interval}
                        id="repeat_interval"
                        placeholder="Интервал, мс"
                        variant="outlined"
                        type="number"
                        name="repeat_interval"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.repeat_interval}
                    />
                    <ErrorMessage error={formik.errors.repeat_interval} touched={formik.touched.repeat_interval} />
                </Grid>

                <Grid item>
                    <InputLabel>Количество итераций</InputLabel>
                    <TextField
                        error={formik.errors.repeat_times && formik.touched.repeat_times}
                        id="repeat_times"
                        placeholder="Количество итераций"
                        variant="outlined"
                        type="number"
                        name="repeat_times"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.repeat_times}
                    />
                    <ErrorMessage error={formik.errors.repeat_times} touched={formik.touched.repeat_times} />
                </Grid>

                <Grid item>
                    <InputLabel>Частота обработки</InputLabel>
                    <TextField
                        error={formik.errors.sample_rate && formik.touched.sample_rate}
                        id="sample_rate"
                        placeholder="Частота обработки"
                        variant="outlined"
                        type="number"
                        name="sample_rate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.sample_rate}
                    />
                    <ErrorMessage error={formik.errors.sample_rate} touched={formik.touched.sample_rate} />
                </Grid>

                <Grid item>
                    <InputLabel>Число точек</InputLabel>
                    <TextField
                        error={formik.errors.data_count && formik.touched.data_count}
                        id="data_count"
                        placeholder="Число точек"
                        variant="outlined"
                        type="number"
                        name="data_count"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.data_count}
                    />
                    <ErrorMessage error={formik.errors.data_count} touched={formik.touched.data_count} />
                </Grid>

            </Grid>

        </Paper>
    )
}

export default ControllerConfigurator