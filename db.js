import pkg from 'pg';
import { MIC_ENUM } from './enums.js';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'monitoring_system',
    password: '1234',
    port: 5432,
})

async function connect() {
    await client.connect()
}

async function disconnect() {
    await client.end()
}

async function main() {
    connect()

    const query = {
        text: 'insert into test (timestamp, value) values($1::timestamptz, $2)',
        values: [new Date().toISOString(), 2],
    }

    const res = await client.query(query)
    console.log(res.rows)

    disconnect()
}


async function writeData(data) {

    const parameters = []
    const args = []
    let key;

    for (let i = 13; i <= 40; i++) {
        key = MIC_ENUM[i]
        parameters.push(key)
        args.push(data[key])
    }

    const query = {
        text: 'insert into mic_data (timestamp, channel, ag100, agm155_185, fgm155_185, ag1450, ag2900, ag4350, ag5800, ag7250, agm1_fm, fgm1_fm, m155_185, m12_10, m210_20, m320_30, m430_40, m540_50, m650_60, m760_70, m870_80, m1g2_10, m1g10_20, m1g20_30, m1g30_40, m1g40_50, m1g50_60, m1g60_70, m1g70_80, m1_5000) values($1::timestamptz, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)',
        values: [new Date().toISOString(), data.channel, ...args],
    }

    const res = await client.query(query)
        .catch(err => console.log(err.message))

}

export { writeData, main, connect, disconnect }