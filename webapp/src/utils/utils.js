function transformGRawData(data, limit = 1000) {
    return data
        .split(',\n')
        .map((el, idx) => ({ x: idx, y: +el }))
        .slice(0, limit)
}

function transformMetrics(metrics_arr) {
    const obj = metrics_arr.reduce(
        (cur, { channel, ...data }) =>
            (cur = { ...cur, [channel]: { ...data } }),
        {}
    )
    return obj
}

function preventEnterKey(e) {
    const key = e.charCode || e.keyCode || 0
    if (key == 13) {
        e.preventDefault()
    }
}

export { transformGRawData, transformMetrics, preventEnterKey }
