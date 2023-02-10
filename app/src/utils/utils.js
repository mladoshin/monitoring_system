function transformGRawData(data, limit = 1000) {
    return data
        .split(',\n')
        .map((el, idx) => ({ x: idx, y: +el * 10 }))
        .slice(0, limit)
}

export {transformGRawData}
