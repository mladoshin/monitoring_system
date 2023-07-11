import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000';

export async function startMission(data) {
    const res = await axios.post(`/api/start-mission`, data)
    return res
}

export async function stopMission() {
    const res = await axios.delete(`/api/mission`)
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
    return res
}

export async function calibrateChannel(body) {
    const res = await axios.post(`/api/calibrate-channel`, body)
    return res
}

export async function fetchCalibrationResults(channel_id) {
    const res = await axios
        .get(`/api/calibrate-channel`, { params: { channel_id } })
        .catch((err) => console.log(err))
    return res
}

export async function fetchGRawdata(channel_id) {
    const res = await axios
        .get(`/api/get-g-rawdata`, { params: { channel_id } })
        .catch((err) => console.log(err))
    return res
}

export async function pollCalibrationResults({
    interval = 3000,
    channel_id,
    timeout = 10000,
}) {
    let res = null
    const counter = { value: 0 }

    let poll = new Promise(async (resolve, reject) => {
        setTimeout(() => tick(resolve, reject, counter), interval)
    })

    async function tick(resolve, reject, counter) {
        if (counter.value >= timeout / interval) {
            reject('timeout')
            return
        }

        res = await fetchCalibrationResults(channel_id)
        if (res?.data) {
            resolve(res.data)
            return
        }
        //console.log(counter.value)
        counter.value += 1
        setTimeout(() => tick(resolve, reject, counter), interval)
    }

    return poll
}

export async function pollGRawData({
    interval = 3000,
    channel_id,
    timeout = 10000,
}) {
    let res = null
    const counter = { value: 0 }

    let poll = new Promise(async (resolve, reject) => {
        setTimeout(() => tick(resolve, reject, counter), interval)
    })

    async function tick(resolve, reject, counter) {
        if (counter.value >= timeout / interval) {
            reject('timeout')
            return
        }

        res = await fetchGRawdata(channel_id)
        if (res?.data) {
            resolve(res.data)
            return
        }
        //console.log(counter.value)
        counter.value += 1
        setTimeout(() => tick(resolve, reject, counter), interval)
    }

    return poll
}

export async function getUserProfiles({ profile_name } = {}) {
    let res = null
    if (profile_name) {
        res = await axios
            .get(`/api/user-profile`, { params: { profile_name } })
            .catch((err) => console.log(err))
    } else {
        res = await axios
            .get(`/api/user-profiles`)
            .catch((err) => console.log(err))
    }

    return res?.data
}

export async function addUserProfile({ profile_name, data }) {
    if (!profile_name) return

    //console.log(profile_name)

    const res = await axios
        .post(`/api/user-profiles`, { profile_name, data })
        .catch((err) => console.log(err))

    return res?.data
}

export async function removeUserProfile(profile_name) {
    if (!profile_name) return

    const res = await axios
        .delete(`/api/user-profiles`, { params: { profile_name } })
        .catch((err) => console.log(err))

    return res?.data
}

export async function getFile(path, options) {
    const res = await axios
        .get(`/api/mic-file`, { params: { path }, ...options })
        .catch((err) => console.log(err))

    return res
}

export async function pollFile({ interval = 3000, path, timeout = 300000 }) {
    let res = null
    const counter = { value: 0 }

    let poll = new Promise(async (resolve, reject) => {
        setTimeout(() => tick(resolve, reject, counter), interval)
    })

    async function tick(resolve, reject, counter) {
        if (counter.value >= timeout / interval) {
            reject('timeout')
            return
        }

        res = await getFile(path)
        console.log(res)
        if (res?.data && res.statusText=='OK') {
            resolve(res.data)
            return
        }
        counter.value += 1
        setTimeout(() => tick(resolve, reject, counter), interval)
    }

    return poll
}