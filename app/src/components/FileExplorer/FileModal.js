import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import './FileModal.scss'
import ParameterChart from './ParameterChart'
import ReactJson from 'react-json-view'
import { MIC_ENUM, SCADA_ENUM, MODE } from '../../../../enums'

const axis_generator = function* (num, str) {
    for (let i = 1; i <= num; i++) {
        yield `${str}${i}`
    }
}

const jsonGenerator = (params, mode) => {
    const res = {}
    if (mode === MODE.TESTING) {
        params.forEach((p, i) => (res[MIC_ENUM[i + 24]] = p))
    } else if (mode === MODE.MONITORING) {
        params.forEach((p, i) => (res[SCADA_ENUM[i + 46]] = p))
    }
    return res
}

function FileModal({ open, handleClose, data = {}, fileName = '' }) {
    const [rawdata, setRawdata] = useState({})
    const [chartData, setChartData] = useState({ xaxis: [], data: [] })
    const isMIC = fileName.endsWith('.csv')

    useEffect(() => {
        if (typeof data === 'object') {
            setRawdata(data)
        }

        if (!open || typeof data === 'object') return

        if (fileName.endsWith('.dat')) {
            // handle .dat files
            setRawdata({ data: data.split(',') })
        }

        //handle MIC file and SCADA file
        if (data?.split(', ').length === 43) {
            // TESING mode
            const axis = []

            for (const el of axis_generator(8, 'M')) {
                axis.push(el)
            }

            const json = jsonGenerator(
                data?.split(', ').slice(25, 33),
                MODE.TESTING
            )

            setChartData({
                xaxis: axis,
                data: data?.split(', ').slice(25, 33),
            })

            setRawdata(json)
        } else if (data?.split(', ').length === 80) {
            //MONIToring mode

            const axis = []

            for (const el of axis_generator(16, 'A')) {
                axis.push(el)
            }

            setChartData({ xaxis: axis, data: data?.split(', ').slice(47, 63) })

            const json = jsonGenerator(
                data?.split(', ').slice(47, 63),
                MODE.MONITORING
            )

            setRawdata(json)
        }
    }, [open])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="modal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="inner">
                <div className="modal-header">
                    <h3>{fileName}</h3>
                    <Button variant="outlined" onClick={handleClose}>
                        закрыть
                    </Button>
                </div>
                <div className="main">
                    <div className="raw-file">
                        <ReactJson src={rawdata} />
                    </div>

                    {isMIC && (
                        <ParameterChart
                            data={chartData.data}
                            xaxis={chartData.xaxis}
                        />
                    )}
                </div>
            </Box>
        </Modal>
    )
}

export default FileModal
