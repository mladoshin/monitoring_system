import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import './FileModal.scss'
import ParameterChart from './ParameterChart'
import ReactJson from 'react-json-view'
import { MODE } from '../../../../common/enums.mjs'
import { _axisGenerator, _jsonGenerator } from '../../../../common/utils/utils.mjs'
import { transformGRawData } from '../../utils/utils'
import Chart from '../Chart'

function FileModal({ open, handleClose, data = {}, fileName = '' }) {
    const [rawdata, setRawdata] = useState({})
    const [chartData, setChartData] = useState({ xaxis: [], data: [] })
    const isMIC = fileName.endsWith('.csv')
    const isDAT = fileName.endsWith('.dat')

    useEffect(() => {
        if (typeof data === 'object') {
            setRawdata(data)
        }

        if (!open || typeof data === 'object') return

        if (isDAT) {
            // handle .dat files
            setRawdata(transformGRawData(data))
            // console.log(transformGRawData(data))
            return
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
                    {!isDAT && <div className="raw-file">
                        <ReactJson src={rawdata} />
                    </div>}

                    {isMIC && (
                        <ParameterChart
                            data={chartData.data}
                            xaxis={chartData.xaxis}
                        />
                    )}

                    {isDAT && rawdata?.length > 0 && (
                        <Chart data={rawdata}/>
                    )}

                </div>
            </Box>
        </Modal>
    )
}

export default FileModal
