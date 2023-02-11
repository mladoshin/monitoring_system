function transformGRawData(data, limit = 1000) {
    return data
        .split(',\n')
        .map((el, idx) => ({ x: idx, y: +el * 10 }))
        .slice(0, limit)
}

function transformMetrics(metrics_arr){
    const obj = metrics_arr.reduce((cur, {channel, ...data}) =>   
        cur = {...cur, [channel]: {...data}}, {})
    return obj
}


export {transformGRawData, transformMetrics}
