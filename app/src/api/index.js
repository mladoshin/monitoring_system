import axios from 'axios';

export async function startMission(data) {
    const res = await axios.post(`/api/start-mission`, data)
    return res
}

export async function getAllFiles() {
    const res = await axios.get(`/api/get-files`).catch(err => console.log(err))
    return res?.data
}

export async function generateResult(body) {
    const res = await axios.post(`/api/generate-result`, {...body}).catch(err => console.log(err))
    return res?.data
}