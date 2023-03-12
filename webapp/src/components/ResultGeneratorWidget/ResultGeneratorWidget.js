import { Button, Checkbox, FormControlLabel, Grid, InputLabel, Paper, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react'
import ErrorMessage from '../ErrorMessage';

function ResultGeneratorWidget({ generateResult }) {
    const formik = useFormik({
        initialValues: {
            mode: '',
            file_name: '',
            all_modes: true,
            save_on_server: false
        },
        validate: (values) => {
            let errors = {}
            if (!values.file_name) {
                errors.file_name = 'Обязательное поле!'
            } else if (values.file_name.includes('.')) {
                errors.file_name = 'Некорректное имя'
            }

            if (!values.all_modes && !values.mode) {
                errors.mode = 'Обязательное поле'
            }

            return errors
        },
        onSubmit: values => {
            generateResult(values)
                .then(res => {
                    toast.success("Файл успешно сгенерирован!")
                    handleDownloadFile(res, `${formik.values.file_name}.xlsx`)
                })
                .catch(err => {
                    toast.error(err.message)
                    console.log('Ошибка генерации файла')
                    console.log(err.message)
                })
        },
    });

    function handleDownloadFile(response, filename) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Paper sx={{ padding: '25px', marginTop: "50px", marginBottom: "50px" }}>
            <h2>Обработка MIC</h2>
            <form onSubmit={formik.handleSubmit}>
                <Grid container alignItems="start" columnSpacing={4}>
                    <Grid item xs={6}>
                        <InputLabel>Номер испытания</InputLabel>
                        <TextField
                            id="mode"
                            placeholder="Имя папки"
                            variant="outlined"
                            type="text"
                            name="mode"
                            value={formik.values.all_modes ? 'Все' : formik.values.mode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            sx={{ width: "100%" }}
                            error={formik.errors.mode && formik.touched.mode}
                            disabled={formik.values.all_modes}
                        />
                        <ErrorMessage error={formik.errors.mode} touched={formik.touched.mode} />
                        <FormControlLabel control={<Checkbox id="all_modes" name="all_modes" checked={formik.values.all_modes} onChange={formik.handleChange} />} label="Все режимы" />

                    </Grid>

                    <Grid item xs={6}>
                        <InputLabel>Имя нового файла</InputLabel>
                        <TextField
                            id="file_name"
                            placeholder="Имя нового файла"
                            variant="outlined"
                            type="text"
                            name="file_name"
                            value={formik.values.file_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            sx={{ width: "100%" }}
                            error={formik.errors.file_name && formik.touched.file_name}
                        />
                        <ErrorMessage error={formik.errors.file_name} touched={formik.touched.file_name} />
                    </Grid>

                </Grid>

                <Grid container justifyContent="end" sx={{ marginTop: "25px" }}>
                    <Grid item>
                        <FormControlLabel control={<Checkbox id="save_on_server" name="save_on_server" checked={formik.values.save_on_server} onChange={formik.handleChange} />} label="Сохранить на сервере" />
                    </Grid>

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

export default ResultGeneratorWidget