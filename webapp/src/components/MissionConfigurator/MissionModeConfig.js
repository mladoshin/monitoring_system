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


            <Grid container spacing={3} sx={{maxWidth: "600px"}}>
                <Grid item xs={6}>
                    <InputLabel>Номер испытания</InputLabel>
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
                        sx={{width: "100%"}}
                    />
                    <ErrorMessage error={formik.errors.directory_name} touched={formik.touched.directory_name} />
                </Grid>

                <Grid item xs={6}>
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
                        sx={{width: "100%"}}
                    />
                    <ErrorMessage error={formik.errors.file_name} touched={formik.touched.file_name} />
                </Grid>

                <Grid item xs={12}>
                    <InputLabel>Комментарий</InputLabel>
                    <TextField
                        error={formik.errors.comment && formik.touched.comment}
                        placeholder="Комментарий"
                        variant="outlined"
                        type="text"
                        multiline
                        rows={4}
                        name="comment"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.comment}
                        sx={{width: "100%"}}
                    />
                    <ErrorMessage error={formik.errors.comment} touched={formik.touched.comment} />
                </Grid>

            </Grid>

        </Paper>
    )
}

export default MissionModeConfig