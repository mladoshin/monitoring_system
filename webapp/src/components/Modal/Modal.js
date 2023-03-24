import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    ThemeProvider,
    Typography,
} from '@mui/material'
import { Formik, useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import {
    calibrateChannel,
    pollCalibrationResults,
} from '../../api'
import './Modal.scss'
import { toast } from 'react-toastify'
import { CONVERSION_TYPES } from '../../constants/config'

const defaultConversion = {
    DataType: 'G',
    Algorithm: {
        CustomParameter: '',
    },
}

function ConversionCard({ idx, handleRemoveConversion }) {
    const formik = useFormikContext()
    const isCustom = formik.values.Conversion[idx].DataType === 'Customization'

    return (
        <Paper
            sx={{
                px: '30px',
                py: '15px',
                display: 'flex',
                gap: '20px',
                backgroundColor: '#efefef',
            }}
            elevation={1}
        >
            <Select
                value={formik.values.Conversion[idx].DataType}
                placeholder="Data Type"
                name={`Conversion[${idx}].DataType`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="select"
            >
                {CONVERSION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </Select>

            {isCustom && (
                <TextField
                    value={
                        formik.values.Conversion[idx].Algorithm?.CustomParameter
                    }
                    placeholder="Custom parameter"
                    name={`Conversion[${idx}].Algorithm.CustomParameter`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            )}
            <Button
                variant="outlined"
                color="error"
                onClick={() =>
                    handleRemoveConversion(
                        idx,
                        formik.values.Conversion,
                        formik.setFieldValue
                    )
                }
                sx={{ marginLeft: 'auto' }}
            >
                Delete
            </Button>
        </Paper>
    )
}

function Modal({ open = false, onClose, channel, saveChannel }) {
    const toastId = React.useRef(null)
    const [isCalibrating, setIsCalibrating] = useState(false)

    const formik = {
        initialValues: {
            enabled: channel?.enabled ?? false,
            Coupling: channel?.Coupling,
            InputRange: channel?.InputRange || 'B10',
            IEPE: channel?.IEPE || 'Disabled',
            Sensor: {
                Type: channel?.Channel?.Sensor?.Type || 'Accelerometer',
                Sensitivity: channel?.Channel?.Sensor?.Sensitivity || '1000',
            },
            Conversion: channel?.Conversion || [defaultConversion],
            calibration: {
                standard_amplitude: 10,
            },
        },
        onSubmit: (values) => {
            console.log(values)
            saveChannel(channel.Channel.Port, values)

            toast(`Конфигурация порта ${channel.Channel.Port} сохранена`, {
                position: 'bottom-right',
                type: 'success',
                autoClose: 3000,
                hideProgressBar: true,
            })
            onClose()
        },
    }

    function handleCalibrate({ values, setFieldValue }) {
        setIsCalibrating(true)
        toastId.current = toast(
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <CircularProgress size="30px" /> <p>Загрузка...</p>
            </Box>,
            { position: 'bottom-right', hideProgressBar: true }
        )

        calibrateChannel({
            standard_amplitude: values.standard_amplitude,
            channel_id: channel.Channel.Port?.slice(2),
        })
            .then(async () => {
                toast.update(toastId.current, {
                    render: `Выполняется калибровка`,
                    position: 'bottom-right',
                    type: 'info',
                    autoClose: false,
                    hideProgressBar: true,
                })
                const channel_id = channel.Channel.Port?.slice(2)

                pollCalibrationResults({
                    channel_id: channel_id,
                    interval: 3000,
                })
                    .then((res) => {
                        const temp = { ...values }
                        console.log(temp)
                        temp.Sensor.Sensitivity = res.scale_factor
                        saveChannel(channel.Channel.Port, temp)
                        setFieldValue('Sensor.Sensitivity', res.scale_factor)
                        toast.update(toastId.current, {
                            render: `Калибровка выполнена`,
                            position: 'bottom-right',
                            type: 'success',
                            autoClose: 4000,
                            hideProgressBar: true,
                        })
                        setIsCalibrating(false)
                    })
                    .catch((err) => {
                        setIsCalibrating(false)
                        toast.update(toastId.current, {
                            render: `Ошибка! ${err}`,
                            position: 'bottom-right',
                            type: 'error',
                            autoClose: 4000,
                            hideProgressBar: true,
                        })
                    })
            })
            .catch((err) => {
                setIsCalibrating(false)
                console.log(err.message)
            })
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
            <div className="inner">
                {channel && (
                    <Formik {...formik}>
                        {(props) => (
                            <>
                                <div>
                                    <div className="header">
                                        <Button
                                            variant="outlined"
                                            onClick={onClose}
                                        >
                                            Назад
                                        </Button>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            onClick={props.handleSubmit}
                                        >
                                            Сохранить изменения
                                        </Button>
                                    </div>

                                    <Paper
                                        sx={{
                                            px: '30px',
                                            py: '15px',
                                            display: 'flex',
                                            gap: '20px',
                                            backgroundColor: '#efefef',
                                            alignItems: 'center',
                                            my: '20px',
                                        }}
                                        elevation={0}
                                    >
                                        <Typography variant="h5">
                                            Канал {channel.Channel.Port}
                                        </Typography>
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                            sx={{ bgcolor: '#757575' }}
                                        />
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

                                    <Grid
                                        container
                                        justifyContent="start"
                                        alignItems="center"
                                        gap="20px"
                                        py="10px"
                                    >
                                        <Grid item>
                                            <InputLabel>Coupling</InputLabel>
                                            <Select
                                                error={
                                                    props?.errors?.Coupling &&
                                                    props.touched?.Coupling
                                                }
                                                value={props.values.Coupling}
                                                placeholder="Coupling"
                                                name="Coupling"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="select"
                                            >
                                                <MenuItem value="AC">
                                                    AC
                                                </MenuItem>
                                                <MenuItem value="DC">
                                                    DC
                                                </MenuItem>
                                            </Select>
                                        </Grid>

                                        <Grid item>
                                            <InputLabel>Входной диапазон</InputLabel>
                                            <Select
                                                error={
                                                    props?.errors?.InputRange &&
                                                    props.touched?.InputRange
                                                }
                                                value={props.values.InputRange}
                                                placeholder="InputRange"
                                                name="InputRange"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="select"
                                            >
                                                <MenuItem value="B10">
                                                    ±10
                                                </MenuItem>
                                                <MenuItem value="B1d25">
                                                    ±1.25
                                                </MenuItem>
                                            </Select>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        container
                                        justifyContent="start"
                                        alignItems="center"
                                        gap="20px"
                                        py="10px"
                                    >
                                        <Grid item>
                                            <InputLabel>Тип сенсора</InputLabel>
                                            <Select
                                                value={props.values.Sensor.Type}
                                                placeholder="Sensor Type"
                                                name="Sensor.Type"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                className="select"
                                            >
                                                <MenuItem value="Accelerometer">
                                                    Accelerometer
                                                </MenuItem>
                                            </Select>
                                        </Grid>

                                        <Grid item>
                                            <InputLabel>Чувствительность, mV/g</InputLabel>
                                            <TextField
                                                value={
                                                    props.values.Sensor
                                                        .Sensitivity
                                                }
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
                                                <MenuItem value="Disable">
                                                    Disable
                                                </MenuItem>
                                                <MenuItem value="Enable">
                                                    Enable
                                                </MenuItem>
                                            </Select>
                                        </Grid>
                                    </Grid>

                                    <Divider />

                                    <Typography
                                        variant="h5"
                                        sx={{ marginTop: '15px' }}
                                    >
                                        Типы данных
                                    </Typography>
                                    <Grid
                                        container
                                        direction="column"
                                        gap="20px"
                                        py="20px"
                                    >
                                        {props.values.Conversion?.map(
                                            (conv, i) => (
                                                <Grid item>
                                                    <ConversionCard
                                                        key={i}
                                                        idx={i}
                                                        handleRemoveConversion={
                                                            handleRemoveConversion
                                                        }
                                                    />
                                                </Grid>
                                            )
                                        )}
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleAddConversion(
                                                props.values.Conversion,
                                                props.setFieldValue
                                            )
                                        }
                                        sx={{ marginTop: '25px' }}
                                    >
                                        Добавить тип данных
                                    </Button>
                                </div>

                                <h2 style={{ marginTop: '2rem' }}>
                                    Калибровка канала
                                </h2>
                                <div className="calibration_form">
                                    <div>
                                        <InputLabel>
                                            Эталонная амплитуда
                                        </InputLabel>
                                        <TextField
                                            value={
                                                props.values.calibration
                                                    .standard_amplitude
                                            }
                                            placeholder="10"
                                            name="calibration.standard_amplitude"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    <Button
                                        variant="contained"
                                        disabled={isCalibrating}
                                        type="submit"
                                        onClick={() =>
                                            handleCalibrate({
                                                values: props.values,
                                                setFieldValue:
                                                    props.setFieldValue,
                                            })
                                        }
                                    >
                                        Калибровать канал
                                    </Button>
                                </div>
                            </>
                        )}
                    </Formik>
                )}

                {/* <div className="graph-section">
                    <hr />
                    <h2>Спектр канала {channel?.Channel?.Port}</h2>
                    <Button variant="contained" onClick={updateRawData}>
                        Обновить
                    </Button>

                    {rawdata.length > 0 && (
                        <div>
                            <Chart data={rawdata} />
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    )
}

export default Modal
