import { Button, Checkbox, Divider, Grid, InputLabel, MenuItem, Paper, Select, TextField, ThemeProvider, Typography } from '@mui/material'
import { Formik, useFormik, useFormikContext } from 'formik'
import React from 'react'
import "./Modal.scss"

const defaultConversion = {
    DataType: "G",
    Algorithm: {
        CustomParameter: ""
    }
}

function ConversionCard({ idx, handleRemoveConversion }) {
    const formik = useFormikContext();
    const isCustom = formik.values.Conversion[idx].DataType === 'Customization'

    return (
        <Paper sx={{ px: "30px", py: "15px", display: 'flex', gap: "20px", backgroundColor: '#efefef' }} elevation={1}>
            <Select
                value={formik.values.Conversion[idx].DataType}
                placeholder="Data Type"
                name={`Conversion[${idx}].DataType`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="select"
            >
                <MenuItem value="RawData">RawData</MenuItem>
                <MenuItem value="Voltage">Voltage</MenuItem>
                <MenuItem value="G">G</MenuItem>
                <MenuItem value="Customization">Customization</MenuItem>
            </Select>

            {
                isCustom &&
                <TextField
                    value={formik.values.Conversion[idx].Algorithm?.CustomParameter}
                    placeholder="Custom parameter"
                    name={`Conversion[${idx}].Algorithm.CustomParameter`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            }
            <Button
                variant='outlined'
                color="error"
                onClick={() => handleRemoveConversion(idx, formik.values.Conversion, formik.setFieldValue)}
                sx={{ marginLeft: 'auto' }}
            >
                Delete
            </Button>
        </Paper>
    )
}

function Modal({ open = false, onClose, channel, saveChannel }) {

    const formik = {
        initialValues: {
            enabled: channel?.enabled ?? false,
            Coupling: channel?.Coupling,
            InputRange: channel?.InputRange || "B10",
            IEPE: channel?.IEPE || "Disabled",
            Sensor: {
                Type: channel?.Sensor?.Type || "Accelerometer",
                Sensitivity: channel?.Sensor?.Sensitivity || "1000"
            },
            Conversion: channel?.Conversion || [defaultConversion]
        },
        onSubmit: (values) => {
            console.log(values)
            saveChannel(channel.Channel.Port, values)
        }
    }

    function handleAddConversion(conversions, setFieldValue) {
        const temp = [...conversions, defaultConversion]
        setFieldValue('Conversion', temp)
    }

    function handleRemoveConversion(idx, conversions, setFieldValue) {
        const temp = [...conversions]
        temp.splice(idx, 1)
        setFieldValue('Conversion', temp)
    }

    return (
        <div className={`modal-wrapper ${!open ? 'closed' : ''}`}>
            <div className='inner'>
                {channel && <Formik {...formik}>
                    {props => (
                        <div>
                            <div className='header'>
                                <Button variant='outlined' onClick={onClose}>Назад</Button>
                                <Button variant='contained' type='submit' onClick={props.handleSubmit}>Сохранить изменения</Button>
                            </div>

                            <Paper sx={{ px: "30px", py: "15px", display: 'flex', gap: "20px", backgroundColor: '#efefef', alignItems: 'center', my: "20px" }} elevation={0}>
                                <Typography variant='h5'>Канал {channel.Channel.Port}</Typography>
                                <Divider orientation="vertical" flexItem sx={{bgcolor: '#757575'}}/>
                                <Typography>Включен</Typography>
                                <Checkbox
                                    edge="start"
                                    tabIndex={-1}
                                    disableRipple
                                    checked={props.values.enabled}
                                    name="enabled"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                            </Paper>

                            <Grid container justifyContent="start" alignItems="center" gap="20px" py="10px">
                                <Grid item>
                                    <InputLabel>Coupling</InputLabel>
                                    <Select
                                        error={props?.errors?.Coupling && props.touched?.Coupling}
                                        value={props.values.Coupling}
                                        placeholder="Coupling"
                                        name="Coupling"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="select"
                                    >
                                        <MenuItem value="AC">AC</MenuItem>
                                        <MenuItem value="DC">DC</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item>
                                    <InputLabel>Input range</InputLabel>
                                    <Select
                                        error={props?.errors?.InputRange && props.touched?.InputRange}
                                        value={props.values.InputRange}
                                        placeholder="InputRange"
                                        name="InputRange"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="select"
                                    >
                                        <MenuItem value="B10">±10</MenuItem>
                                        <MenuItem value="B1d25">±1.25</MenuItem>
                                    </Select>
                                </Grid>

                            </Grid>


                            <Grid container justifyContent="start" alignItems="center" gap="20px" py="10px">
                                <Grid item>
                                    <InputLabel>Sensor type</InputLabel>
                                    <Select
                                        value={props.values.Sensor.Type}
                                        placeholder="Sensor Type"
                                        name="Sensor.Type"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="select"
                                    >
                                        <MenuItem value="Accelerometer">Accelerometer</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item>
                                    <InputLabel>Sensitivity</InputLabel>
                                    <TextField
                                        value={props.values.Sensor.Sensitivity}
                                        placeholder="Sensor Sensitivity"
                                        name="Sensor.Sensitivity"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </Grid>

                                <Grid item>
                                    <InputLabel>IEPE</InputLabel>
                                    <Select
                                        value={props.values.IEPE}
                                        placeholder="IEPE"
                                        name="IEPE"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="select"
                                    >
                                        <MenuItem value="Disable">Disable</MenuItem>
                                        <MenuItem value="Enable">Enable</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Divider/>

                            <Typography variant='h5' sx={{marginTop: "15px"}}>Типы данных</Typography>
                            <Grid container direction="column" gap="20px" py="20px">
                                {props.values.Conversion?.map((conv, i) => (
                                    <Grid item>
                                        <ConversionCard key={i} idx={i} handleRemoveConversion={handleRemoveConversion} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Button
                                variant='contained'
                                onClick={() => handleAddConversion(props.values.Conversion, props.setFieldValue)}
                                sx={{ marginTop: '25px' }}
                            >
                                Добавить тип данных
                            </Button>

                        </div>
                    )}
                </Formik>}
            </div>
        </div>
    )
}



export default Modal