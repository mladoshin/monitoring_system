import axios from 'axios'

export async function startMission(data) {
    const res = await axios.post(`/api/start-mission`, data)
    return res
}

export async function getAllFiles() {
    const res = await axios
        .get(`/api/get-files`)
        .catch((err) => console.log(err))
    return res?.data
}

export async function generateResult(body) {
    const res = await axios
        .post(`/api/generate-result`, { ...body }, { responseType: 'blob' })
        .catch((err) => console.log(err))
    return res
}

export async function connectController() {
    const res = await axios
        .post(`/api/connect-controller`)
        .catch((err) => console.log(err))
    console.log(res.data)
    return res
}

export async function calibrateChannel(body) {
    const res = await axios.post(`/api/calibrate-channel`, body)
    return res
}

export async function fetchCalibrationResults(channel_id) {
    const res = await axios.get(`/api/calibrate-channel`, {params: {channel_id}}).catch(err => console.log(err))
    return res
}


export async function pollCalibrationResults({interval=3000, channel_id, timeout=10000}) {
    let res = null;
    const counter = {value: 0}

    let poll = new Promise(async (resolve, reject) => {
        setTimeout(()=>tick(resolve, reject, counter), interval)
    })

    async function tick(resolve, reject, counter){
        if (counter.value >= timeout / interval){
            reject("timeout")
            return
        }

        res = await fetchCalibrationResults(channel_id)
        if (res?.data){
            resolve(res.data)
            return
        }
        console.log(counter.value)
        counter.value += 1
        setTimeout(()=>tick(resolve, reject, counter), interval)
    }

    return poll
}