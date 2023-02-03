import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import './FileModal.scss'
import ParameterChart from './ParameterChart'
import ReactJson from 'react-json-view'
import { MODE } from '../../../../enums'
import { _axisGenerator, _jsonGenerator } from '../../../../utils/utils'

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
        if (data?.split(', ')[1] == '8.1' || data?.split(', ')[1] == '8') {
            // TESING mode
            const axis = []

            for (const el of _axisGenerator(8, 'M')) {
                axis.push(el)
            }

            const json = _jsonGenerator(
                data?.split(', ').slice(25, 33),
                MODE.TESTING
            )

            setChartData({
                xaxis: axis,
                data: data?.split(', ').slice(25, 33),
            })

            setRawdata(json)
        } else {
            //MONIToring mode

            const axis = []

            for (const el of _axisGenerator(16, 'A')) {
                axis.push(el)
            }

            setChartData({ xaxis: axis, data: data?.split(', ').slice(47, 63) })

            const json = _jsonGenerator(
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
