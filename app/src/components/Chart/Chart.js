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
                    toolbar: {
                        autoSelected: 'pan',
                        show: false,
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
