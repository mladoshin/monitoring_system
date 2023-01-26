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

export { avg, rms, RmsAvg }
