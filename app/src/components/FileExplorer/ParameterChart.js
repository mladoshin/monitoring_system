import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

function ParameterChart({ data, xaxis }) {

    const options = useMemo(() => {
        return {
            series: [
                {
                    data: data,
                },
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    type: 'numeric',
                    setY: -20,
                    formatter: function (val, opts) {
                        return parseFloat(val).toPrecision(4)
                    },
                    style: {
                        fontSize: '12px',
                        colors: ['#304758'],
                    },
                },

                xaxis: {
                    categories: xaxis,
                    position: 'bottom',
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            },
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                yaxis: {
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                            return parseFloat(val).toPrecision(4)
                        },
                    },
                },
                title: {
                    text: 'Параметры',
                    floating: true,
                    offsetY: 0,
                    align: 'center',
                    style: {
                        color: '#444',
                    },
                },
            },
        }
    }, [data])

    return (
        <div id="chart">
            <ReactApexChart
                options={options.options}
                series={options.series}
                type="bar"
                height={350}
            />
        </div>
    )
}

export default ParameterChart
