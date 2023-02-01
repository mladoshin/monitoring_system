import React, { useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'

function Chart({ data }) {
    // useEffect(() => {
    //     ApexCharts.exec('chart2', 'updateSeries', [
    //         {
    //             data: data,
    //         },
    //     ])
    // }, [data])

    const options = React.useMemo(() => {
        return {
            series: [
                {
                    data: data,
                },
            ],
            options: {
                chart: {
                    id: 'chart2',
                    type: 'line',
                    height: 330,
                    events: {
                        mounted: function (chartContext, config) {
                            console.log('Loaded')
                        },
                    },
                    toolbar: {
                        autoSelected: 'pan',
                        show: true,
                        tools: {
                            download: true,
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: true,
                            reset:
                                true |
                                '<img src="/static/icons/reset.png" width="20">',
                        },
                    },
                },
                colors: ['#009be5'],
                stroke: {
                    width: 3,
                },
                dataLabels: {
                    enabled: false,
                },
                fill: {
                    opacity: 1,
                },
                markers: {
                    size: 0,
                },
                xaxis: {
                    type: 'numeric',
                },
                yaxis: {
                    type: 'numeric',
                    decimalsInFloat: 4,
                },
            },

            seriesLine: [
                {
                    data: data,
                },
            ],
            optionsLine: {
                chart: {
                    id: 'chart1',
                    height: 130,
                    type: 'area',
                    events: {
                        mounted: function (chartContext, config) {
                            console.log('Loaded brush')
                        },
                    },
                    brush: {
                        target: 'chart2',
                        enabled: true,
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: 0,
                            max: data.length + 1,
                        },
                    },
                },
                colors: ['#008FFB'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.91,
                        opacityTo: 0.1,
                    },
                },
                xaxis: {
                    type: 'numeric',
                },
                yaxis: {
                    tickAmount: 2,
                    decimalsInFloat: 3,
                },
            },
        }
    }, [data])

    return (
        // <div id="chart">
        //     <ReactApexChart
        //         options={options.options}
        //         series={options.series}
        //         type="area"
        //         height={350}
        //     />
        // </div>

        <div id="wrapper">
            <div id="chart-line2">
                <ReactApexChart
                    options={options.options}
                    series={options.series}
                    type="line"
                    height={330}
                />
            </div>
            <div id="chart-line">
                <ReactApexChart
                    options={options.optionsLine}
                    series={options.seriesLine}
                    type="area"
                    height={130}
                />
            </div>
        </div>
    )
}

export default Chart
