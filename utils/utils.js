import { MIC_ENUM, MODE, SCADA_ENUM } from "../enums.js"

function avg(arr) {
    let sum = 0
    let count = 0
    for (let num of arr) {
        sum += num
        count++
    }

    if (count === 0) {
        return null
    }

    return sum / count
}

function rms(arr) {
    let sum = 0
    let count = 0
    for (let num of arr) {
        sum += num ** 2
        count++
    }

    if (count === 0) {
        return null
    }

    return (sum / count) ** 0.5
}

function RmsAvg(arr) {
    let rms = null
    let avg = null

    let sum_avg = 0
    let sum_rms = 0
    let count = 0
    for (let num of arr) {
        sum_avg += num
        sum_rms += num ** 2
        count++
    }

    if (count !== 0) {
        rms = (sum_rms / count)**0.5
        avg = sum_avg / count
    }

    return {rms, avg}
}

function _transformToStatData(str){
    const arr = str.split(', ').filter(el => el !== '')
    return arr
}

const _axisGenerator = function* (num, str) {
    for (let i = 1; i <= num; i++) {
        yield `${str}${i}`
    }
}

const _jsonGenerator = (params, mode) => {
    const res = {}
    if (mode === MODE.TESTING) {
        params.forEach((p, i) => (res[MIC_ENUM[i + 24]] = p))
    } else if (mode === MODE.MONITORING) {
        params.forEach((p, i) => (res[SCADA_ENUM[i + 46]] = p))
    }
    return res
}

const G_DataInfo = (arr) => {
    let rms = null
    let avg = null
    let max = arr[0]

    let sum_avg = 0
    let sum_rms = 0
    let count = 0
    for (let num of arr) {
        sum_avg += num
        sum_rms += num ** 2
        count++
        if(num > max) max = num;
    }

    if (count !== 0) {
        rms = (sum_rms / count)**0.5
        avg = sum_avg / count
    }

    return {rms, avg, peak: max}
}

export { avg, rms, RmsAvg, _transformToStatData, _axisGenerator, _jsonGenerator, G_DataInfo }
