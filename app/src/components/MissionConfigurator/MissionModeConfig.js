import React from 'react'
import { Grid, InputLabel, Paper, TextField, Typography } from '@mui/material'
import ErrorMessage from '../ErrorMessage';
import { useFormikContext } from 'formik';

function MissionModeConfig() {
    const formik = useFormikContext();

    return (
        <Paper sx={{ width: '100%', padding: '25px', marginTop: '50px' }}>
            <Typography variant='h5'>
                Параметры испытания
            </Typography>


            <Grid container spacing={2}>
                <Grid item>
                    <InputLabel>Режим испытания</InputLabel>
                    <TextField
                        error={formik.errors.directory_name && formik.touched.directory_name}
                        id="directory_name"
                        placeholder="Режим испытания"
                        variant="outlined"
                        type="text"
                        name="directory_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.directory_name}
                    />
                    <ErrorMessage error={formik.errors.directory_name} touched={formik.touched.directory_name} />
                </Grid>

                <Grid item>
                    <InputLabel>Номер теста</InputLabel>
                    <TextField
                        error={formik.errors.file_name && formik.touched.file_name}
                        id="file_name"
                        placeholder="Номер теста"
                        variant="outlined"
                        type="text"
                        name="file_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.file_name}
                    />
                    <ErrorMessage error={formik.errors.file_name} touched={formik.touched.file_name} />
                </Grid>

            </Grid>

        </Paper>
    )
}

export default MissionModeConfig